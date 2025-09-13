"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema, TransactionSubmitData, updateTransactionSchema, UpdateTransactionSubmitData } from "../validation/transaction";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

type Category = {
    id: number;
    name: string;
    description: string;
    image: string;
    status: boolean;
    type: string;
}
type Transaction = {
    id: number;
    amount: string;
    date: string;
    description: string;
    status: boolean;
    category: Category;
}
interface TransactionModalProps {
    isOpen: boolean;
    categories: [{ id: number; name: string; }];
    onClose: () => void;
    onSubmit: (transactionData: TransactionSubmitData) => Promise<void>;
    onUpdate: (transactionData: UpdateTransactionSubmitData) => Promise<void>;
    modelName: string;
    transactionData: Transaction | null;
}
const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSubmit: onSubmitProp, onUpdate: onUpdateProp, categories, modelName, transactionData }) => {

    const isEditMode = !!transactionData;

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(isEditMode ? updateTransactionSchema : transactionSchema),
        mode: "onSubmit",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (transactionData) {
            const formData = {
                id: transactionData.id.toString(),
                amount: transactionData.amount,
                date: transactionData.date,
                description: transactionData.description || "",
                category_id: transactionData.category.id.toString(),
                status: "true"
            };
            reset(formData);
        } else {
            const formData = {
                amount: "",
                date: "",
                description: "",
                category_id: "",
                status: "true"
            };
            reset(formData);
        }
    }, [transactionData, reset]);

    const onSubmit = async (data: TransactionSubmitData | UpdateTransactionSubmitData) => {
        setLoading(true);
        setError(null);
        try {
            if (transactionData) {
                await onUpdateProp(data as UpdateTransactionSubmitData);
            } else {
                await onSubmitProp(data as TransactionSubmitData);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        handleSubmit(onSubmit)(e);
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-blue-200 bg-opacity-50 flex items-center justify-center z-9999">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl/30">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{modelName}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form key={isEditMode ? 'edit' : 'create'} onSubmit={handleFormSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div className='space-y-2'>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                            Transaction Amount *
                        </label>
                        <input
                            type="text"
                            id="amount"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter transaction amount"
                            {...register("amount")}

                        />
                        {errors.amount && (
                            <p className="text-sm text-red-600">
                                {errors.amount.message}
                            </p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            Transaction Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter transaction date"
                            {...register("date")}
                        />
                        {errors.date && (
                            <p className="text-sm text-red-600">
                                {errors.date.message}
                            </p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <input
                            type="text"
                            id="description"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter transaction description"
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                            Select Category *
                        </label>
                        <select
                            id="category_id"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            {...register("category_id")}
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && (
                            <p className="text-sm text-red-600">
                                {errors.category_id.message}
                            </p>
                        )}
                    </div>

                    <input type="hidden" {...register("status")} value="true" />
                    {transactionData && <input type="hidden" {...register("id")} />}

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading || isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg"
                        >
                            {loading || isSubmitting ? 'Creating...' : modelName}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TransactionModal;
