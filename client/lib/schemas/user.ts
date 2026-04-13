import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  height: { type: Number, required: true, min: 50, max: 300 },
  weight: { type: Number, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  goal: { type: String, required: true },
  checkIns: [
    {
      date: { type: Date, required: true },
      weight: { type: Number, required: true },
    },
  ],
  AccCreationDate: { type: Date, required: true, default: Date.now },
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;




