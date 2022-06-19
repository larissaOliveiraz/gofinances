import React, { TouchableOpacityProps } from "react-native";
import { Container, Icon, Title } from "./styles";

const icons = {
  up: "arrow-up-circle",
  down: "arrow-down-circle",
};

export interface TransactionTypeProps extends TouchableOpacityProps {
  type: "up" | "down";
  title: "Income" | "Outcome";
  isActive: boolean;
}

export function TransactionTypeButton({
  title,
  type,
  isActive,
  ...rest
}: TransactionTypeProps) {
  return (
    <Container {...rest} isActive={isActive} type={type}>
      <Icon name={icons[type]} type={type} />
      <Title>{title}</Title>
    </Container>
  );
}
