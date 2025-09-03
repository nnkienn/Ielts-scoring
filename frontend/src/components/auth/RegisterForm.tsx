"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 👉 Demo: chỉ log ra console, chưa call API
    console.log("Register:", { name, email, password });
    router.push("/homepage");
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gray-200 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden ">
        {/* RIGHT - Image */}
        <div className="md:w-1/2 hidden md:block">
          <img
            src="/images/login.png"
            alt="Register illustration"
            className="object-cover h-full w-full rounded-2xl"
          />
        </div>

        {/* LEFT - Form */}
        <div className="md:w-1/2 w-full p-8 md:p-10">
          <h1 className="md:text-3xl text-gray-700 font-bold">Welcome!</h1>
          <p className="text-gray-500 text-sm mb-6">
            Sign up to start improving your writing skills.
          </p>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <span className="px-2 text-gray-400 text-sm">Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 w-full border-gray-200 rounded-2xl px-4 py-2 text-gray-600"
              />
            </div>

            <div>
              <span className="px-2 text-gray-400 text-sm">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 w-full border-gray-200 rounded-2xl px-4 py-2 text-gray-600"
              />
            </div>

            <div>
              <span className="px-2 text-gray-400 text-sm">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 w-full border-gray-200 rounded-2xl px-4 py-2 text-gray-600"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl px-4 py-2 text-white font-bold bg-green-500 hover:bg-green-700 transition"
            >
              Register
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <Link href="/signin">
              <span className="text-sm text-gray-500">
                If you already have an account?{" "}
              </span>
              <span className="text-sm text-green-600 font-semibold underline">
                Please login here
              </span>
            </Link>
          </div>

          {/* Divider */}
          <div className="mt-6 flex items-center">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-4 text-sm text-gray-500">Or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Social Login */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              className="flex-1 flex items-center justify-center space-x-2 text-gray-500 rounded-md border px-4 py-2 hover:bg-gray-50 text-sm md:text-base"
            >
              <img src="/images/facebook.jpg" alt="facebook" className="h-5 w-5" />
              <span>Login with Facebook</span>
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center space-x-2 text-gray-500 rounded-md border px-4 py-2 hover:bg-gray-50 text-sm md:text-base"
            >
              <img src="/images/google.png" alt="google" className="h-5 w-5" />
              <span>Login with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
