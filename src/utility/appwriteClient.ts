import { Account, Appwrite, Storage } from "@refinedev/appwrite";

const APPWRITE_URL = "https://dev.api.tuuli.de/v1";
const APPWRITE_PROJECT = "64b82f098b87d5fc57c4";

const appwriteClient = new Appwrite();

appwriteClient.setEndpoint(APPWRITE_URL).setProject(APPWRITE_PROJECT);
const account = new Account(appwriteClient);
const storage = new Storage(appwriteClient);

export { account, appwriteClient, storage, APPWRITE_URL };
