import { Client, Account, Avatars, TablesDB, } from 'react-native-appwrite';

export const client = new Client()
    .setEndpoint('https://sfo.cloud.appwrite.io/v1')
    .setProject('698773c30018c5300204')
    .setPlatform('dev.katieparkinson.shelfie');

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new TablesDB(client);

// Use `client.subscribe(...)` for realtime subscriptions. The SDK
// does not export a Realtime constructor for direct instantiation
// in this package, so we don't create one here.
