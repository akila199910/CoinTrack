"use client";

import { getDashboardDataApi } from "../api/dashboardApi";
import DoughnutChart from "../components/DoughnutChart";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";

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

function makeColors(n: number) {
    const base = [
        '#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236',
        '#166a8f', '#00a950', '#58595b', '#8549ba', '#e8c3b9',
        '#36a2eb', '#ffcd56', '#ff6384', '#9966ff', '#c9cbcf'
    ];
    return Array.from({ length: n }, (_, i) => base[i % base.length]);
}
export default function Dashboard() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(false);
    const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState<string | null>(null);
    const getDashboardData = async (fromDate?: string, toDate?: string) => {

        const response = await getDashboardDataApi(fromDate, toDate);
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
        getDashboardData(fromDate, toDate);
    }, [fromDate, toDate]);


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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Budget Tracker Dashboard
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-md border mb-6 md:max-w-3xl md:mx-auto">
                <div className="flex flex-col justify-center bg-blue-100 border border-blue-200 rounded-lg p-2 mb-4">
                    <span className="text-3xl font-bold flex text-gray-900 justify-center">Time Period</span>
                    <h3 className="text-lg font-semibold text-blue-900 text-center   ">From {fromDate} to {toDate}</h3>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center max-w-3xl">
                    <div className="flex flex-col w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            min={fromDate}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {dashboardData && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 mb-6 sm:items-center">
                        <div className="bg-white p-6 rounded-lg shadow-md border sm:col-span-3">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Total Income
                            </h3>
                            <p className="text-3xl font-bold text-green-600">
                                {dashboardData.totalIncome}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {dashboardData.income.length} transactions
                            </p>
                        </div>
                        <span className="text-3xl font-bold flex text-gray-900 justify-center sm:col-span-1">-</span>
                        <div className="bg-white p-6 rounded-lg shadow-md border sm:col-span-3">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Total Expenses
                            </h3>
                            <p className="text-3xl font-bold text-red-600">
                                {dashboardData.totalExpense}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {dashboardData.expense.length} transactions
                            </p>
                        </div>

                        <span className="text-3xl font-bold flex text-gray-900 justify-center sm:col-span-1">=</span>

                        <div className="bg-white p-6 rounded-lg shadow-md border sm:col-span-3">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Balance
                            </h3>
                            <p className={`text-3xl font-bold ${dashboardData.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {dashboardData.balance}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {dashboardData.balance >= 0 ? 'Positive balance' : 'Negative balance'}
                            </p>
                        </div>

                    </div>

                    <div className="flex justify-center mb-3">
                        <Link href="/transactions" className="bg-green-600 text-white px-4 py-2 rounded-md font-bold hover:bg-green-700 cursor-pointer"><span className="text-white text-xl font-bold">+</span> Add</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="rounded-xl border py-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4  text-center"> Income </h3>
                            <DoughnutChart labels={dashboardData.income.map(i => i.income_name)} values={dashboardData.income.map(i => i.total_amount)} />

                            <div className="mt-6 gap-2 space-y-2">
                                {dashboardData.income.map((i, index) => (
                                    <div key={i.income_id} className="grid grid-cols-9 items-center">
                                        <div className="col-span-2 text-sm font-medium"></div>
                                        <div className="col-span-2 text-sm font-medium">{i.income_name}</div>
                                        <div className="col-span-2 text-sm font-medium">{i.total_amount}</div>
                                        <div className="col-span-1 text-sm font-medium">
                                            {((i.total_amount / dashboardData.totalIncome) * 100).toFixed(0)} <span className="text-sm font-medium text-black">%</span>
                                        </div>
                                        <div className="col-span-2 text-sm font-medium"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-xl border py-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4  text-center"> Expenses </h3>
                            <DoughnutChart labels={dashboardData.expense.map(e => e.expense_name)} values={dashboardData.expense.map(e => e.total_amount)} />
                            <div className="mt-6 gap-2 space-y-2">
                                {dashboardData.expense.map((e, index) => (
                                    <div key={e.expense_id} className="grid grid-cols-9 items-center">
                                        <div className="col-span-2 text-sm font-medium"></div>
                                        <div className="col-span-2 text-sm font-medium">{e.expense_name}</div>
                                        <div className="col-span-2 text-sm font-medium">{e.total_amount}</div>
                                        <div className="col-span-1 text-sm font-medium">
                                            {((e.total_amount / dashboardData.totalExpense) * 100).toFixed(0)} <span className="text-sm font-medium text-black">%</span>
                                        </div>
                                        <div className="col-span-2 text-sm font-medium"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Income Transactions */}
                        {/* <div className="bg-white p-6 rounded-lg shadow-md border">
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
                                                +{parseFloat(transaction.amount)}
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
                        </div> */}

                        {/* Expense Transactions */}
                        {/* <div className="bg-white p-6 rounded-lg shadow-md border">
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
                                                -{parseFloat(transaction.amount)}
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
                        </div> */}
                    </div>
                </>
            )}
        </div>
    );
}
