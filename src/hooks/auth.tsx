import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface AuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>;
  signOut(): Promise<void>;
  loadingUser: boolean;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: string;
}

//CRIA MEU PRÓPRIO HOOK
const AuthContext = createContext({} as AuthContextData);
function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

//PROVIDENCIA O HOOK PARA TODA A APLICAÇÃO -- USADO NO "app.tsx"
function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [loadingUser, setLoadingUser] = useState(true);

  async function signInWithGoogle() {
    try {
      const RESPONSE_TYPE = "token";
      const SCOPE = encodeURI("profile email");

      //google identity platform
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
      const { type, params } = (await AuthSession.startAsync({
        authUrl,
      })) as AuthorizationResponse;

      /* 
      se o login for efetuado con sucesso
      as informações desse usuário serão armazenadas no estado "user/setUser"
      e também no AsyncStorage em "@gofinances:user"
      */
      if (type === "success") {
        // acessa as informações do usuário apartir do "access_token"
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`
        );

        // transforma as informações do user em um obj json
        const userInfo = await response.json();

        const signedUser: User = {
          id: userInfo.id,
          name: userInfo.given_name,
          email: userInfo.email,
          photo: userInfo.picture,
        };

        setUser(signedUser);

        await AsyncStorage.setItem(
          "@gofinances:user",
          JSON.stringify(signedUser)
        );
        console.log(user);
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async function signOut() {
    setUser({} as User);
    await AsyncStorage.removeItem("@gofinances:user");
  }

  // VERIFICA SE O USUÁRIO JÁ ESTÁ LOGADO SEMPRE QUE O APP É RECARREGADO
  useEffect(() => {
    async function loadUserStorageData() {
      const userStoreged = await AsyncStorage.getItem("@gofinances:user");

      if (userStoreged) {
        const userLogged = JSON.parse(userStoreged) as User;
        setUser(userLogged);
      }

      setLoadingUser(false);
    }

    loadUserStorageData();
  }, []);

  return (
    // value - valores que ficam disponíveis em toda a aplicação - "useAuth()"
    <AuthContext.Provider
      value={{ user, signInWithGoogle, signOut, loadingUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };
