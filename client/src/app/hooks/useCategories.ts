import { useState, useEffect } from 'react';
import { getCategoriesApi } from '../api/categoryApi';

export type Category = {
    id: number;
    name: string;
    description: string;
    status: boolean;
    type: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
};

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCategoriesApi();
            setCategories(response.data.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        categories,
        loading,
        error,
        refetch: fetchCategories
    };
};
