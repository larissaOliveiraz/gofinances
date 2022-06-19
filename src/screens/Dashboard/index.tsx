import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components";

import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { HighCard } from "../../components/HighCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighCardsContainer,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer,
} from "./styles";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighDataProps {
  total: string;
  lastTransaction: string;
}

interface HighData {
  entries: HighDataProps;
  expences: HighDataProps;
  totalCount: HighDataProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highData, setHighData] = useState<HighData>({} as HighData);

  const theme = useTheme();

  function getLastTransactionDate(
    transactions: DataListProps[],
    type: "positive" | "negative"
  ) {
    const lastTransaction = Math.max.apply(
      Math,
      transactions
        .filter((transaction) => transaction.type === type)
        .map((transaction) => new Date(transaction.date).getTime())
    );

    return `${new Date(lastTransaction).getDate()} de ${new Date(
      lastTransaction
    ).toLocaleString("pt-BR", { month: "long" })}`;
  }

  async function loadTransactions() {
    const dataKey = "@gofinances:transactions";
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expencesTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        let amountFormat = Number(item.amount).toLocaleString("pt-Br", {
          style: "currency",
          currency: "BRL",
        });

        amountFormat = amountFormat.replace("R$", "R$ ");

        const dateFormat = Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).format(new Date(item.date));

        if (item.type === "positive") {
          entriesTotal += Number(item.amount);
        } else {
          expencesTotal += Number(item.amount);
        }

        return {
          id: item.id,
          type: item.type,
          name: item.name,
          amount: amountFormat,
          category: item.category,
          date: dateFormat,
        };
      }
    );

    setTransactions(transactionsFormatted);

    const lastTransactionEntry = getLastTransactionDate(
      transactions,
      "positive"
    );
    const lastTransactionExpence = getLastTransactionDate(
      transactions,
      "negative"
    );
    const totalInterval = `01 à ${lastTransactionEntry}`;

    const totalSumCount = entriesTotal - expencesTotal;
    setHighData({
      entries: {
        total: entriesTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: `Última entrada dia ${lastTransactionEntry}`,
      },
      expences: {
        total: expencesTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: `Última saída dia ${lastTransactionExpence}`,
      },
      totalCount: {
        total: totalSumCount.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: totalInterval,
      },
    });

    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: "https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/479-mk-9690-job583.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=f089d81f404c15a89c4da6de1bfb1506",
                  }}
                />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>Larissa</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={() => {}}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighCardsContainer>
            <HighCard
              type="up"
              title="Entradas"
              amount={highData.entries.total}
              lastTransaction={highData.entries.lastTransaction}
            />
            <HighCard
              type="down"
              title="Saídas"
              amount={highData.expences.total}
              lastTransaction={highData.expences.lastTransaction}
            />
            <HighCard
              type="total"
              title="Total"
              amount={highData.totalCount.total}
              lastTransaction={highData.totalCount.lastTransaction}
            />
          </HighCardsContainer>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
