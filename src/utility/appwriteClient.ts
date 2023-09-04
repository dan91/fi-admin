import { Account, Appwrite, Storage } from "@refinedev/appwrite";

const APPWRITE_URL = "https://dev.api.tuuli.de/v1";
const APPWRITE_PROJECT = "64b82f098b87d5fc57c4";

const EXPERIMENT_COLLECTION = "64b82f7b348727a801cb";
const POST_COLLECTION = "64bfc5ca89fc8d8fbfa1";
const AUTH_CODES_COLLECTION = "64f44dac61e67667bee5";

const POST_IMAGE_BUCKET = "64c1272a658c2465fffc"

const appwriteClient = new Appwrite();

appwriteClient.setEndpoint(APPWRITE_URL).setProject(APPWRITE_PROJECT);


const account = new Account(appwriteClient);
const storage = new Storage(appwriteClient);

export { account, appwriteClient, storage, APPWRITE_URL, EXPERIMENT_COLLECTION, POST_COLLECTION, AUTH_CODES_COLLECTION, POST_IMAGE_BUCKET };
