import { useEffect, type PropsWithChildren } from "react";
import { useRouter } from "expo-router";
import { useUser } from "../../hooks/useUser";
import ThemedLoader from "../ThemedLoader";

const GuestOnly = ({ children }: PropsWithChildren) => {
  const { user, authChecked } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (authChecked && user !== null) {
      router.replace("/profile");
    }
  }, [authChecked, router, user]);

  if (!authChecked || user) {
    return <ThemedLoader />;
  }

  return children;
};

export default GuestOnly;
