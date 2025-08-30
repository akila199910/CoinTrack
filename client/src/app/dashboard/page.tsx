"use client";

import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Welcome to Coin Tracker Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Total Balance
                    </h3>
                    <p className="text-3xl font-bold text-green-600">$0.00</p>
                    <p className="text-sm text-gray-500 mt-1">No transactions yet</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        This Month
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">$0.00</p>
                    <p className="text-sm text-gray-500 mt-1">No activity</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Total Transactions
                    </h3>
                    <p className="text-3xl font-bold text-purple-600">0</p>
                    <p className="text-sm text-gray-500 mt-1">Start tracking your coins</p>
                </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Activity
                </h3>
                <div className="text-center py-8 text-gray-500">
                    <p>No recent transactions</p>
                    <p className="text-sm mt-1">Start adding your coin transactions to see them here</p>
                </div>
            </div>
        </div>
    );
}
