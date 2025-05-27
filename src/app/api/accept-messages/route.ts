import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { User as NextAuthUser } from "next-auth";
import { errorResponse, successResponse } from "@/helpers/response";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";


export async function POST(request: NextRequest) {
  await dbConnect()
  
    const session = await getServerSession(authOptions)
    const user = session?.user as NextAuthUser

    if (!session || !session.user) {
      return errorResponse(null, "Unauthorized", 401)
    }

    const userId = user._id

    const { isAcceptingMessages } = await request.json()
  try {

    const updatedUser = await User.findByIdAndUpdate(userId, { isAcceptingMessages }, { new: true })

    if (!updatedUser) {
      return errorResponse(null, "failed to update user status to accept messages", 401)
    }

    return successResponse(updatedUser, "message acceptence status updated successfully", 200)

  } catch (error) {
    console.log("Error accepting messages", error)
    return errorResponse(error, "Error accepting messages", 500)
  }
}

export async function GET(request: NextRequest) {
  await dbConnect()
  
    const session = await getServerSession(authOptions)
    const user: NextAuthUser = session?.user as NextAuthUser

    if (!session || !session.user) {
      return errorResponse(null, "Unauthorized", 401)
    }

    const userId = user._id

    const foundUser = await User.findById(userId)
  try {
    if (!foundUser) {
      return errorResponse(null, "User not found", 404)
    }

    return successResponse({isAcceptingMessages: foundUser.isAcceptingMessages}, "User found", 200)
  } catch (error) {
    console.log("Error getting user", error)
    return errorResponse(error, "Error getting user", 500)
  }
}
