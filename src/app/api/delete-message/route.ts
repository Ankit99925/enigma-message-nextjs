import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { errorResponse, successResponse } from "@/helpers/response";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import User from "@/models/User";
import { User as NextAuthUser } from "next-auth";

export async function DELETE(request: NextRequest, { params }: { params: { messageId: string } }) {
  const messageId = params.messageId
  await dbConnect()

  const session = await getServerSession(authOptions)
  const user: NextAuthUser = session?.user as NextAuthUser

  if (!session || !session.user) {
    return errorResponse(null, "Unauthorized", 401)
  }



  try {
    const updatedResult = await User.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    )
    if (updatedResult.modifiedCount === 0) {
      return errorResponse(null, "Message not found or Already deleted", 404)
    }
    return successResponse(updatedResult, "Message deleted successfully", 200)

  } catch (error) {
    console.log("Error deleting message", error)
    return errorResponse(error, "Error deleting message", 500)
  }

}
