import User from "@/lib/schemas/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import dbConnect from "@/lib/util/dbConnect";
import IronSessionSettings from "@/lib/util/IronSessionSettings";


export async function POST(req: NextRequest){
    try{
        await dbConnect()
        const session = await IronSessionSettings()
        const data = await req.json()
        const foundUser = await User.findOne({email: data.email})
        if(!foundUser){
            return NextResponse.json({message: "Invalid Credentials"}, {status: 404})
        }
        const passwordMatch = await bcrypt.compare(data.password, foundUser.password)
        if(passwordMatch){
            session.user = {
                id: foundUser._id.toString()
            }
            await session.save()
            return NextResponse.json({message: "User logged in"}, {status: 201})
        }
        return NextResponse.json({message: "Invalid Credentials"}, {status: 401})
    }catch(error){
        return NextResponse.json({message: "Internal server error..", error: error}, {status: 500})
    }
}