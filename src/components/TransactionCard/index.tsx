import React from "react-native";
import { categories } from "../../utils/categories";
import {
  Container,
  Title,
  Amount,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date,
} from "./styles";

export interface Category {
  name: string;
  icon: string;
}

export interface TransactionCardProps {
  type: "positive" | "negative";
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface DataProps {
  data: TransactionCardProps;
}

export function TransactionCard({ data }: DataProps) {
  const [categoryAccess] = categories.filter(
    (item) => item.key === data.category
  );

  return (
    <Container>
      <Title>{data.name}</Title>

      <Amount type={data.type}>
        {data.type === "negative" && "- "}
        {data.amount}
      </Amount>

      <Footer>
        <Category>
          <Icon name={categoryAccess.icon} />
          <CategoryName>{categoryAccess.name}</CategoryName>
        </Category>

        <Date>{data.date}</Date>
      </Footer>
    </Container>
  );
}
