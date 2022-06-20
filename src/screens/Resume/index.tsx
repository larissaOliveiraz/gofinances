import React, { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { addMonths, format, subMonths } from "date-fns";
import { VictoryPie } from "victory-native";

import { HistoryCard } from "../../components/HistoryCard";
import { DataListProps } from "../Dashboard";
import { categories } from "../../utils/categories";

import { RFValue } from "react-native-responsive-fontsize";
import theme from "../../global/styles/theme";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { useTheme } from "styled-components";

import {
  Container,
  Header,
  Title,
  HistoryContainer,
  PieContainer,
  MonthSelect,
  MonthSelectButton,
  SelectIcon,
  Month,
} from "./styles";
import { ptBR } from "date-fns/locale";
import { LoadContainer } from "../Dashboard/styles";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

interface TotalByCategory {
  key: string;
  name: string;
  totalCard: string;
  totalPie: number;
  color: string;
  percent: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [historyData, setHistoryData] = useState<TotalByCategory[]>([]);

  const theme = useTheme();

  function handleChangeDate(action: "next" | "prev") {
    if (action === "next") {
      const newDate = addMonths(selectedDate, 1);
      setSelectedDate(newDate);
    } else {
      const newDate = subMonths(selectedDate, 1);
      setSelectedDate(newDate);
    }
  }

  // FAZ O CARREGAMENTO DO HISTÓRICO DE GASTOS
  async function loadHistoryData() {
    setIsLoading(true);

    //pega todas as transações feitas
    const dataKey = "@gofinances:transactions";
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    //filtra as transações e pega somente os gastos do mês e ano selecionados
    const expenses = responseFormatted.filter(
      (expense: DataListProps) =>
        expense.type === "negative" &&
        new Date(expense.date).getMonth() === selectedDate.getMonth() &&
        new Date(expense.date).getFullYear() === selectedDate.getFullYear()
    );

    //faz a somatória de todos os gastos, para que a porcentagem possa ser calculada
    const expensesTotal = expenses.reduce(
      (acc: number, expense: DataListProps) => {
        return acc + Number(expense.amount);
      },
      0
    );

    //armazena objetos em que cada objeto contém as informações de cada gasto
    const totalByCategory: TotalByCategory[] = [];

    //faz a somatória de gastos por categoria
    categories.forEach((category) => {
      let categorySum = 0;

      expenses.forEach((expense: DataListProps) => {
        if (expense.category === category.key) {
          categorySum += Number(expense.amount);
        }
      });

      if (categorySum > 0) {
        const totalCard = categorySum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        //calcula a porcentagem de cada gasto - para o gráfico
        const percent = `${((categorySum / expensesTotal) * 100).toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          totalCard,
          totalPie: categorySum,
          percent,
        });
      }
    });

    setHistoryData(totalByCategory);
    setIsLoading(false);
  }

  //CARREGA O HISTÓRICO SEMPRE QUE NAVEGAMOS ATÉ A SCREEN DE "RESUMO"
  useFocusEffect(
    useCallback(() => {
      loadHistoryData();
    }, [selectedDate])
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </LoadContainer>
      ) : (
        <HistoryContainer
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleChangeDate("prev")}>
              <SelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>
              {format(selectedDate, "MMMM, yyyy", { locale: ptBR })}
            </Month>

            <MonthSelectButton onPress={() => handleChangeDate("next")}>
              <SelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

          <PieContainer>
            <VictoryPie
              data={historyData}
              colorScale={historyData.map((category) => category.color)}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: "bold",
                  fill: theme.colors.shape,
                },
              }}
              labelRadius={80}
              x="percent"
              y="totalPie"
            />
          </PieContainer>

          {historyData.map((item) => (
            <HistoryCard
              key={item.key}
              title={item.name}
              amount={item.totalCard}
              color={item.color}
            />
          ))}
        </HistoryContainer>
      )}
    </Container>
  );
}
