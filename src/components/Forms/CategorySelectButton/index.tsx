import React from "react-native";
import { Container, Category, Icon } from "./styles";

interface CategoryProps {
  title: string;
  onPress: () => void;
}

export function CategorySelectButton({ title, onPress }: CategoryProps) {
  return (
    <Container onPress={onPress} activeOpacity={0.8}>
      <Category>{title}</Category>
      <Icon name="chevron-down" />
    </Container>
  );
}
