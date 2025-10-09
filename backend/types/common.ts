import { define, is, number, object, string, type Describe } from "superstruct";
import isEmail from 'is-email';

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

const email = () => define<string>('email', (value: any) => value !== undefined && isEmail(value))

export const TLogin = object({
    email: email(),
    password: string() 
})

export const TRqReset = object({
    email: email()
})

export const TReset = object({
    password: string()
})

export const TMessage = object({
    text: string(),
    other: string(), // will be in the future changed to file
})

export const TView = object({
    start: number(),
    end: number()
})
