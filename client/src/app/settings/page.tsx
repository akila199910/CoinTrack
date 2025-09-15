"use client"

import { useState } from "react";
import Image from "next/image";
import eye from "../icons/eye.svg";
import eyeSlash from "../icons/eye-off.svg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema, SettingsSubmitData } from "../validation/settings";
import { updatePassword } from "../api/api";
const page = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [viewPassword, setViewPassword] = useState(false);
    const [viewConfirmPassword, setViewConfirmPassword] = useState(false);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(settingsSchema),
        mode: "onSubmit",
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: SettingsSubmitData) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await updatePassword(data);
            console.log(response);

            if (response.data.status) {
                // Success case
                setSuccess("Password updated successfully!");
                reset(); // Clear form inputs

                // Show loader for 2000ms then hide it
                setTimeout(() => {
                    setLoading(false);
                }, 2000);
            } else {
                // Error case
                setError(response.data.message || 'Failed to update password');
                setLoading(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">
                            {success ? "Password updated successfully!" : "Updating password..."}
                        </p>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <>
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center uppercase">
                Settings
            </h1>

            <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default mx-auto max-w-sm">
                <form className="mx-auto p-4" noValidate onSubmit={handleSubmit(onSubmit)}>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && !loading && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                            {success}
                        </div>
                    )}

                    <div className="p-2 flex flex-col gap-2">
                        <label htmlFor="password" className="block text-sm font-bold text-gray-700">Password</label>
                        <div className="flex items-center gap-2 relative">
                            <input type={viewPassword ? "text" : "password"} id="password" {...register("password")} className="w-full rounded-lg border-1 bg-white py-2 px-4 font-medium outline-none transition-all duration-200 focus:shadow-md" />
                            <Image src={viewPassword ? eye : eyeSlash} alt="eye" className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2" onClick={() => setViewPassword(!viewPassword)} />
                        </div>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <div className="p-2 flex flex-col gap-2">
                        <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700">Confirm Password</label>
                        <div className="flex items-center gap-2 relative">
                            <input type={viewConfirmPassword ? "text" : "password"} id="confirmPassword" {...register("confirmPassword")} className="w-full rounded-lg border-1 bg-white py-2 px-4 font-medium outline-none transition-all duration-200 focus:shadow-md" />
                            <Image src={viewConfirmPassword ? eye : eyeSlash} alt="eye" className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2" onClick={() => setViewConfirmPassword(!viewConfirmPassword)} />
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" disabled={isSubmitting} className=" rounded-lg bg-blue-500 mt-4
                     text-white p-2 font-medium outline-none transition-all 
                     duration-200 focus:shadow-md cursor-pointer">{isSubmitting ? "Updating Password..." : "Update Password"}</button>

                    </div>
                </form>
            </div>


        </>
    )
}


export default page