"use client";

import { Toaster } from "react-hot-toast";
import AuthForm from "@/components/authForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Toaster />
      <AuthForm />
    </div>
  );
}