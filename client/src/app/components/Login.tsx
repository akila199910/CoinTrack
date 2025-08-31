"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSubmitData } from "../validation/login";
import { loginUser } from "../api/api";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { login } = useAuth();
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
    try {
      setError("");
      const response = await loginUser(data);
      console.log(response)
      if (response.status === 201 || response.status === 200) {
        if (response.data.data && response.data.data.user) {
          login(response.data.data.user, "access_token");
          router.push("/dashboard");
        } else {
          setError("Invalid response from server");
        }
      } else {
        if (response.data && response.data.message) {
          setError(response.data.message);
        } else if (response.data && response.data.errors) {
          const errorMessages = Object.values(response.data.errors).flat();
          setError(errorMessages.join(", "));
        } else {
          setError("Login failed. Please try again.");
        }
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      console.error("Login error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
      {/* Error Message */}
      {error && (
        <div className="auth-error">
          <p>{error}</p>
        </div>
      )}

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="example@gmail.com"
          className="auth-input"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-600">
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
          className="auth-input"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="auth-button"
      >
        {isSubmitting ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
};

export default Login;
