import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/util/dbConnect";
import IronSessionSettings from "@/lib/util/IronSessionSettings";
import Diary from "@/lib/schemas/diary";

function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await IronSessionSettings();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const {
      category,
      name,
      serving,
      calories,
      protein,
      carbs,
      fat,
      sugar,
    } = data;

    if (
      !category ||
      !name ||
      !serving ||
      calories === undefined ||
      protein === undefined ||
      carbs === undefined ||
      fat === undefined ||
      sugar === undefined
    ) {
      return NextResponse.json(
        { message: "Please fill in all meal fields." },
        { status: 400 }
      );
    }

    const validCategories = ["Breakfast", "Lunch", "Dinner", "Snacks"];

    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { message: "Invalid meal category." },
        { status: 400 }
      );
    }

    const today = getTodayDateString();

    let diary = await Diary.findOne({
      userId: session.user.id,
      date: today,
    });

    if (!diary) {
      diary = new Diary({
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
        meals: [],
      });
    }

    const mealGroup = diary.meals.find(
      (group: { category: string }) => group.category === category
    );

    const newMealItem = {
      name,
      serving,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
      sugar: Number(sugar),
    };

    if (mealGroup) {
      mealGroup.items.push(newMealItem);
    } else {
      diary.meals.push({
        category,
        items: [newMealItem],
      });
    }

    await diary.save();

    return NextResponse.json(
      { message: "Meal added successfully.", diary },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong while adding the meal." },
      { status: 500 }
    );
  }
}