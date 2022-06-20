import React, { createContext, ReactNode, useContext } from "react";

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
}

//CRIA MEU PRÓPRIO HOOK
const AuthContext = createContext({} as AuthContextData);
function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

//PROVIDENCIA O HOOK PARA TODA A APLICAÇÃO -- USADO NO "app.tsx"
function AuthProvider({ children }: AuthProviderProps) {
  const user = {
    id: "123",
    name: "Larissa",
    email: "larissa@gmail.com",
  };

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };
