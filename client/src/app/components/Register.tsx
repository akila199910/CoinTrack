"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { registerSchema, type RegisterSubmitData } from "../validation/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitData } from "../api/api";
import Image from "next/image";
import loaderImage from "../animation/loader.svg";

const Register = () => {

    const [loader, setLoader] = useState(false);
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

        const payload: RegisterSubmitData = {
            ...data,
            name: `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim(),
        };
        const res = await submitData(payload);
        console.log(res);
    };

    return (
        loader == true ? <div className="flex justify-center items-center h-screen w-full"> <Image src={loaderImage} alt="loader" width={100} height={100} /> </div> :
            <div className="mx-auto p-4 sm:p-6 lg:p-10">
                <div className="mx-auto mb-6 text-center">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Coin Tracker System
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 font-semibold">Save your money</p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid gap-4 rounded-2xl border bg-purple-100 p-4 shadow-sm sm:p-6"
                    noValidate
                >
                    {/* First Name */}
                    <div className="space-y-2">
                        <label htmlFor="firstName" className="block text-sm font-medium">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            placeholder="John"
                            className="block w-full rounded-md px-2 py-1 shadow-sm outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:text-sm"
                            {...register("firstName")}
                        />
                        {errors.firstName && (
                            <p id="firstName-error" className="text-sm text-red-600">
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
                            className="block w-full rounded-md px-2 py-1 shadow-sm outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:text-sm"
                            {...register("lastName")}
                        />
                        {errors.lastName && (
                            <p id="lastName-error" className="text-sm text-red-600">
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

                    {/* Contact Number */}
                    <div className="space-y-2">
                        <label htmlFor="contactNumber" className="block text-sm font-medium">
                            Contact Number
                        </label>
                        <input
                            type="text"
                            id="contactNumber"
                            placeholder="+94 77 123 4567"
                            className="block w-full rounded-md px-2 py-1 shadow-sm outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:text-sm"
                            {...register("contactNumber")}
                            aria-invalid={!!errors.contactNumber || undefined}
                            aria-describedby={errors.contactNumber ? "contactNumber-error" : undefined}
                        />
                        {errors.contactNumber && (
                            <p id="contactNumber-error" className="text-sm text-red-600">
                                {errors.contactNumber.message}
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
                        {isSubmitting ? "Registering..." : "Register"}
                    </button>
                </form>
            </div>
    );
};

export default Register;
