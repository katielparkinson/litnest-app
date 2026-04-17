import { Account, Avatars, Client, TablesDB } from "react-native-appwrite";

export const client = new Client()
  .setEndpoint("https://sfo.cloud.appwrite.io/v1")
  .setProject("698773c30018c5300204")
  .setPlatform("dev.katieparkinson.litnest");

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new TablesDB(client);
