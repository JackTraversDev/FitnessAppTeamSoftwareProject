"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type UserData = {
  firstName: string;
  email: string;
  height: number;
  weight: number;
  dateOfBirth: string;
  gender: string;
  goal: string;
};

type MealItem = {
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
};

type MealGroup = {
  category: "Breakfast" | "Lunch" | "Dinner" | "Snacks";
  items: MealItem[];
};

type CheckIn = {
date: string;
weight: number;
};


type DiaryData = {
  diary: {
    date: string;
    waterMl: number;
    calorieGoal: number;
    waterGoal: number;
    macroGoals: {
      protein: number;
      carbs: number;
      fat: number;
      sugar: number;
    };
    meals: MealGroup[];
  };
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
  };
  summary: {
    calories: {
      consumed: number;
      goal: number;
      percent: number;
    };
    water: {
      consumedMl: number;
      goalMl: number;
      glasses: number;
      percent: number;
    };
    macros: {
      protein: { consumed: number; goal: number };
      carbs: { consumed: number; goal: number };
      fat: { consumed: number; goal: number };
      sugar: { consumed: number; goal: number };
    };
  };
};

const mealColors: Record<string, string> = {
  Breakfast: "text-violet-400",
  Lunch: "text-blue-400",
  Dinner: "text-yellow-400",
  Snacks: "text-orange-400",
};

