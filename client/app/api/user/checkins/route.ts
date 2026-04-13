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

    const user = await User.findById(session.user.id).select("weight checkIns");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const sortedCheckIns = [...user.checkIns].sort(
      (a: { date: Date }, b: { date: Date }) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json(
      {
        currentWeight: user.weight,
        checkIns: sortedCheckIns,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong while fetching check-ins." },
      { status: 500 }
    );
  }
}