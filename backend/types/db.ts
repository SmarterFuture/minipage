import type { ObjectId } from "mongodb"

export interface IUser {
    email: string,
    password: string,
    is_verified: boolean,
    verify_token: string,
    reset_token: string,
    thread_id: string,
    active: Date,
    created: Date
} 

export interface ISession {
    user_id: ObjectId,
    token: string,
    expiry: Date
}

export interface IMessages {
    user_id: ObjectId,
    who: string,
    text: string,
    created: Date,
    attachment: Array<IFile>
}

export interface IFile {
    filename: string, 
    mimetype: string,
    path: string
}
