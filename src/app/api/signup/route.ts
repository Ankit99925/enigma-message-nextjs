import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcrypt";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { randomBytes } from "crypto";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

dbConnect();

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {

  try {
    const { username, email, password } = await request.json();

    const existingUser = await User.findOne({ username, isVerified: true });

    const verificationToken = randomBytes(6).toString("hex");
    const verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000;


    if (existingUser) {
      return NextResponse.json({ success: false, message: "User already exists with this username" }, { status: 400 });
    }
    const existingUserByEmail = await User.findOne({ email });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json({ success: false, message: "User already exists with this email" }, { status: 400 });
      }

      existingUserByEmail.verifyCode = verificationToken;
      existingUserByEmail.verifyCodeExpiry = new Date(verificationTokenExpiresAt);
      await existingUserByEmail.save();

    } else {


      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ username, email, password: hashedPassword, verifyCode: verificationToken, verifyCodeExpiry: verificationTokenExpiresAt, isVerified: false, isAcceptingMessages: true, messages: [] });

      await newUser.save();
    }

    const verificationEmailResponse = await sendVerificationEmail(username, verificationToken, email, verificationTokenExpiresAt);

    if (!verificationEmailResponse.success) {
      return NextResponse.json({ success: false, message: "Error sending verification email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "User registered successfully" }, { status: 201 });




  } catch (error) {
    console.log("Error registering Users", error)
    return NextResponse.json({ success: false, message: "Error registering Users", error }, { status: 500 });

  }

}