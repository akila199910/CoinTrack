"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { registerSchema, type RegisterSubmitData } from "../validation/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitData } from "../api/api";
import Image from "next/image";
import loaderImage from "../animation/loader.svg";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import eye from "../icons/eye.svg";
import eyeSlash from "../icons/eye-off.svg";
const Register = () => {
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState<string>("");
    const [viewPassword, setViewPassword] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
    } = useForm<RegisterSubmitData>({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
        defaultValues: {
            firstName: "",
            lastName: "",
            name: "",
            email: "",
            contactNumber: "",
            password: "",
            active: true,
        },
    });

    const firstName = watch("firstName");
    const lastName = watch("lastName");

    useEffect(() => {
        const full = `${firstName ?? ""} ${lastName ?? ""}`.trim();
        setValue("name", full, { shouldValidate: true, shouldDirty: true });
    }, [firstName, lastName, setValue]);

    const onSubmit = async (data: RegisterSubmitData) => {
        setLoader(true);
        setError("");

        try {
            const payload: RegisterSubmitData = {
                ...data,
                name: `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim(),
            };

            const response = await submitData(payload);

            if (response.status === 201 || response.status === 200) {
                // Registration successful
                if (response.data && response.data.data && response.data.data.user) {
                    // Auto-login after successful registration
                    login(response.data.data.user, "cookie-token");
                    router.push("/dashboard");
                } else {
                    // Registration successful but no user data returned, redirect to login
                    router.push("/login");
                }
            } else {
                // Handle registration errors
                if (response.data && response.data.message) {
                    setError(response.data.message);
                } else if (response.data && response.data.errors) {
                    const errorMessages = Object.values(response.data.errors).flat();
                    setError(errorMessages.join(", "));
                } else {
                    setError("Registration failed. Please try again.");
                }
            }
        } catch (err) {
            setError("Network error. Please check your connection.");
            console.error("Registration error:", err);
        } finally {
            setLoader(false);
        }
    };

    if (loader) {
        return (
            <div className="flex justify-center items-center h-64 w-full">
                <Image src={loaderImage} alt="loader" width={100} height={100} />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
            {/* Error Message */}
            {error && (
                <div className="auth-error">
                    <p>{error}</p>
                </div>
            )}

            {/* First Name */}
            <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium">
                    First Name
                </label>
                <input
                    type="text"
                    id="firstName"
                    placeholder="John"
                    className="auth-input"
                    {...register("firstName")}
                />
                {errors.firstName && (
                    <p className="text-sm text-red-600">
                        {errors.firstName.message}
                    </p>
                )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium">
                    Last Name
                </label>
                <input
                    type="text"
                    id="lastName"
                    placeholder="Doe"
                    className="auth-input"
                    {...register("lastName")}
                />
                {errors.lastName && (
                    <p className="text-sm text-red-600">
                        {errors.lastName.message}
                    </p>
                )}
            </div>

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

            {/* Contact Number */}
            <div className="space-y-2">
                <label htmlFor="contactNumber" className="block text-sm font-medium">
                    Contact Number
                </label>
                <input
                    type="text"
                    id="contactNumber"
                    placeholder="+94 77 123 4567"
                    className="auth-input"
                    {...register("contactNumber")}
                />
                {errors.contactNumber && (
                    <p className="text-sm text-red-600">
                        {errors.contactNumber.message}
                    </p>
                )}
            </div>

            {/* Password */}
            <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                    Password
                </label>
                <div className="flex items-center gap-2 relative">
                <input
                    type={viewPassword ? "text" : "password"}
                    id="password"
                    placeholder="**********"
                    className="auth-input"
                    {...register("password")}
                />
                <Image src={viewPassword ? eye : eyeSlash} alt="eye" className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2" onClick={() => setViewPassword(!viewPassword)} />
                </div>
                {errors.password && (
                    <p className="text-sm text-red-600">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="auth-button rounded-lg bg-blue-500 mt-4
                     text-white p-2 font-medium outline-none transition-all 
                     duration-200 focus:shadow-md cursor-pointer"
            >
                {isSubmitting ? "Registering..." : "Register"}
            </button>
        </form>
    );
};

export default Register;
