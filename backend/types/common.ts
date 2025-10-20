import { define, instance, is, number, object, optional, string, type Describe } from "superstruct";
import isEmail from 'is-email';
import type { FormDataEntryValue } from "bun";

export type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

export const Ok = <T>( arg: T ) => { return { ok: true, data: arg } as Result<T, never>; };
export const Err = <E>( arg: E ) => { return { ok: false, error: arg } as Result<never, E>; };


export function validateData<T>(body: any, type: Describe<T>): Result<T, string> {
    if (body === undefined) {
        return Err("No data") 
    } else if (!is(body, type)) {
        return Err("Invalid data")
    } else {
        return Ok(body)
    }
}

export function formDataToObject(data: FormData): Record<string, FormDataEntryValue> {
    const obj: Record<string, FormDataEntryValue> = {};
    for (const [key, value] of data.entries()) {
        obj[key] = value
    }
    return obj
}

const email = () => define<string>('email', (value: any) => value !== undefined && isEmail(value))

export const TLogin = object({
    email: email(),
    password: string() 
})

export const TRqReset = object({
    email: email()
})

export const TReset = object({
    token: string(),
    password: string()
})

export const TMessage = object({
    text: string(),
    file: optional(instance(File)),
})

export const TView = object({
    start: number(),
    end: number()
})
