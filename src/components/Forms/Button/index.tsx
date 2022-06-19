import React, { TouchableOpacityProps } from "react-native";
import { Container, Title } from "./styles";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
}

export function Button({ title, ...rest }: ButtonProps) {
  return (
    <Container {...rest} activeOpacity={0.7}>
      <Title>{title}</Title>
    </Container>
  );
}
