import { createContext, useEffect, type PropsWithChildren, useState } from "react";
import {
  clearStoredAuthToken,
  fetchCurrentUser,
  getStoredAuthToken,
  loginWithPassword,
  logoutFromApi,
  registerWithPassword,
  setStoredAuthToken,
} from "../lib/api";
import type { AppUser, UserContextValue } from "../types/app";

export const UserContext = createContext<UserContextValue | undefined>(undefined);

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong";

export function UserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  async function login(email: string, password: string) {
    try {
      const response = await loginWithPassword(email, password);
      await setStoredAuthToken(response.token);
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async function register(email: string, password: string) {
    try {
      const response = await registerWithPassword(email, password);
      await setStoredAuthToken(response.token);
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async function logout() {
    try {
      await logoutFromApi(token);
    } finally {
      await clearStoredAuthToken();
      setToken(null);
      setUser(null);
    }
  }

  async function getInitialUserValue() {
    const storedToken = await getStoredAuthToken();

    if (!storedToken) {
      setUser(null);
      setAuthChecked(true);
      return;
    }

    try {
      const response = await fetchCurrentUser(storedToken);
      setToken(storedToken);
      setUser(response);
    } catch {
      await clearStoredAuthToken();
      setToken(null);
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
