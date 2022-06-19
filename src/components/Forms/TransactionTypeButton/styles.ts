import styled, { css } from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { TouchableOpacity } from "react-native";

interface TransactionProps {
  type: "up" | "down";
  isActive: boolean;
}

export const Container = styled(TouchableOpacity)<TransactionProps>`
  width: 48%;

  flex-direction: row;
  align-items: center;
  justify-content: center;

  border-width: ${({ isActive }) => (isActive ? 0 : 1.5)}px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.text};
  border-radius: 5px;

  padding: 16px;
  margin-top: 8px;
  ${({ isActive, type }) =>
    isActive &&
    type === "up" &&
    css`
      background-color: ${({ theme }) => theme.colors.success_light};
      border: none;
    `};

  ${({ isActive, type }) =>
    isActive &&
    type === "down" &&
    css`
      background-color: ${({ theme }) => theme.colors.attention_light};
      border: none;
    `};
`;

export const Icon = styled(Feather)<TransactionProps>`
  color: ${({ theme, type }) =>
    type === "up" ? theme.colors.success : theme.colors.attention};

  font-size: ${RFValue(20)}px;

  margin-right: 14px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.title};
`;
