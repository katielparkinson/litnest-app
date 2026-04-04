import { createContext, useEffect, useState } from "react";
import { account } from "../lib/appwrite.js";
import { ID } from "react-native-appwrite";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  async function login(email, password) {
    try {
      await account.createEmailPasswordSession({
        email: email,
        password: password,
      });
      const response = await account.get();
      setUser(response);
    } catch (error) {
      throw Error(error.message);
    }
  }
  async function register(email, password) {
    try {
      await account.create({
        userId: ID.unique(),
        email: email,
        password: password,
      });
      await login(email, password);
    } catch (error) {
      throw Error(error.message);
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
    } catch (error) {
      setUser(null);
    } finally {
      setAuthChecked(true);
    }
  }
  //first argument is the function, the 2nd is an empty array so it only runs once when it first gets rendered
  useEffect(() => {
    getInitialUserValue();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, login, register, logout, authChecked }}
    >
      {children}
    </UserContext.Provider>
  );
}
