"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { categorySchema, CategorySubmitData, updateCategorySchema, UpdateCategorySubmitData } from '../validation/category';
import { useForm } from 'react-hook-form';
import { TransactionSubmitData, UpdateTransactionSubmitData } from '../validation/transaction';

type Category = {
    id: number | null;
    name: string;
    description: string | null;
    image: string;
    status: boolean;
    type: "INCOME" | "EXPENSE" | "SAVINGS";
};
interface CreateCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (categoryData: CategorySubmitData) => Promise<void>;
    onUpdate: (categoryData: UpdateCategorySubmitData) => Promise<void>;
    modelName: string;
    categoryData: Category | null;
}

const CategoryModal: React.FC<CreateCategoryModalProps> = ({ isOpen, onClose, onSubmit: onSubmitProp, onUpdate: onUpdateProp, modelName, categoryData }) => {
    const isEditMode = !!categoryData;

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(isEditMode ? updateCategorySchema : categorySchema),
        mode: "onSubmit",
        
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (categoryData) {
            const formData = {
                id: categoryData.id?.toString() || "",
                name: categoryData.name,
                description: categoryData.description || "",
                image: categoryData.image,
                status: categoryData.status || true,
                type: categoryData.type as "INCOME" | "EXPENSE" | "SAVINGS"
            };
            reset(formData);
        } else {
            const formData = {
                id: "",
                name: "",
                description: "",
                image: "",
                status: true,
                type: "INCOME" as "INCOME" | "EXPENSE" | "SAVINGS"
            }
            reset(formData);
        }
    }, [categoryData, reset]);

    const onSubmit = async (data: CategorySubmitData | UpdateCategorySubmitData) => {
        setLoading(true);
        setError(null);
        try {
            if (categoryData) {
                await onUpdateProp(data as UpdateCategorySubmitData);
            } else {
                await onSubmitProp(data as CategorySubmitData);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div className='space-y-2'>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter category name"
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter category description"
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                            Type *
                        </label>
                        <select
                            id="type"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            {...register("type")}
                        >
                            <option value="INCOME">Income</option>
                            <option value="EXPENSE">Expense</option>
                            <option value="SAVINGS">Savings</option>
                        </select>
                        {errors.type && (
                            <p className="text-sm text-red-600">
                                {errors.type.message}
                            </p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                            Image URL
                        </label>
                        <input
                            type="text"
                            id="image"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/image.jpg"
                            {...register("image")}
                        />
                    </div>

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
};

export default CategoryModal;
