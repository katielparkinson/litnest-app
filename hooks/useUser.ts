import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import type { UserContextValue } from "../types/app";

export function useUser() {
  const context = useContext(UserContext) as UserContextValue | undefined;

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