export default function DashboardClient() {
  const [user, setUser] = useState<UserData | null>(null);
  const [diaryData, setDiaryData] = useState<DiaryData | null>(null);
  const [loading, setLoading] = useState(true);

const [showMealModal, setShowMealModal] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [submittingMeal, setSubmittingMeal] = useState(false);
  const [submittingWater, setSubmittingWater] = useState(false);

  const [mealForm, setMealForm] = useState({
    category: "Breakfast",
    name: "",
    serving: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    sugar: "",
  });

  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [submittingLogout, setSubmittingLogout] = useState(false);
  const [submittingDeleteAccount, setSubmittingDeleteAccount] = useState(false);

  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInWeight, setCheckInWeight] = useState("");
  const [submittingCheckIn, setSubmittingCheckIn] = useState(false);
  
  const [waterAmount, setWaterAmount] = useState("");

  async function loadDashboard() {
    try {
      const [userRes, diaryRes, checkInsRes] = await Promise.all([
        axios.get("/api/user/me"),
        axios.get("/api/diary/today"),
        axios.get("/api/user/checkins"),
      ]);

      setUser(userRes.data);
      setDiaryData(diaryRes.data);
      setCheckIns(checkInsRes.data.checkIns);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

    async function handleAddMeal() {
    try {
      if (
        !mealForm.category ||
        !mealForm.name ||
        !mealForm.serving ||
        !mealForm.calories ||
        !mealForm.protein ||
        !mealForm.carbs ||
        !mealForm.fat ||
        !mealForm.sugar
      ) {
        alert("Please fill in all meal fields.");
        return;
      }

      setSubmittingMeal(true);

      await axios.post("/api/diary/meal", {
        category: mealForm.category,
        name: mealForm.name,
        serving: mealForm.serving,
        calories: Number(mealForm.calories),
        protein: Number(mealForm.protein),
        carbs: Number(mealForm.carbs),
        fat: Number(mealForm.fat),
        sugar: Number(mealForm.sugar),
      });

      setMealForm({
        category: "Breakfast",
        name: "",
        serving: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        sugar: "",
      });

      setShowMealModal(false);
      await loadDashboard();
    } catch (error) {
      console.error(error);
      alert("Failed to add meal.");
    } finally {
      setSubmittingMeal(false);
    }
  }

  async function handleAddWater(amount?: number) {
    try {
      const finalAmount = amount ?? Number(waterAmount);

      if (!finalAmount || finalAmount <= 0) {
        alert("Enter a valid water amount.");
        return;
      }

      setSubmittingWater(true);

      await axios.post("/api/diary/water", {
        amount: finalAmount,
      });

      setWaterAmount("");
      setShowWaterModal(false);
      await loadDashboard();
    } catch (error) {
      console.error(error);
      alert("Failed to add water.");
    } finally {
      setSubmittingWater(false);
    }
  }

  async function handleLogout() {
  try {
    setSubmittingLogout(true);
    await axios.post("/api/auth/logout");
    router.push("/login");
    router.refresh();
  } catch (error) {
    console.error(error);
    alert("Failed to log out.");
  } finally {
    setSubmittingLogout(false);
  }
}

async function handleDeleteAccount() {
  const confirmed = window.confirm(
    "Are you sure you want to delete your account? This cannot be undone."
  );

  if (!confirmed) return;

  try {
    setSubmittingDeleteAccount(true);
    await axios.delete("/api/user/delete");
    router.push("/register");
    router.refresh();
  } catch (error) {
    console.error(error);
    alert("Failed to delete account.");
  } finally {
    setSubmittingDeleteAccount(false);
  }
}

  async function handleCheckIn() {
  try {
    if (!checkInWeight || Number(checkInWeight) <= 0) {
      alert("Enter a valid weight.");
      return;
    }

    setSubmittingCheckIn(true);

    await axios.post("/api/user/checkin", {
      weight: Number(checkInWeight),
    });

    setCheckInWeight("");
    setShowCheckInModal(false);
    await loadDashboard();
  } catch (error) {
    console.error(error);
    alert("Failed to save check-in.");
  } finally {
    setSubmittingCheckIn(false);
  }
}

  const totalRows = useMemo(() => {
    if (!diaryData) return null;

    return {
      calories: diaryData.totals.calories,
      protein: `${diaryData.totals.protein}g`,
      carbs: `${diaryData.totals.carbs}g`,
      fat: `${diaryData.totals.fat}g`,
      sugar: `${diaryData.totals.sugar}g`,
    };
  }, [diaryData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-10 text-white">
        Loading dashboard...
      </div>
    );
  }

  if (!user || !diaryData) {
    return (
      <div className="min-h-screen bg-black p-10 text-white">
        Failed to load dashboard.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <aside className="flex w-[250px] flex-col justify-between border-r border-white/10 bg-white/[0.03]">
          <div>
            <div className="px-6 py-7 text-[22px] font-medium">ByteFitness</div>

            <nav className="mt-2 space-y-2 px-2">
              <NavItem label="Diary" href="/dashboard" active />
            </nav>
          </div>
    <div className="relative p-4">
      <button
        onClick={() => setShowProfileMenu((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 text-left transition hover:border-white/20"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-black">
            <ProfileIcon />
          </div>
          <span className="text-sm text-white/90">{user.firstName}</span>
        </div>
        <span className="text-white/30">{showProfileMenu ? "⌄" : "›"}</span>
      </button>

      {showProfileMenu && (
        <div className="absolute bottom-[84px] left-4 right-4 z-40 overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-2xl">
          <button
            onClick={handleLogout}
            disabled={submittingLogout}
            className="w-full border-b border-white/5 px-4 py-3 text-left text-sm text-white/85 transition hover:bg-white/[0.05] disabled:opacity-60"
          >
            {submittingLogout ? "Logging out..." : "Logout"}
          </button>

          <button
            onClick={handleDeleteAccount}
            disabled={submittingDeleteAccount}
            className="w-full px-4 py-3 text-left text-sm text-red-400 transition hover:bg-white/[0.05] disabled:opacity-60"
          >
            {submittingDeleteAccount ? "Deleting account..." : "Delete Account"}
          </button>
        </div>
      )}
    </div>
        </aside>

        <section className="flex-1 px-8 py-6">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-5xl font-medium tracking-tight">Diary</h1>

            <div className="flex gap-4">
              <button
                onClick={() => setShowCheckInModal(true)}
                className="rounded-2xl border border-white/20 px-7 py-4 text-base text-white/90 transition hover:border-lime-400 hover:text-lime-400"
              >
                Check In
              </button>

              <button className="rounded-2xl border border-white/20 px-7 py-4 text-base text-white/90 transition hover:border-white/40">
                Edit Goals
              </button>

              <button
                onClick={() => setShowMealModal(true)}
                className="rounded-2xl bg-lime-400 px-8 py-4 text-base font-semibold text-black transition hover:bg-lime-300"
              >
                + Add Meal
              </button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_1.2fr_1.1fr]">
            <Card className="p-5">
            <div className="mb-3 flex items-center justify-between text-sm text-white/35">
                <span>Calories</span>
                <span>
                {diaryData.summary.calories.consumed}/
                {diaryData.summary.calories.goal} kcal
                </span>
            </div>

            <div className="flex items-center justify-center py-3">
                <CalorieGauge percent={diaryData.summary.calories.percent} />
            </div>
            </Card>

            <Card className="p-5">
              <div className="mb-5 flex items-center justify-between text-sm text-white/35">
                <span>Water</span>
                <button
                onClick={() => setShowWaterModal(true)}
                className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:border-white/40"
                >
                + Add Water
                </button>
              </div>

              <div className="mb-3 flex items-center justify-between text-white/90">
                <span>
                  {diaryData.summary.water.consumedMl}/
                  {diaryData.summary.water.goalMl} ml
                </span>
                <span>{diaryData.summary.water.glasses} glasses</span>
              </div>

              <div className="flex items-center gap-3">
                <WaterIcon />
                <div className="h-12 flex-1 overflow-hidden rounded-xl bg-white/10">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${diaryData.summary.water.percent}%` }}
                  />
                </div>
              </div>

              <p className="mt-4 text-sm text-white/25">
                Goal: {diaryData.summary.water.goalMl} ml • 250ml per glass
              </p>
            </Card>

            <Card className="p-5">
              <div className="mb-5 text-sm text-white/35">Macros</div>

              <MacroRow
                label="Protein"
                color="bg-violet-400"
                textColor="text-violet-400"
                consumed={diaryData.summary.macros.protein.consumed}
                goal={diaryData.summary.macros.protein.goal}
              />
              <MacroRow
                label="Carbs"
                color="bg-lime-400"
                textColor="text-lime-400"
                consumed={diaryData.summary.macros.carbs.consumed}
                goal={diaryData.summary.macros.carbs.goal}
              />
              <MacroRow
                label="Fat"
                color="bg-orange-500"
                textColor="text-orange-500"
                consumed={diaryData.summary.macros.fat.consumed}
                goal={diaryData.summary.macros.fat.goal}
              />
              <MacroRow
                label="Sugar"
                color="bg-yellow-400"
                textColor="text-yellow-400"
                consumed={diaryData.summary.macros.sugar.consumed}
                goal={diaryData.summary.macros.sugar.goal}
              />
            </Card>
          </div>

          <div className="mt-10">
            <h2 className="mb-5 text-5xl font-medium tracking-tight">Meals</h2>

            <div className="overflow-hidden rounded-2xl">
              <div className="grid grid-cols-[2.3fr_0.6fr_0.6fr_0.6fr_0.6fr_0.6fr_0.7fr] px-4 py-3 text-sm uppercase tracking-wide text-white/30">
                <div>Meal / Category</div>
                <div>Serving</div>
                <div>Calories</div>
                <div>Protein</div>
                <div>Carbs</div>
                <div>Fat</div>
                <div>Sugar</div>
              </div>

              <div className="space-y-2">
                {diaryData.diary.meals.map((group) => {
                  const groupTotals = group.items.reduce(
                    (acc, item) => {
                      acc.calories += item.calories;
                      acc.protein += item.protein;
                      acc.carbs += item.carbs;
                      acc.fat += item.fat;
                      acc.sugar += item.sugar;
                      return acc;
                    },
                    {
                      calories: 0,
                      protein: 0,
                      carbs: 0,
                      fat: 0,
                      sugar: 0,
                    }
                  );

                  return (
                    <div key={group.category}>
                      <div className="grid grid-cols-[2.3fr_0.6fr_0.6fr_0.6fr_0.6fr_0.6fr_0.7fr] items-center rounded-2xl bg-white/[0.05] px-4 py-4">
                        <div className={`text-2xl ${mealColors[group.category]}`}>
                          • <span className="text-xl">{group.category}</span>
                        </div>
                        <div />
                        <div>{groupTotals.calories || ""}</div>
                        <div>{groupTotals.protein ? `${groupTotals.protein}g` : ""}</div>
                        <div>{groupTotals.carbs ? `${groupTotals.carbs}g` : ""}</div>
                        <div>{groupTotals.fat ? `${groupTotals.fat}g` : ""}</div>
                        <div>{groupTotals.sugar ? `${groupTotals.sugar}g` : ""}</div>
                      </div>

                      {group.items.map((item, index) => (
                        <div
                          key={`${group.category}-${index}`}
                          className="grid grid-cols-[2.3fr_0.6fr_0.6fr_0.6fr_0.6fr_0.6fr_0.7fr] items-center border-b border-white/5 px-4 py-4 text-white/75"
                        >
                          <div className="text-2xl">
                            <span className="mr-4 text-white/60">{index + 1}</span>
                            <span>{item.name}</span>
                          </div>
                          <div>{item.serving}</div>
                          <div>{item.calories}</div>
                          <div>{item.protein}g</div>
                          <div>{item.carbs}g</div>
                          <div>{item.fat}g</div>
                          <div>{item.sugar}g</div>
                        </div>
                      ))}
                    </div>
                  );
                })}

                {totalRows && (
                  <div className="grid grid-cols-[2.3fr_0.6fr_0.6fr_0.6fr_0.6fr_0.6fr_0.7fr] items-center rounded-2xl bg-white/[0.05] px-4 py-5 text-2xl text-white/90">
                    <div>Total</div>
                    <div />
                    <div>{totalRows.calories}</div>
                    <div>{totalRows.protein}</div>
                    <div>{totalRows.carbs}</div>
                    <div>{totalRows.fat}</div>
                    <div>{totalRows.sugar}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-10">
          <h2 className="mb-5 text-5xl font-medium tracking-tight">Weight Check-Ins</h2>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
              <div className="grid grid-cols-2 px-5 py-4 text-sm uppercase tracking-wide text-white/30">
                <div>Date</div>
                <div>Weight</div>
              </div>

              {checkIns.length === 0 ? (
                <div className="px-5 py-6 text-white/40">No check-ins yet.</div>
              ) : (
                checkIns.slice(0, 7).map((checkIn, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 border-t border-white/5 px-5 py-4 text-white/85"
                  >
                    <div>{formatCheckInDate(checkIn.date)}</div>
                    <div>{checkIn.weight} kg</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
                      {showMealModal && (
        <Modal title="Add Meal" onClose={() => setShowMealModal(false)}>
          <div className="space-y-4">
            <select
              value={mealForm.category}
              onChange={(e) =>
                setMealForm((prev) => ({ ...prev, category: e.target.value }))
              }
              className="h-[52px] w-full rounded-2xl border border-white/20 bg-black px-4 text-white outline-none focus:border-lime-400"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snacks">Snacks</option>
            </select>

            <ModalInput
              placeholder="Meal name"
              value={mealForm.name}
              onChange={(v) => setMealForm((prev) => ({ ...prev, name: v }))}
            />

            <ModalInput
              placeholder="Serving"
              value={mealForm.serving}
              onChange={(v) => setMealForm((prev) => ({ ...prev, serving: v }))}
            />

            <div className="grid grid-cols-2 gap-3">
              <ModalInput
                placeholder="Calories"
                type="number"
                value={mealForm.calories}
                onChange={(v) =>
                  setMealForm((prev) => ({ ...prev, calories: v }))
                }
              />
              <ModalInput
                placeholder="Protein (g)"
                type="number"
                value={mealForm.protein}
                onChange={(v) =>
                  setMealForm((prev) => ({ ...prev, protein: v }))
                }
              />
              <ModalInput
                placeholder="Carbs (g)"
                type="number"
                value={mealForm.carbs}
                onChange={(v) =>
                  setMealForm((prev) => ({ ...prev, carbs: v }))
                }
              />
              <ModalInput
                placeholder="Fat (g)"
                type="number"
                value={mealForm.fat}
                onChange={(v) => setMealForm((prev) => ({ ...prev, fat: v }))}
              />
            </div>

            <ModalInput
              placeholder="Sugar (g)"
              type="number"
              value={mealForm.sugar}
              onChange={(v) => setMealForm((prev) => ({ ...prev, sugar: v }))}
            />

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowMealModal(false)}
                className="h-[52px] flex-1 rounded-2xl border border-white/20 text-white/80 transition hover:border-white/40"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMeal}
                disabled={submittingMeal}
                className="h-[52px] flex-1 rounded-2xl bg-lime-400 font-semibold text-black transition hover:bg-lime-300 disabled:opacity-60"
              >
                {submittingMeal ? "Adding..." : "Add Meal"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showWaterModal && (
        <Modal title="Add Water" onClose={() => setShowWaterModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleAddWater(250)}
                className="h-[50px] rounded-2xl border border-white/20 text-white/80 transition hover:border-lime-400 hover:text-lime-400"
              >
                +250ml
              </button>
              <button
                onClick={() => handleAddWater(500)}
                className="h-[50px] rounded-2xl border border-white/20 text-white/80 transition hover:border-lime-400 hover:text-lime-400"
              >
                +500ml
              </button>
              <button
                onClick={() => handleAddWater(1000)}
                className="h-[50px] rounded-2xl border border-white/20 text-white/80 transition hover:border-lime-400 hover:text-lime-400"
              >
                +1000ml
              </button>
            </div>

            <ModalInput
              placeholder="Custom amount in ml"
              type="number"
              value={waterAmount}
              onChange={setWaterAmount}
            />

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowWaterModal(false)}
                className="h-[52px] flex-1 rounded-2xl border border-white/20 text-white/80 transition hover:border-white/40"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddWater()}
                disabled={submittingWater}
                className="h-[52px] flex-1 rounded-2xl bg-lime-400 font-semibold text-black transition hover:bg-lime-300 disabled:opacity-60"
              >
                {submittingWater ? "Adding..." : "Add Water"}
              </button>
            </div>
          </div>
        </Modal>
      )}
      {showCheckInModal && (
      <Modal
        title="Daily Weight Check-In"
        onClose={() => setShowCheckInModal(false)}
      >
        <div className="space-y-4">
          <ModalInput
            placeholder="Enter weight in kg"
            type="number"
            value={checkInWeight}
            onChange={setCheckInWeight}
          />

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowCheckInModal(false)}
              className="h-[52px] flex-1 rounded-2xl border border-white/20 text-white/80 transition hover:border-white/40"
            >
              Cancel
            </button>
            <button
              onClick={handleCheckIn}
              disabled={submittingCheckIn}
              className="h-[52px] flex-1 rounded-2xl bg-lime-400 font-semibold text-black transition hover:bg-lime-300 disabled:opacity-60"
            >
              {submittingCheckIn ? "Saving..." : "Save Check-In"}
            </button>
          </div>
        </div>
      </Modal>
    )}
    </main>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.04] ${className}`}>
      {children}
    </div>
  );
}

function NavItem({
  label,
  href,
  active = false,
}: {
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-r-2xl px-6 py-4 text-[28px] transition ${
        active
          ? "border-l-4 border-lime-400 bg-white/[0.05] text-white"
          : "text-white/80 hover:bg-white/[0.03]"
      }`}
    >
      <span className="text-lg">{label}</span>
    </Link>
  );
}

function MacroRow({
  label,
  color,
  textColor,
  consumed,
  goal,
}: {
  label: string;
  color: string;
  textColor: string;
  consumed: number;
  goal: number;
}) {
  const percent = goal > 0 ? Math.min((consumed / goal) * 100, 100) : 0;

  return (
    <div className="mb-5 grid grid-cols-[52px_1fr_70px] items-center gap-4">
      <span className={`text-sm ${textColor}`}>{label}</span>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-right text-sm text-white/35">
        {consumed} / {goal}g
      </span>
    </div>
  );
}

function ProfileIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function WaterIcon() {
  return (
    <svg className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.5c-2.2 3.2-6.5 7.2-6.5 11.3A6.5 6.5 0 0 0 12 20.3a6.5 6.5 0 0 0 6.5-6.5C18.5 9.7 14.2 5.7 12 2.5Zm-2.6 12.7c0 1.4 1.2 2.6 2.6 2.6v1.5c-2.3 0-4.1-1.8-4.1-4.1h1.5Z" />
    </svg>
  );
}


    function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-[520px] rounded-3xl border border-white/10 bg-[#0f0f0f] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-2xl font-medium text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-xl text-white/40 transition hover:text-white"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-[52px] w-full rounded-2xl border border-white/20 bg-black px-4 text-white placeholder:text-white/30 outline-none transition focus:border-lime-400"
    />
  );
}

function formatCheckInDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function CalorieGauge({ percent }: { percent: number }) {
  const clampedPercent = Math.max(0, Math.min(percent, 100));

  const radius = 70;
  const strokeWidth = 18;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = Math.PI * normalizedRadius;
  const dashOffset = circumference - (clampedPercent / 100) * circumference;

  return (
    <div className="relative flex h-[140px] w-[260px] items-end justify-center">
      <svg
        width="260"
        height="140"
        viewBox="0 0 260 140"
        className="overflow-visible"
      >
        <path
          d="
            M 60 120
            A 70 70 0 0 1 200 120
          "
          fill="none"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        <path
          d="
            M 60 120
            A 70 70 0 0 1 200 120
          "
          fill="none"
          stroke="#a78bfa"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>

      <div className="absolute bottom-3 text-5xl font-medium text-white">
        {clampedPercent}%
      </div>
    </div>
  );
}