import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";


export function throwError(ctx: Context, code: StatusCode, err: string): Response {
    ctx.status(code);
    return ctx.json({err})
}
