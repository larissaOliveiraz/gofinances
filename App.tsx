import React from "react";
import "intl";
import "intl/locale-data/jsonp/pt-BR";

import { LogBox } from "react-native";
import { StatusBar } from "react-native";

import { ThemeProvider } from "styled-components";
import * as SplashScreen from "expo-splash-screen";
import theme from "./src/global/styles/theme";

import { AuthProvider } from "./src/hooks/auth";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Routes } from "./src/routes";

LogBox.ignoreLogs(["EventEmitter.removeListener"]);

export default function App() {
  SplashScreen.preventAutoHideAsync();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  SplashScreen.hideAsync();

  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
}
