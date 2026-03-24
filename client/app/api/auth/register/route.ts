import { NextResponse, type NextRequest } from "next/server";
import User from "@/lib/schemas/user";
import bcrypt from "bcrypt"
import dbConnect from "@/lib/util/dbConnect";


export async function POST(req: NextRequest){
    try{
        await dbConnect()
        const data = await req.json()
        const existingEmail = await User.findOne({email: data.email})
        if(existingEmail){
            return NextResponse.json({message: "This email is already in use"}, {status: 403})
        }
        const hashedPassword = await bcrypt.hash(data.password, 10)
        const newUser = new User({
            firstName: data.firstName,
            email: data.email,
            password: hashedPassword,
            height: data.height,
            weight: data.weight,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            goal: data.goal,
            checkIns: [
                {
                    date: new Date(),
                    weight: data.weight
                }
            ]
        })
        await newUser.save()
        return NextResponse.json({message: "User Registeration successful"}, {status: 201})
    }catch(error){
        console.error(error)
        return NextResponse.json({message: "An error occured during the registration process.. please try again later."}, {status: 500})
    }
}