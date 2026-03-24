import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/util/dbConnect";
import User from "@/lib/schemas/user";
import IronSessionSettings from "@/lib/util/IronSessionSettings";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const session = await IronSessionSettings();
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        const data = await req.json();
        const { weight } = data;

        if (typeof weight !== "number" || weight <= 0) {
            return NextResponse.json(
                { message: "A valid weight is required." },
                { status: 400 }
            );
        }
        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json(
                { message: "User not found." },
                { status: 404 }
            );
        }
        const now = new Date();
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date(now);
        todayEnd.setHours(23, 59, 59, 999);

        const existingCheckIn = user.checkIns.find((checkIn: { date: Date; weight: number }) => {
            const checkInDate = new Date(checkIn.date);
            return checkInDate >= todayStart && checkInDate <= todayEnd;
        });

        if (existingCheckIn) {
            existingCheckIn.weight = weight;
            existingCheckIn.date = now;
        } else {
            user.checkIns.push({
                date: now,
                weight: weight
            });
        }

        user.weight = weight;

        await user.save();

        return NextResponse.json(
            {
                message: existingCheckIn
                    ? "Today's check-in updated successfully"
                    : "Check-in added successfully",
                user
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Something went wrong whilst adding the check-in" },
            { status: 500 }
        );
    }
}