"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import axios from "axios";

type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const router = useRouter()

  const handleChange = (
    field: keyof LoginFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  async function attemptLogin(){
    try{
        if(!formData.email || !formData.password){
            return alert("Please fill in all fields.")
        }
        loginUser()
    }catch(error){
        console.error(error)
        alert("There was an error... Please try again later.")
    }
  }

  async function loginUser(){
    try{
        const response = await axios.post("/api/auth/login", {
            email: formData.email,
            password: formData.password
        })
        if(response.status === 201){
            router.push("/dashboard")
        }
    }catch(error){
        if (axios.isAxiosError(error) && error.response){
            return alert(error.response.data.message)
        }
        console.error(error)
        return alert("There was an error... Please try again later.")
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_35%,rgba(132,255,0,0.15),transparent_22%),radial-gradient(circle_at_82%_70%,rgba(132,255,0,0.08),transparent_20%),radial-gradient(circle_at_50%_100%,rgba(80,80,255,0.08),transparent_25%)]" />

        <div className="relative z-10 w-full max-w-[820px] rounded-[28px] border border-white/10 bg-black/80 px-8 py-10 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-sm md:px-14 md:py-12">
          <div className="mb-16 text-[22px] font-medium tracking-tight">app name</div>

          <div className="mx-auto max-w-[390px]">
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-medium tracking-tight md:text-5xl">Welcome Back</h1>
              <p className="mt-3 text-base text-white/35">Log in to get back on track with your<br />fitness journey.</p>
            </div>
            <div className="space-y-4">
              <InputField label="EMAIL" value={formData.email} onChange={(v) => handleChange("email", v)} type="email"/>
              <InputField label="PASSWORD" value={formData.password} onChange={(v) => handleChange("password", v)} type="password"/>
              <div className="flex items-center justify-between pt-1 text-sm">
                <label className="flex cursor-pointer items-center gap-3 text-white/35">
                  <input type="checkbox" checked={formData.rememberMe} onChange={(e) => handleChange("rememberMe", e.target.checked)} className="h-4 w-4 rounded border border-white/20 bg-transparent accent-lime-400"/>
                  <span>Remember Me</span>
                </label>
                <Link href="/forgot-password" className="text-white/35 transition hover:text-lime-400">Forgot Password?</Link>
              </div>
              <button onClick={attemptLogin} type="button" className="mt-6 h-[54px] w-full rounded-2xl bg-lime-400 text-base font-bold text-black transition hover:bg-lime-300">LOGIN</button>
              <div className="flex items-center gap-4 pt-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-white/30">OR</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <p className="pt-2 text-center text-base text-white/35">Don&apos;t have an account?{" "}<Link href="/register" className="font-medium text-lime-400 transition hover:text-lime-300">Register</Link>
              </p>
            </div>
          </div>
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

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: InputProps) {
  const isActive = value.length > 0;

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-[54px] w-full rounded-2xl border bg-transparent px-5 pt-4 text-sm text-white outline-none transition ${
          isActive
            ? "border-lime-400"
            : "border-white/20 focus:border-lime-400"
        }`}
      />
      <label
        className={`pointer-events-none absolute left-5 top-2 text-[11px] font-semibold tracking-[0.14em] ${
          isActive ? "text-lime-400" : "text-white/35"
        }`}
      >
        {label}
      </label>
    </div>
  );
}