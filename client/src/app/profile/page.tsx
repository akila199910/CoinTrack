"use client";

import { useEffect, useState } from "react";
import { getProfile } from "../api/profileApi";
import { useAuth } from "../context/AuthContext";
const ProfilePage = () => {
    const [profileData, setProfileData] = useState<any>(null);

    const { logout } = useAuth();


    const getProfileData = async () => {
        const response = await getProfile();
        setProfileData(response.data);
        console.log(response);
    }

    useEffect(() => {
        getProfileData();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Profile
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        {/* <p className="mt-1 text-lg text-gray-900">{profileData.firstName || 'Not provided'}</p> */}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        {/* <p className="mt-1 text-lg text-gray-900">{profileData.email || 'Not provided'}</p> */}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        {/* <p className="mt-1 text-lg text-gray-900">{profileData.role}</p> */}
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={logout}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;