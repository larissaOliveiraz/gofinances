import React from "react-native";
import { TextInputProps } from "react-native";

import { Container } from "./styles";

export function Input({ ...rest }: TextInputProps) {
  return <Container textAlignVertical="bottom" {...rest} />;
}
