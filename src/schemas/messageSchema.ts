import { z } from "zod";

export const messageSchema = z.object({
    message: z.string().min(10, { message: "Message must be at least 10 characters long" }).max(255, { message: "Message must be less than 255 characters long" }),
})

