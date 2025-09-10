"use client";
import React, { useState, useEffect } from 'react'
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { getCategoriesApi, createCategoryApi } from '../api/categoryApi';
import CategoryModal from '../components/CategoryModal';
import { CategorySubmitData } from '../validation/category';
import DataTable from '../components/DataTable';

// Helper function to validate URLs
const isValidUrl = (string: string): boolean => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

type Category = {
    id: number;
    name: string;
    description: string | null;
    image: string;
    status: boolean;
    type: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
};

const categoriesColumns: ColumnDef<Category>[] = [
    {
        id: "index",
        header: "#",
        cell: ({ row }) => (
            <span className="text-sm font-medium text-gray-500">
                {row.index + 1}
            </span>
        ),
        size: 60,
    },
    {
        id: "image",
        header: "Image",
        accessorKey: "image",
        cell: ({ row }) => (
            <div className="flex items-center">
                <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                    {row.original.image && isValidUrl(row.original.image) ? (
                        <Image
                            src={row.original.image}
                            alt={row.original.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gray-200">
                            <span className="text-gray-500 text-xs font-medium">
                                {row.original.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        ),
        size: 80,
    },
    {
        header: "Name",
        accessorKey: "name",
        cell: ({ getValue, row }) => (
            <div className="flex flex-col">
                <span className="font-medium text-gray-900 text-wrap max-w-40 truncate"
                    title={getValue() as string}
                >{getValue() as string}
                </span>

                <span className="text-xs text-gray-500"
                    title={row.original.description as string}
                >
                    {row.original.description ? row.original.description : "No description"}
                </span>
            </div>
        ),
        size: 100,
    },
    {
        header: "Type",
        accessorKey: "type",
        cell: ({ getValue }) => {
            const value = getValue() as string;
            const color =
                value == "INCOME"
                    ? "bg-blue-100 text-blue-700 border-green-200"
                    : "bg-yellow-100 text-yellow-700 border-red-200";
            return (
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium border ${color}`}>
                    {value}
                </span>
            );
        },
        size: 120,
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
            const value = getValue() as number;
            const color =
                value == 1
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-700 border-red-200";
            return (
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium border ${color}`}>
                    {value == 1 ? "Active" : "Inactive"}
                </span>
            );
        },
        size: 120,
    },
];

const Page = () => {
    const [categoriesData, setCategoriesData] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCategoriesApi();
            setCategoriesData(response.data.data);
            setTimeout(() => {
                setLoading(false);
            }, 2000);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const handleAddCategory = () => {
        setIsModalOpen(true);
    };

    const handleCreateCategory = async (categoryData: CategorySubmitData) => {
        setLoading(true);
        try {
            await createCategoryApi(categoryData);
            await getCategories();
            setIsModalOpen(false);
        } catch (err) {
            throw err;
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    };

    const handleEditCategory = (category: Category) => {

    };

    const handleDeleteCategory = (category: Category) => {
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading categories...</p>
                    </div>
                </div>
            </div>
        );
    }

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
                            <h3 className="text-sm font-medium text-red-800">Error loading categories</h3>
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
        <div className="p-2">
            <DataTable<Category>
                data={categoriesData}
                columns={categoriesColumns}
                title="Categories"
                searchPlaceholder="Search categories..."
                addButtonText="Add Category"
                onAdd={handleAddCategory}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                emptyStateTitle="No categories found"
                emptyStateDescription="Try adjusting your search criteria"
            />

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateCategory}
            />
        </div>
    )
}

export default Page