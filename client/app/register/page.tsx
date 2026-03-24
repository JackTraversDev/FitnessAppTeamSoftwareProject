"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type FormData = {
  firstName: string;
  email: string;
  password: string;
  confirmPassword: string;
  height: string;
  weight: string;
  birthday: string;
  gender: string;
  goal: string;
};

const goals = [
  "Lose Weight",
  "Build Muscle",
  "Stay Active",
  "Improve Flexibility",
  "Boost Endurance",
];

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
    height: "",
    weight: "",
    birthday: "",
    gender: "Male",
    goal: "Stay Active",
  });

  const router = useRouter();

  async function registerUser() {
    try {
      const response = await axios.post("/api/auth/register", {
        firstName: formData.firstName,
        email: formData.email,
        password: formData.password,
        height: formData.height,
        weight: formData.weight,
        dateOfBirth: formData.birthday,
        gender: formData.gender,
        goal: formData.goal,
      });

      if (response.status === 201) {
        alert("Registration Successful");
        router.push("/login");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return alert(error.response.data.message);
      }
      alert("An error occurred. Please try again later.");
      console.log(error);
    }
  }

  async function attemptRegister() {
    try {
      if (
        !formData.firstName ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword ||
        !formData.height ||
        !formData.weight ||
        !formData.birthday ||
        !formData.gender ||
        !formData.goal
      ) {
        alert("Please fill in all fields.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert("Double check your password..");
        return;
      } else if (
        !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          formData.password
        )
      ) {
        return alert(
          "Ensure your password is at least 8 characters long, contains at least one numner and one special character."
        );
      } else if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
          formData.email
        )
      ) {
        return alert("Please enter a valid email address.");
      }

      registerUser();
    } catch (error) {
      alert(String(error));
    }
  }

  function handleContinue() {
    if (
      !formData.firstName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all step 1 fields.");
      return
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Double check your password..");
      return
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      alert("Ensure your password is at least 8 characters long, contains at least one numner and one special character.");
      return
    }

    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      alert("Please enter a valid email address.");
      return
    }

    setStep(2);
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_35%,rgba(132,255,0,0.15),transparent_22%),radial-gradient(circle_at_82%_70%,rgba(132,255,0,0.08),transparent_20%),radial-gradient(circle_at_50%_100%,rgba(80,80,255,0.08),transparent_25%)]" />

        <div className="relative z-10 w-full max-w-[820px] rounded-[28px] border border-white/10 bg-black/80 px-8 py-10 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-sm md:px-14 md:py-12">
          <div className="mb-8 text-[22px] font-medium">app name</div>

          <div className="mx-auto mb-10 flex w-full max-w-[360px] items-center justify-center gap-4">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                step >= 1
                  ? "bg-lime-400 text-black"
                  : "border border-white/20"}`}>1
            </div>
            <div className={`h-[2px] w-28 ${step === 2 ? "bg-lime-400" : "bg-white/10"}`}/>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${step === 2 ? "bg-lime-400 text-black" : "border border-white/20"}`}>2
            </div>
          </div>

          {step === 1 && (
            <div className="mx-auto max-w-[390px]">
              <div className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl">Create an Account</h1>
                <p className="mt-3 text-white/35">Get started on your fitness journey today.<br />It’s free!</p>
              </div>

              <div className="space-y-4">
                <InputField label="FIRST NAME" value={formData.firstName} onChange={(v) => handleChange("firstName", v)}/>
                <InputField label="EMAIL" value={formData.email} onChange={(v) => handleChange("email", v)}/>
                <InputField label="PASSWORD" type="password" value={formData.password} onChange={(v) => handleChange("password", v)}/>
                <InputField label="CONFIRM PASSWORD" type="password" value={formData.confirmPassword} onChange={(v) => handleChange("confirmPassword", v)}/>
                <button onClick={handleContinue} className="mt-6 h-[54px] w-full rounded-2xl bg-lime-400 font-bold text-black hover:bg-lime-300">CONTINUE</button>
                <p className="pt-4 text-center text-white/35">Already have an account?{" "}<Link href="/login" className="text-lime-400">Log in</Link></p>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="mx-auto max-w-[420px]">
              <div className="mb-4">
                <button type="button" onClick={() => setStep(1)} className="group flex items-center gap-2 text-sm text-white/40 transition hover:text-lime-400"><span className="transition group-hover:-translate-x-1">←</span>Back</button>
              </div>
              <div className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl">Setup Your Profile</h1>
                <p className="mt-3 text-white/35">Help us personalize your experience.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="HEIGHT (CM)" value={formData.height} onChange={(v) => handleChange("height", v)}/>
                  <InputField label="WEIGHT (KG)" value={formData.weight} onChange={(v) => handleChange("weight", v)}/>
                </div>

                <InputField label="BIRTHDAY" type="date" value={formData.birthday} onChange={(v) => handleChange("birthday", v)}/>
                <div>
                  <p className="mb-2 text-xs text-white/35">GENDER</p>
                  <div className="flex gap-3">
                    {["Male", "Female"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => handleChange("gender", g)}
                        className={`rounded-xl border px-5 py-2 ${
                          formData.gender === g
                            ? "border-lime-400 text-lime-400"
                            : "border-white/10 text-white/40"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs text-white/35">GOAL</p>
                  <div className="flex flex-wrap gap-2">
                    {goals.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => handleChange("goal", goal)}
                        className={`rounded-xl border px-4 py-2 ${
                          formData.goal === goal
                            ? "border-lime-400 text-lime-400"
                            : "border-white/10 text-white/40"
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="mt-6 h-[54px] w-full rounded-2xl bg-lime-400 font-bold text-black hover:bg-lime-300"
                  onClick={attemptRegister}
                >
                  CREATE ACCOUNT
                </button>

                <p className="pt-4 text-center text-white/35">
                  Already have an account?{" "}
                  <Link href="/login" className="text-lime-400">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
};

function InputField({ label, value, onChange, type = "text" }: InputProps) {
  const isActive = value.length > 0;

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-[54px] w-full rounded-2xl border bg-transparent px-5 pt-4 text-sm outline-none transition ${
          isActive
            ? "border-lime-400"
            : "border-white/20 focus:border-lime-400"
        }`}
      />
      <label
        className={`absolute left-5 top-2 text-[11px] tracking-wider ${
          isActive ? "text-lime-400" : "text-white/35"
        }`}
      >
        {label}
      </label>
    </div>
  );
}