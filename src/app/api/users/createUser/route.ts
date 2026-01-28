import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../shared/lib/prisma";
import { supabase } from "../../../config/subapase";

export async function POST(req: NextRequest) {
  console.log(
    "DEBUG: DB URL is",
    process.env.DATABASE_URL ? "Defined" : "UNDEFINED"
  );
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { message: "DATABASE_URL is not set", data: null },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const imageFile = formData.get("image") as File | null;
    console.log(formData);
    console.log("IMAGE FILE:", imageFile);

    if (!name || !email || !password || !imageFile) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message:
            "An account with this email already exists. Please log in instead.",
          data: null,
        },
        { status: 400 }
      );
    }
    let imageUrl: string | null = null;

    // Upload image to Supabase
    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const fileName = `avatars/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from("ProfileImage")
        .upload(fileName, imageFile, {
          contentType: imageFile.type,
        });

      if (error) {
        console.error("SUPABASE ERROR:", error);
        return NextResponse.json(
          { message: "Image upload failed" },
          { status: 500 }
        );
      }

      const { data } = supabase.storage
        .from("ProfileImage")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        image: imageUrl ?? null,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "Created the user successfully",
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    return NextResponse.json(
      { message: "User Creation failed", data: { error } },
      { status: 400 }
    );
  }
}
