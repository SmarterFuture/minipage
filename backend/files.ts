import { type Context, type Next } from "hono";

import { throwError } from "./funcs";

/**
    * expects 2 request parameters path/to/here/<userid>/*
    * meaning <userid> and wild card path
*/
export async function checkAccess(ctx: Context, next: Next) {
    const userid = ctx.req.param("userid");
    const filepath = ctx.req.param("file");

    if (!userid || !filepath)
        return throwError(ctx, 404, "Not found");
    
    const user = ctx.get("user");
    
    if ( user._id.toString() !== userid)
        return throwError(ctx, 403, "Forbidden");

    return next()
}


