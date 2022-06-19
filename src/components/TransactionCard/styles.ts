import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

interface TransactionTypeProps {
  type: "positive" | "negative";
}

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.shape};
  padding: 18px 24px;
  border-radius: 5px;

  margin-bottom: 16px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.title};
  margin-bottom: 2px;
`;

export const Amount = styled.Text<TransactionTypeProps>`
  color: ${({ theme, type }) =>
    type === "positive" ? theme.colors.success : theme.colors.attention};
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(20)}px;
`;

export const Footer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  margin-top: 20px;
`;

export const Category = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Icon = styled(Feather)`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(20)}px;

  margin-bottom: 5px;
`;

export const CategoryName = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  margin-left: 17px;
`;

export const Date = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(13)}px;
`;
