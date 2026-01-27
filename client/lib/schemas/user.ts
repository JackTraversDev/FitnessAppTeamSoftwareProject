import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true, unique: false},
    lastName: {type: String, required: true, unique: false},
    email: {type: String, required: true, unique: true},
    height: {type: Number, required: true, unique: false},
    weight: {type: Number, required: true, unique: false},
    age: {type: Number, required: true, unique: false},
    checkIns: [],
    AccCreationDate: {type: Date, default: Date.now()}
})

const User = mongoose.model("users", userSchema)

export default User