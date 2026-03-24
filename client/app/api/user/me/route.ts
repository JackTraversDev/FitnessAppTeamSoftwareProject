import { NextResponse } from "next/server";
import dbConnect from "@/lib/util/dbConnect";
import IronSessionSettings from "@/lib/util/IronSessionSettings";
import User from "@/lib/schemas/user";

export async function GET() {
  try {
    await dbConnect();

    const session = await IronSessionSettings();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id).select(
      "firstName email height weight dateOfBirth gender goal"
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong while fetching the user." },
      { status: 500 }
    );
  }
}