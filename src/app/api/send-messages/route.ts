import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { errorResponse, successResponse } from "@/helpers/response";
import { Message } from "@/models/User";


export async function POST(request: NextRequest) {
  await dbConnect()

  const { username, content } = await request.json()

  const user = await User.findOne({ username })
  try {
    if (!user) {
      return errorResponse(null, "User not found", 404)
    }
    if (!user.isAcceptingMessages) {
      return errorResponse(null, "User is not accepting messages", 403)
    }

    const message = ({
      content,
      createdAt: new Date()
    })

    user.messages.push(message as Message)
    await user.save()

    return successResponse(message, "Message sent successfully", 200)

  } catch (error) {
    console.log("Error sending message", error)
    return errorResponse(error, "Error sending message", 500)
  }



}

