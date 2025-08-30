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
    const [imageLoading, setImageLoading] = useState(false);

    const { logout } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<ProfileUpdateData>({
        resolver: zodResolver(profileUpdateSchema),
        mode: "onSubmit",
    });

    const password = watch("password");

    const getProfileData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getProfile();
            const data = response.data.data;
            setProfileData(data);

            setValue("firstName", data.firstName || "");
            setValue("lastName", data.lastName || "");
            setValue("email", data.email || "");
            setValue("contactNumber", data.contactNumber || "");

        } catch (err) {
            setError("Failed to load profile data");
        } finally {
            setLoading(false);
        }
    }

    const onSubmit = async (data: ProfileUpdateData) => {
        setUpdateLoading(true);
        setUpdateError("");
        setUpdateSuccess("");

        try {

            const { confirmPassword, ...updateData } = data;

            const response = await updateProfile(updateData);

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
            setUpdateLoading(false);
        }
    };

    const handleImageUpload = async (file: File, type: 'avatar' | 'cover') => {
        setImageLoading(true);
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
            setImageLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Image src={loaderImage} alt="loader" width={100} height={100} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-600 text-lg">{error}</div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center uppercase">
                My Profile
            </h1>

            <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default md:max-w-3xl mx-auto">
                <div className="relative z-20 h-35 md:h-65">

                    <Image
                        src={CoverOne}
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
                            className={`flex cursor-pointer items-center justify-center gap-2 rounded bg-primary py-1 px-2 text-sm font-medium text-white hover:bg-opacity-80 xsm:px-4 ${imageLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <input
                                type="file"
                                name="cover"
                                id="cover"
                                className="sr-only"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'cover')}
                                disabled={imageLoading}
                            />
                            <span className="bg-blue-500 rounded-full p-1">
                                <Image src={Camera} alt="edit" className="w-6 h-6" />
                            </span>
                            <span>{imageLoading ? 'Uploading...' : 'Edit'}</span>
                        </label>
                    </div>
                </div>
                <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                    <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                        <div className="relative">
                            <Image
                                src={profileData.profile?.avatarUrl == 'user.png' ? userImage : `http://localhost:4000/uploads/${profileData.profile.avatarUrl}`}
                                alt="profile avatar"
                                className="w-full h-full rounded-full object-cover"
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
                                    className={`absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2 ${imageLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >

                                    <input
                                        type="file"
                                        name="profile"
                                        id="profile"
                                        className="sr-only"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'avatar')}
                                        disabled={imageLoading}
                                    />
                                    <span className="bg-blue-500 rounded-full p-1">
                                        <Image src={Camera} alt="edit" className="w-6 h-6" />
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="mb-1.5 text-2xl font-semibold text-black">
                            {profileData.firstName} {profileData.lastName}
                        </h3>
                        <p className="font-medium">{profileData.profile.title || "Software Engineer"}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-9">

                    <div className="rounded-sm border border-stroke bg-white shadow-default ">

                        <form onSubmit={handleSubmit(onSubmit)} className="md:max-w-3xl mx-auto px-4" noValidate>
                            <div className="p-6.5">
                                {/* Error Message */}
                                {updateError && (
                                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                        <p>{updateError}</p>
                                    </div>
                                )}

                                {/* Success Message */}
                                {updateSuccess && (
                                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                                        <p>{updateSuccess}</p>
                                    </div>
                                )}

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-2.5 block text-black">
                                            First name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter your first name"
                                            className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter ${errors.firstName ? 'border-red-500' : 'border-stroke'
                                                }`}
                                            {...register("firstName")}
                                        />
                                        {errors.firstName && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.firstName.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-2.5 block text-black">
                                            Last name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter your last name"
                                            className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter ${errors.lastName ? 'border-red-500' : 'border-stroke'
                                                }`}
                                            {...register("lastName")}
                                        />
                                        {errors.lastName && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.lastName.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black ">
                                        Email <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter ${errors.email ? 'border-red-500' : 'border-stroke'
                                            }`}
                                        {...register("email")}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black">
                                        Contact
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="071 123 4567"
                                        className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter ${errors.contactNumber ? 'border-red-500' : 'border-stroke'
                                            }`}
                                        {...register("contactNumber")}
                                    />
                                    {errors.contactNumber && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.contactNumber.message}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-2.5 block text-black">
                                            Password <span className="text-gray-500 text-sm">(Optional)</span>
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Leave blank to keep current password"
                                            className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter ${errors.password ? 'border-red-500' : 'border-stroke'
                                                }`}
                                            {...register("password")}
                                        />
                                        {errors.password && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.password.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-2.5 block text-black">
                                            Confirm Password <span className="text-gray-500 text-sm">(Required if password is provided)</span>
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Confirm new password"
                                            className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter ${errors.confirmPassword ? 'border-red-500' : 'border-stroke'
                                                }`}
                                            {...register("confirmPassword")}
                                        />
                                        {errors.confirmPassword && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.confirmPassword.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || updateLoading}
                                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {updateLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Image src={loaderImage} alt="loader" width={20} height={20} />
                                            Updating...
                                        </div>
                                    ) : (
                                        "Update Profile"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;