import React from "react";
import { BorderlessButtonProps } from "react-native-gesture-handler";
import { Button, Icon } from "./styles";

export function SignOutButton({ ...rest }: BorderlessButtonProps) {
  return (
    <Button {...rest}>
      <Icon name="power" />
    </Button>
  );
}
