import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { errorResponse, successResponse } from "@/helpers/response";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";
import User from "@/models/User";
import { User as NextAuthUser } from "next-auth";

export async function GET(request: NextRequest) {
  await dbConnect()

  const session = await getServerSession(authOptions)
  const user: NextAuthUser = session?.user as NextAuthUser

  if (!session || !session.user) {
    return errorResponse(null, "Unauthorized", 401)
  }

  const userId = new mongoose.Types.ObjectId(user._id)

  try {
    const user = await User.aggregate([
      {
        $match: {
          _id: userId
        }
      },
      { $unwind: "$messages" }, {
        $sort: {
          "messages.createdAt": -1
        }
      },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" }
        }
      }
    ])

    if (!user) {
      return errorResponse(null, "User not found", 404)
    }

    return successResponse({messages: user[0].messages}, "Messages fetched successfully", 200)

  } catch (error) {
    console.log("Error fetching messages", error)
    return errorResponse(error, "Error fetching messages", 500)
  }

}
