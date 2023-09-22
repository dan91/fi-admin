import { Account, Appwrite, Storage } from "@refinedev/appwrite";

export const APPWRITE_URL = "https://cloud.appwrite.io/v1";
export const APPWRITE_PROJECT = "64f72c5e322177aca665";

export const EXPERIMENT_COLLECTION = "64ff16ddd8532803480b";
export const POST_COLLECTION = "64ff0d31d3694f976b82";
export const AUTH_CODES_COLLECTION = "64ff0cdb7fc354c9d5fb";
export const INTERVENTION_COLLECTION = "650820076ad6bff68eab"
export const STIMULUS_COLLECTION = "650d5554885146a01886"
export const GROUP_COLLECTION = "6508a14e452ae1c5b5dd"
export const TRIAL_COLLECTION = "6508ab70327928b89029"

export const STIMULUS_IMAGE_BUCKET = "64ff170c985b48a34bb0"
export const USER_IMAGE_BUCKET = "650c8bbde201165b90c0"

export const appwriteClient = new Appwrite();

appwriteClient.setEndpoint(APPWRITE_URL).setProject(APPWRITE_PROJECT);


export const account = new Account(appwriteClient);
export const storage = new Storage(appwriteClient);


