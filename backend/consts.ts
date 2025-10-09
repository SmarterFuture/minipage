import dotenv from "dotenv"; 
dotenv.config(); 


function requireEnv(key: string): string {
    const value = process.env[key];
    if ( !value )
        throw new Error(`Missing env: ${key}`)
    return value;
} 

export const PORT = process.env.PORT || 3000;
export const MONGO_INITDB_ROOT_USERNAME = requireEnv("MONGO_INITDB_ROOT_USERNAME");
export const MONGO_INITDB_ROOT_PASSWORD = requireEnv("MONGO_INITDB_ROOT_PASSWORD");
export const MONGO_DATABASE = requireEnv("MONGO_DATABASE");

export const MAIL_LOGIN = requireEnv("MAIL_LOGIN");
export const MAIL_PASS = requireEnv("MAIL_PASS");
export const MAIL_USER = requireEnv("MAIL_USER");

export const BASE_URL = requireEnv("BASE_URL");

export const DISCORD_TOKEN = requireEnv("DISCORD_TOKEN");
export const DISCORD_CLIENT_ID = requireEnv("DISCORD_CLIENT_ID");
export const DISCORD_CHANNEL_ID = requireEnv("DISCORD_CHANNEL_ID");

export const FS_PATH = requireEnv("FS_PATH");

export const MAX_AGE = 60 * 60 * 24;

export const HOME_PATH = "/app";
