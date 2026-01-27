import mongoose from "mongoose";

export default async function dbConnect(){
    try{
        const connection = await mongoose.connect(process.env.MONGO_URL as string)
        return connection
    }catch(error){
        console.log("Something went wrong connecting to the database...", error)
        process.exit()
    }
}