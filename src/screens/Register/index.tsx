import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { CategorySelect } from "../CategorySelect";

import { Button } from "../../components/Forms/Button";
import { InputForm } from "../../components/Forms/InputForm";
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";

import {
  Container,
  Header,
  Title,
  Form,
  ButtonContainer,
  TrandactionTypeContainer,
} from "./styles";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuth } from "../../hooks/auth";

/////////////////////////////////////////////////

interface FormData {
  name: string;
  amount: string;
}

type NavigationProps = {
  navigate: (screen: string) => void;
};

const schema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
  amount: Yup.number()
    .typeError("Informe um valor numérico")
    .positive("O valor não pode ser negativo")
    .required("Preço é obrigatório"),
});

///////////////////////////////////////////////////

export function Register() {
  const { user } = useAuth();

  const [transactionType, setTransactionType] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria",
  });

  const navigation = useNavigation<NavigationProps>();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  /* ************************************************************************* */
  // SELECIONA O TIPO DE TRANSAÇÃO
  function handleTransactionTypeSelect(type: "positive" | "negative") {
    setTransactionType(type);
  }

  // ABRE E FECHA A "SCREEN" DE SELECIONAR A CATEGORIA
  function handleOpenSelectCategory() {
    setCategoryModalOpen(true);
  }
  function handleCloseSelectCategory() {
    setCategoryModalOpen(false);
  }

  // FAZ O REGISTRO DE UMA NOVA TRANSAÇÃO
  async function handleRegister(form: Partial<FormData>) {
    if (!transactionType) return Alert.alert("Selecione o tipo da transação");

    if (category.key === "category")
      return Alert.alert("Selecione uma categoria");

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    };

    try {
      const dataKey = `@gofinances:transactions_user:${user.id}`;

      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [...currentData, newTransaction];

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      console.log(dataFormatted);

      // deixa os inputs em branco outra vez e navega para a página de "Listagem"
      reset();
      setTransactionType("");
      setCategory({
        key: "category",
        name: "Categoria",
      });
      navigation.navigate("Listagem");

      // pega e exibe possíveis erros
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível cadastrar");
    }
  }

  /* ************************************************************************* */

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <InputForm
            name="name"
            control={control}
            error={errors.name && errors.name.message}
            placeholder="Nome"
            autoCapitalize="sentences"
            autoCorrect={false}
          />
          <InputForm
            name="amount"
            control={control}
            error={errors.amount && errors.amount.message}
            placeholder="Preço"
            keyboardType="numeric"
          />

          <TrandactionTypeContainer>
            <TransactionTypeButton
              type="up"
              title="Entrada"
              onPress={() => handleTransactionTypeSelect("positive")}
              isActive={transactionType === "positive"}
            />
            <TransactionTypeButton
              type="down"
              title="Saída"
              onPress={() => handleTransactionTypeSelect("negative")}
              isActive={transactionType === "negative"}
            />
          </TrandactionTypeContainer>

          <CategorySelectButton
            title={category.name}
            onPress={handleOpenSelectCategory}
          />

          <ButtonContainer>
            <Button title="Cadastrar" onPress={handleSubmit(handleRegister)} />
          </ButtonContainer>
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategory}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
