import { NextResponse } from "next/server";
import dbConnect from "@/lib/util/dbConnect";
import IronSessionSettings from "@/lib/util/IronSessionSettings";
import User from "@/lib/schemas/user";
import Diary from "@/lib/schemas/diary";

export async function DELETE() {
  try {
    await dbConnect();
    const session = await IronSessionSettings();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await Diary.deleteMany({ userId: session.user.id });
    await User.findByIdAndDelete(session.user.id);
    session.destroy();
    return NextResponse.json(
      { message: "Account deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete account." },
      { status: 500 }
    );
  }
}