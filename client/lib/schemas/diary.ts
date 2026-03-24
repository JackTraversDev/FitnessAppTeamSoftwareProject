import mongoose from "mongoose";

const mealItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serving: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
  sugar: { type: Number, required: true },
});

const mealGroupSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner", "Snacks"],
    required: true,
  },
  items: [mealItemSchema],
});

const diarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  date: { type: String, required: true },
  waterMl: { type: Number, default: 0 },
  calorieGoal: { type: Number, default: 2500 },
  waterGoal: { type: Number, default: 3000 },
  macroGoals: {
    protein: { type: Number, default: 150 },
    carbs: { type: Number, default: 180 },
    fat: { type: Number, default: 60 },
    sugar: { type: Number, default: 50 },
  },
  meals: [mealGroupSchema],
});

const Diary = mongoose.models.diaries || mongoose.model("diaries", diarySchema);

export default Diary;