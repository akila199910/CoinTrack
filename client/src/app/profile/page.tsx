"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProfile, updateProfile, updateAvatar, updateCover } from "../api/profileApi";
import { profileUpdateSchema, type ProfileUpdateData } from "../validation/profile";
import { useAuth } from "../context/AuthContext";
import CoverOne from "../icons/cover.jpeg";
import Image from "next/image";
import Camera from "../icons/camera.svg";
import loaderImage from "../animation/loader.svg";
import userImage from "../icons/user.jpeg";
const ProfilePage = () => {
    const [profileData, setProfileData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState<string>("");
    const [updateSuccess, setUpdateSuccess] = useState<string>("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<ProfileUpdateData>({
        resolver: zodResolver(profileUpdateSchema),
        mode: "onSubmit",
    });

    const getProfileData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getProfile();
            const data = response.data.data;
            setProfileData(data);

            setValue("firstName", data.firstName || "");
            setValue("lastName", data.lastName || "");
            setValue("email", data.email || "");
            setValue("contactNumber", data.contactNumber || "");
            setTimeout(() => {
                setLoading(false);
            }, 2000);
            setError(null);
        } catch (err) {
            setError("Failed to load profile data");
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    }

    const onSubmit = async (data: ProfileUpdateData) => {
        setUpdateLoading(true);
        setUpdateError("");
        setUpdateSuccess("");

        try {
            const response = await updateProfile(data);
            if (response.status === 200 || response.status === 201) {
                setUpdateSuccess("Profile updated successfully!");

                await getProfileData();
            } else {
                if (response.data && response.data.message) {
                    setUpdateError(response.data.message);
                } else if (response.data && response.data.errors) {
                    const errorMessages = Object.values(response.data.errors).flat();
                    setUpdateError(errorMessages.join(", "));
                } else {
                    setUpdateError("Update failed. Please try again.");
                }
            }
        } catch (err) {
            setUpdateError("Network error. Please check your connection.");
            console.error("Profile update error:", err);
        } finally {
            setTimeout(() => {
                setUpdateLoading(false);
            }, 2000);
        }
    };

    const handleImageUpload = async (file: File, type: 'avatar' | 'cover') => {
        setLoading(true);
        setUpdateError("");
        setUpdateSuccess("");

        try {
            let response;
            if (type === 'avatar') {
                response = await updateAvatar(file);
            } else {
                response = await updateCover(file);
            }

            if (response.status === 200) {
                setUpdateSuccess(`${type === 'avatar' ? 'Avatar' : 'Cover image'} updated successfully!`);
                await getProfileData();

            } else {
                setUpdateError(`Failed to update ${type}. Please try again.`);
            }
        } catch (err) {
            setUpdateError(`Failed to update ${type}. Please check your connection.`);
            console.error(`${type} update error:`, err);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
        const file = event.target.files?.[0];
        if (file) {

            if (!file.type.startsWith('image/')) {
                setUpdateError('Please select an image file.');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setUpdateError('File size must be less than 5MB.');
                return;
            }

            handleImageUpload(file, type);
        }
    };

    useEffect(() => {
        getProfileData();
    }, []);

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error loading profile</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (

        <>
            {loading ? (
                <div className="p-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading profile...</p>
                        </div>
                    </div>
                </div>
            ) :
                <div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center uppercase">
                        My Profile
                    </h1 >

                    <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default md:max-w-3xl mx-auto">
                        <div className="relative z-20 h-35 md:h-65">
                            <Image
                                src={profileData.profile?.coverUrl === 'cover.jpg' ? CoverOne : `http://localhost:4000/uploads/${profileData.profile?.coverUrl}`}
                                alt="profile cover"
                                className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
                                width={800}
                                height={400}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = CoverOne.src;
                                }}
                            />
                            <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
                                <label
                                    htmlFor="cover"
                                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-2 px-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 xsm:px-4}`}
                                >
                                    <input
                                        type="file"
                                        name="cover"
                                        id="cover"
                                        className="sr-only"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'cover')}

                                    />
                                    <span className="bg-white/20 rounded-full p-1">
                                        <Image src={Camera} alt="edit" className="w-5 h-5" />
                                    </span>
                                    <span>Edit Cover</span>
                                </label>
                            </div>
                        </div>
                        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                            <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                                <div className="relative flex items-center justify-center h-full w-full">
                                    <Image
                                        src={profileData.profile?.avatarUrl === 'user.png' ? userImage : `http://localhost:4000/uploads/${profileData.profile?.avatarUrl}`}
                                        alt="profile avatar"
                                        className="w-full h-full rounded-full object-cover object-center"
                                        width={176}
                                        height={176}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = userImage.src;
                                        }}
                                    />
                                    <div className="drop-shadow-2 absolute bottom-0 right-0">

                                        <label
                                            htmlFor="profile"
                                            className={`absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 sm:bottom-2 sm:right-2}`}
                                        >

                                            <input
                                                type="file"
                                                name="profile"
                                                id="profile"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, 'avatar')}

                                            />
                                            <span className="bg-white/20 rounded-full p-1">
                                                <Image src={Camera}
                                                    alt="edit" className="w-5 h-5" />
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="mb-1.5 text-2xl font-semibold text-black">
                                    {profileData.firstName || ''} {profileData.lastName || ''}
                                </h3>
                                <p className="font-medium">{profileData.profile?.title || "Software Engineer"}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-9">

                            <div className="rounded-lg border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">

                                <form onSubmit={handleSubmit(onSubmit)} className="md:max-w-3xl mx-auto px-4" noValidate>
                                    <div className="p-8">
                                        {/* Error Message */}
                                        {updateError && (
                                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-sm">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    <p className="font-medium">{updateError}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Success Message */}
                                        {updateSuccess && (
                                            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg shadow-sm">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <p className="font-medium">{updateSuccess}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mb-6 flex flex-col gap-6 xl:flex-row">
                                            <div className="w-full xl:w-1/2">
                                                <label className="mb-3 block text-sm font-semibold text-gray-700">
                                                    First name
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter your first name"
                                                    className={`w-full rounded-lg border-2 bg-white py-3.5 px-4 font-medium outline-none transition-all duration-200 focus:border-blue-500 focus:shadow-md ${errors.firstName ? 'border-red-400 focus:border-red-500' : 'border-gray-300 hover:border-gray-400'}`}
                                                    {...register("firstName")}
                                                />
                                                {errors.firstName && (
                                                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        {errors.firstName.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="w-full xl:w-1/2">
                                                <label className="mb-3 block text-sm font-semibold text-gray-700">
                                                    Last name
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter your last name"
                                                    className={`w-full rounded-lg border-2 bg-white py-3.5 px-4 font-medium outline-none transition-all duration-200 focus:border-blue-500 focus:shadow-md ${errors.lastName ? 'border-red-400 focus:border-red-500' : 'border-gray-300 hover:border-gray-400'}`}
                                                    {...register("lastName")}
                                                />
                                                {errors.lastName && (
                                                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        {errors.lastName.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label className="mb-3 block text-sm font-semibold text-gray-700">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="Enter your email address"
                                                className={`w-full rounded-lg border-2 bg-white py-3.5 px-4 font-medium outline-none transition-all duration-200 focus:border-blue-500 focus:shadow-md ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-300 hover:border-gray-400'}`}
                                                {...register("email")}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.email.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mb-6">
                                            <label className="mb-3 block text-sm font-semibold text-gray-700">
                                                Contact Number
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="071 123 4567"
                                                className={`w-full rounded-lg border-2 bg-white py-3.5 px-4 font-medium outline-none transition-all duration-200 focus:border-blue-500 focus:shadow-md ${errors.contactNumber ? 'border-red-400 focus:border-red-500' : 'border-gray-300 hover:border-gray-400'}`}
                                                {...register("contactNumber")}
                                            />
                                            {errors.contactNumber && (
                                                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.contactNumber.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* <div className="mb-8 flex flex-col gap-6 xl:flex-row">
                                            <div className="w-full xl:w-1/2">
                                                <label className="mb-3 block text-sm font-semibold text-gray-700">
                                                    Password <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                                                </label>
                                                <input
                                                    type="password"
                                                    placeholder="Leave blank to keep current password"
                                                    className={`w-full rounded-lg border-2 bg-white py-3.5 px-4 font-medium outline-none transition-all duration-200 focus:border-blue-500 focus:shadow-md ${errors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-300 hover:border-gray-400'}`}
                                                    {...register("password")}
                                                />
                                                {errors.password && (
                                                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        {errors.password.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="w-full xl:w-1/2">
                                                <label className="mb-3 block text-sm font-semibold text-gray-700">
                                                    Confirm Password <span className="text-gray-500 text-xs font-normal">(Required if password is provided)</span>
                                                </label>
                                                <input
                                                    type="password"
                                                    placeholder="Confirm new password"
                                                    className={`w-full rounded-lg border-2 bg-white py-3.5 px-4 font-medium outline-none transition-all duration-200 focus:border-blue-500 focus:shadow-md ${errors.confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-gray-300 hover:border-gray-400'}`}
                                                    {...register("confirmPassword")}
                                                />
                                                {errors.confirmPassword && (
                                                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        {errors.confirmPassword.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div> */}

                                        <button
                                            type="submit"
                                            disabled={isSubmitting || updateLoading}
                                            className="flex w-full justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-4 font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
                                        >
                                            {updateLoading ? (
                                                <div className="flex items-center gap-3">
                                                    <Image src={loaderImage} alt="loader" width={20} height={20} className="animate-spin" />
                                                    <span>Updating Profile...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">

                                                    <span>Update Profile</span>
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div >
            }

        </>

    );
}

export default ProfilePage;