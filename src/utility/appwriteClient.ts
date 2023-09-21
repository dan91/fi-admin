import { Account, Appwrite, Storage } from "@refinedev/appwrite";

const APPWRITE_URL = "https://cloud.appwrite.io/v1";
const APPWRITE_PROJECT = "64f72c5e322177aca665";

const EXPERIMENT_COLLECTION = "64ff16ddd8532803480b";
const POST_COLLECTION = "64ff0d31d3694f976b82";
const AUTH_CODES_COLLECTION = "64ff0cdb7fc354c9d5fb";
const INTERVENTION_COLLECTION = "650820076ad6bff68eab"
const STIMULUS_COLLECTION = "650853816faf98a60171"
const GROUP_COLLECTION = "6508a14e452ae1c5b5dd"
const TRIAL_COLLECTION = "6508ab70327928b89029"

const POST_IMAGE_BUCKET = "64ff170c985b48a34bb0"

const appwriteClient = new Appwrite();

appwriteClient.setEndpoint(APPWRITE_URL).setProject(APPWRITE_PROJECT);


const account = new Account(appwriteClient);
const storage = new Storage(appwriteClient);

export { account, appwriteClient, storage, APPWRITE_URL, EXPERIMENT_COLLECTION, TRIAL_COLLECTION, GROUP_COLLECTION, POST_COLLECTION, AUTH_CODES_COLLECTION, INTERVENTION_COLLECTION, STIMULUS_COLLECTION, POST_IMAGE_BUCKET };
