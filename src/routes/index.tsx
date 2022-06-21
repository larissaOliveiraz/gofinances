// DEFINE QUAL DAS ROTAS SERÁ EXIBIDA PARA O USUÁRIO
import React from "react";
import { useAuth } from "../hooks/auth";
import { NavigationContainer } from "@react-navigation/native";
import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";

export function Routes() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {user.id ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
