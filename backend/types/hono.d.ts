import { WithId } from "mongodb"
import type { IUser } from "./db"

declare module "hono" {
    interface ContextVariableMap {
        user: WithId<IUser>
    }
}
