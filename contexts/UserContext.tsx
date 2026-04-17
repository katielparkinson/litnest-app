import { createContext, useEffect, type PropsWithChildren, useState } from "react";
import { ID } from "react-native-appwrite";
import { account } from "../lib/appwrite";
import type { AppUser, UserContextValue } from "../types/app";

export const UserContext = createContext<UserContextValue | undefined>(undefined);

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong";

export function UserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  async function login(email: string, password: string) {
    try {
      await account.createEmailPasswordSession({
        email,
        password,
      });
      const response = await account.get();
      setUser(response);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async function register(email: string, password: string) {
    try {
      await account.create({
        userId: ID.unique(),
        email,
        password,
      });
      await login(email, password);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async function logout() {
    await account.deleteSession({
      sessionId: "current",
    });
    setUser(null);
  }

  async function getInitialUserValue() {
    try {
      const response = await account.get();
      setUser(response);
    } catch {
      setUser(null);
    } finally {
      setAuthChecked(true);
    }
  }

  useEffect(() => {
    getInitialUserValue();
  }, []);

  return (
    <UserContext.Provider value={{ user, login, register, logout, authChecked }}>
      {children}
    </UserContext.Provider>
  );
}
