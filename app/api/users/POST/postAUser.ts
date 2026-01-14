import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      message: "DATABASE_URL is not set",
      data: null,
      status: 500,
    });
  }

  try {
    const body = await req.json();
    const { name, email, image } = body;
    if (!name || !email || !image) {
      return NextResponse.json({
        message: "Missing required fields",
        data: null,
        status: 400,
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        image,
      },
    });

    return NextResponse.json({
      message: "Created the user successfully",
      data: user,
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      message: "User Creation failed",
      data: { error },
      status: 400,
    });
  }
}
