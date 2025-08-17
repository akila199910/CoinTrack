"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSubmitData } from "../validation/login";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSubmitData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit", 
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginSubmitData) => {
    // Replace with your API call
    console.log(data);
  };

  return (
    <div className="mx-auto p-4 sm:p-6 lg:p-10">
      <div className="mx-auto mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Coin Tracker System
        </h1>
        <p className="mt-1 text-sm text-gray-600 font-semibold">
          Save your money
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 rounded-2xl border bg-purple-100 p-4 shadow-sm sm:p-6"
        noValidate
      >
        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="example@gmail.com"
            className="block w-full rounded-md px-2 py-1 shadow-sm outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:text-sm"
            {...register("email")}
            aria-invalid={!!errors.email || undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="**********"
            className="block w-full rounded-md px-2 py-1 shadow-sm outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:text-sm"
            {...register("password")}
                      />
          {errors.password && (
            <p id="password-error" className="text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-purple-600 px-4 py-2 text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default Login;
