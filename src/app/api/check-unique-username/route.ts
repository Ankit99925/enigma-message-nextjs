import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { z } from "zod";
import { usernameValidator } from "@/schemas/signUpSchema";
import { errorResponse, successResponse } from "@/helpers/response";
import { NextRequest } from "next/server";

const UsernameQuerySchema = z.object({
  username: usernameValidator,
});

export async function GET(request: NextRequest) {

  await dbConnect()
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = searchParams.get("username");
    //zod Validation
    const result = UsernameQuerySchema.safeParse({ username: queryParams })

    console.log("result", result)

    if (!result.success) {
      return errorResponse(result.error, "Username must be at least 3 characters long", 400)
    }

    const { username } = result.data;

    const existingUsername = await User.findOne({ username, isVerified: true })
    if (existingUsername) {
      return errorResponse(null, "Username already exists", 400)
    }

    return successResponse(true, "Username is unique", 200)

  } catch (error) {
    return errorResponse(error, "Error checking unique username", 500)
  }
}
