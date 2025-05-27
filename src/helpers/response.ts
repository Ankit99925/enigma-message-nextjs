import { NextResponse } from "next/server";

type ApiResponse = {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
  isAcceptingMessages?: boolean;
};

export const successResponse = (data: any, message: string, statusCode: number = 200) => {
  return NextResponse.json({ success: true, data, message ,}, { status: statusCode });
};

export const errorResponse = (error: any, message: string, statusCode: number = 500) => {
  return NextResponse.json({ success: false, error, message }, { status: statusCode });
};

