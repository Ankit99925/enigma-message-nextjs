import { z } from "zod";

export const usernameValidator =
    z.string().min(3, { message: "Username must be at least 3 characters long" }).max(20, { message: "Username must be less than 20 characters long" }).regex(/^[a-zA-Z0-9]+$/, { message: "Username must contain only letters and numbers" });


export const usernameSchema = z.object({
    username: usernameValidator,
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),

})
