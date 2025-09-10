"use client";

import { getDashboardDataApi } from "../api/dashboardApi";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

interface DashboardData {
    income: any[];
    expense: any[];
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
    period: string;
    dateRange?: {
        startDate: string;
        endDate: string;
    };
}

export default function Dashboard() {
    const { user, loading } = useAuth();
    const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today');
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // const getDashboardData = async () => {
    //     setIsLoading(true);
    //     try {
    //         const response = await getDashboardDataApi(selectedPeriod);
            
    //         setDashboardData(response.data);
    //     } catch (error) {
    //         console.error('Error fetching dashboard data:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    // useEffect(() => {
    //     getDashboardData();
    // }, [selectedPeriod]);

    const handlePeriodChange = (period: 'today' | 'week' | 'month' | 'year') => {
        setSelectedPeriod(period);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading || isLoading) {
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {[
                    { key: 'today', label: 'TODAY' },
                    { key: 'week', label: 'THIS WEEK' },
                    { key: 'month', label: 'THIS MONTH' },
                    { key: 'year', label: 'THIS YEAR' }
                ].map(({ key, label }) => (
                    <div
                        key={key}
                        className={`flex items-center justify-center py-4 rounded-lg shadow-md border text-center font-bold cursor-pointer transition-colors ${selectedPeriod === key
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-900 hover:bg-blue-100'
                            }`}
                        onClick={() => handlePeriodChange(key as 'today' | 'week' | 'month' | 'year')}
                    >
                        <span>{label}</span>
                    </div>
                ))}
            </div>

            {dashboardData && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Total Balance
                            </h3>
                            <p className={`text-3xl font-bold ${dashboardData.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(dashboardData.balance)}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {dashboardData.balance >= 0 ? 'Positive balance' : 'Negative balance'}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Total Income
                            </h3>
                            <p className="text-3xl font-bold text-green-600">
                                {formatCurrency(dashboardData.totalIncome)}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {dashboardData.income.length} transactions
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Total Expenses
                            </h3>
                            <p className="text-3xl font-bold text-red-600">
                                {formatCurrency(dashboardData.totalExpense)}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {dashboardData.expense.length} transactions
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Income Transactions */}
                        <div className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Income Transactions
                            </h3>
                            {dashboardData.income.length > 0 ? (
                                <div className="space-y-3">
                                    {dashboardData.income.slice(0, 5).map((transaction) => (
                                        <div key={transaction.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{transaction.category?.name}</p>
                                                <p className="text-sm text-gray-600">{transaction.description}</p>
                                                <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                                            </div>
                                            <p className="font-bold text-green-600">
                                                +{formatCurrency(parseFloat(transaction.amount))}
                                            </p>
                                        </div>
                                    ))}
                                    {dashboardData.income.length > 5 && (
                                        <p className="text-sm text-gray-500 text-center">
                                            And {dashboardData.income.length - 5} more...
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No income transactions</p>
                                </div>
                            )}
                        </div>

                        {/* Expense Transactions */}
                        <div className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Expense Transactions
                            </h3>
                            {dashboardData.expense.length > 0 ? (
                                <div className="space-y-3">
                                    {dashboardData.expense.slice(0, 5).map((transaction) => (
                                        <div key={transaction.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{transaction.category?.name}</p>
                                                <p className="text-sm text-gray-600">{transaction.description}</p>
                                                <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                                            </div>
                                            <p className="font-bold text-red-600">
                                                -{formatCurrency(parseFloat(transaction.amount))}
                                            </p>
                                        </div>
                                    ))}
                                    {dashboardData.expense.length > 5 && (
                                        <p className="text-sm text-gray-500 text-center">
                                            And {dashboardData.expense.length - 5} more...
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No expense transactions</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Period Information */}
                    <div className="mt-6 bg-white p-4 rounded-lg shadow-md border">
                        <p className="text-sm text-gray-600 text-center">
                            Showing data for: <span className="font-semibold capitalize">{dashboardData.period}</span>
                            {dashboardData.dateRange && (
                                <span> ({formatDate(dashboardData.dateRange.startDate)} - {formatDate(dashboardData.dateRange.endDate)})</span>
                            )}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
