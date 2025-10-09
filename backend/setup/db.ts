import { MongoClient } from "mongodb";
import { MONGO_DATABASE, MONGO_INITDB_ROOT_PASSWORD, MONGO_INITDB_ROOT_USERNAME } from "../consts";


const uri = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@mini-ciphers-db:27017/${MONGO_DATABASE}?authSource=admin`;
const client = new MongoClient(uri);

await client.connect();
export const db = client.db(MONGO_DATABASE);
