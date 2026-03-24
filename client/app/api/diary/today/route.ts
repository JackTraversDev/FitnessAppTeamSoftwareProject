import { NextResponse } from "next/server";
import dbConnect from "@/lib/util/dbConnect";
import IronSessionSettings from "@/lib/util/IronSessionSettings";
import Diary from "@/lib/schemas/diary";

function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

function calculateTotals(diary: any) {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let sugar = 0;

  for (const group of diary.meals) {
    for (const item of group.items) {
      calories += item.calories;
      protein += item.protein;
      carbs += item.carbs;
      fat += item.fat;
      sugar += item.sugar;
    }
  }

  return { calories, protein, carbs, fat, sugar };
}

export async function GET() {
  try {
    await dbConnect();

    const session = await IronSessionSettings();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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

    const totals = calculateTotals(diary);

    const caloriesPercent =
      diary.calorieGoal > 0
        ? Math.min((totals.calories / diary.calorieGoal) * 100, 100)
        : 0;

    const waterPercent =
      diary.waterGoal > 0
        ? Math.min((diary.waterMl / diary.waterGoal) * 100, 100)
        : 0;

    const glasses = Math.floor(diary.waterMl / 250);

    return NextResponse.json(
      {
        diary,
        totals,
        summary: {
          calories: {
            consumed: totals.calories,
            goal: diary.calorieGoal,
            percent: Math.round(caloriesPercent),
          },
          water: {
            consumedMl: diary.waterMl,
            goalMl: diary.waterGoal,
            glasses,
            percent: Math.round(waterPercent),
          },
          macros: {
            protein: {
              consumed: totals.protein,
              goal: diary.macroGoals.protein,
            },
            carbs: {
              consumed: totals.carbs,
              goal: diary.macroGoals.carbs,
            },
            fat: {
              consumed: totals.fat,
              goal: diary.macroGoals.fat,
            },
            sugar: {
              consumed: totals.sugar,
              goal: diary.macroGoals.sugar,
            },
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong while fetching today's diary." },
      { status: 500 }
    );
  }
}