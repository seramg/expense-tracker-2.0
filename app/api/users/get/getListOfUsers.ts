import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      message: "DATABASE_URL is not set",
      data: null,
      status: 500,
    });
  }

  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users ?? []);
  } catch (error) {
    return NextResponse.json({
      message: "Failed to fetch users",
      data: { error },
      status: 400,
    });
  }
}
