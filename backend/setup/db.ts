import { MongoClient } from "mongodb";
import { MONGO_DATABASE, MONGO_INITDB_ROOT_PASSWORD, MONGO_INITDB_ROOT_USERNAME } from "../consts";
import type { ICounter } from "../types/db";


const uri = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@mini-ciphers-db:27017/${MONGO_DATABASE}?authSource=admin`;
const client = new MongoClient(uri);

await client.connect();
export const db = client.db(MONGO_DATABASE);


export async function getNextSerial(): Promise<number> {
    return db
        .collection<ICounter>("ciphers")
        .findOneAndUpdate(
            { _id: "serial" },
            { $inc: { seq: 1 }},
            { upsert: true, returnDocument: "after"}
        )
        .then(v => {
            if (v) {
                return v.seq
            }
            throw Error("unexpected null")
        })
}
