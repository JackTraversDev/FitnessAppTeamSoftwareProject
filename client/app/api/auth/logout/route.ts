import { NextResponse } from "next/server";
import IronSessionSettings from "@/lib/util/IronSessionSettings";

export async function POST() {
  try {
    const session = await IronSessionSettings();
    session.destroy();
    return NextResponse.json(
      { message: "Logged out successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to log out." },
      { status: 500 }
    );
  }
}