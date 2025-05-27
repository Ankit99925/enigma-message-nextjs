import { z } from "zod";

export const verifySchema = z.object({
    verifyCode: z.string().min(6, { message: "Invalid verification code" }),
})

