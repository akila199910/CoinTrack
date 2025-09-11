"use client";

import { getDashboardDataApi } from "../api/dashboardApi";
import DoughnutChart from "../components/DoughnutChart";
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
    const { user } = useAuth();
    const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('today');
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(false);
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [error, setError] = useState<string | null>(null);
    const getDashboardData = async (period?: string, startDate?: string, endDate?: string) => {

        const response = await getDashboardDataApi(period, startDate, endDate);
        setLoading(true);
        try {
            setDashboardData(response.data.data);
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setTimeout(() => {
                setLoading(false);
            }, 2000);

        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    }

    useEffect(() => {
        if (selectedPeriod === 'custom' && customStartDate && customEndDate) {
            getDashboardData('custom', customStartDate, customEndDate);
        } else if (selectedPeriod !== 'custom') {
            getDashboardData(selectedPeriod);
        }
    }, [selectedPeriod, customStartDate, customEndDate]);

    const handlePeriodChange = (period: 'today' | 'week' | 'month' | 'year' | 'custom') => {
        setSelectedPeriod(period);
    };

    const handleCustomDateSubmit = () => {
        if (customStartDate && customEndDate) {
            getDashboardData('custom', customStartDate, customEndDate);
        } else {
            setError('Please select a date range');
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading dashboard...</p>
                    </div>
                </div>
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

            {/* Predefined Period Buttons */}
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

            {/* Custom Date Range Section */}
            <div className="bg-white p-6 rounded-lg shadow-md border mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Date Range</h3>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePeriodChange('custom')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${selectedPeriod === 'custom'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Apply Custom Range
                        </button>
                        <button
                            onClick={handleCustomDateSubmit}
                            disabled={!customStartDate || !customEndDate}
                            className="px-4 py-2 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>

            {dashboardData && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Total Balance
                            </h3>
                            <p className={`text-3xl font-bold ${dashboardData.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {dashboardData.balance}
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
                                {dashboardData.totalIncome}
                            </p>
                            {/* <p className="text-sm text-gray-500 mt-1">
                                {dashboardData.income.length} transactions
                            </p> */}
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Total Expenses
                            </h3>
                            <p className="text-3xl font-bold text-red-600">
                                {dashboardData.totalExpense}
                            </p>
                            {/* <p className="text-sm text-gray-500 mt-1">
                                {dashboardData.expense.length} transactions
                            </p> */}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="rounded-xl border py-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase text-center">Your Income Chart</h3>
                            <DoughnutChart labels={dashboardData.income.map(i => i.income_name)} values={dashboardData.income.map(i => i.total_amount)} />
                        </div>
                        <div className="rounded-xl border py-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase text-center">Your Expense Chart</h3>
                            <DoughnutChart labels={dashboardData.expense.map(e => e.expense_name)} values={dashboardData.expense.map(e => e.total_amount)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Income Transactions */}
                        <div className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Income Transactions
                            </h3>
                            {/* {dashboardData.income.length > 0 ? (
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
                            )} */}
                        </div>

                        {/* Expense Transactions */}
                        <div className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Expense Transactions
                            </h3>
                            {/* {dashboardData.expense.length > 0 ? (
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
                            )} */}
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
