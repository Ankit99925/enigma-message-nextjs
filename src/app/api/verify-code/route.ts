import { errorResponse, successResponse } from "@/helpers/response";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { NextRequest } from "next/server";


export async function POST(request: NextRequest) {
  await dbConnect()
  try {
    const { username, verifyCode } = await request.json()

    const decodecUsername = decodeURIComponent(username);


    const user = await User.findOne({ username: decodecUsername })
    if (!user) {
      return errorResponse(null, "User not found", 404)
    }

    if (user.verifyCode !== verifyCode) {
      return errorResponse(null, "Invalid verify code", 400)
    }

    if (user.verifyCodeExpiry < new Date()) {
      return errorResponse(null, "Verify code expired Please Sign up again", 400)
    }

    user.isVerified = true;
    await user.save();

    return successResponse(true, "User verified successfully", 200)
  } catch (error) {
    console.log(error)
    return errorResponse(error, "Error verifying code", 500)
  }
}