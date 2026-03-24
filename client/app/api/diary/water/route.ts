import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/util/dbConnect";
import IronSessionSettings from "@/lib/util/IronSessionSettings";
import Diary from "@/lib/schemas/diary";

function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await IronSessionSettings();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await req.json();

    if (amount === undefined || Number(amount) <= 0) {
      return NextResponse.json(
        { message: "Please provide a valid water amount." },
        { status: 400 }
      );
    }

    const today = getTodayDateString();

    let diary = await Diary.findOne({
      userId: session.user.id,
      date: today,
    });

    if (!diary) {
      diary = await Diary.create({
        userId: session.user.id,
        date: today,
        waterMl: 0,
        calorieGoal: 2500,
        waterGoal: 3000,
        macroGoals: {
          protein: 150,
          carbs: 180,
          fat: 60,
          sugar: 50,
        },
        meals: [
          { category: "Breakfast", items: [] },
          { category: "Lunch", items: [] },
          { category: "Dinner", items: [] },
          { category: "Snacks", items: [] },
        ],
      });
    }

    diary.waterMl += Number(amount);
    await diary.save();

    return NextResponse.json(
      { message: "Water added successfully.", waterMl: diary.waterMl },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong while adding water." },
      { status: 500 }
    );
  }
}