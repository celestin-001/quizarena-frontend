import { useEffect, useState } from 'react';
import apiClient from '../api/axios';
import type { Quiz, PaginatedResponse } from '../types';

interface UseQuizzesParams {
    page?: number;
    search?: string;
    category?: string;
    difficulty?: string;
}

interface UseQuizzesResult {
    data: PaginatedResponse<Quiz> | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useQuizzes({
                               page = 1,
                               search = '',
                               category = '',
                               difficulty = '',
                           }: UseQuizzesParams = {}): UseQuizzesResult {
    const [data, setData] = useState<PaginatedResponse<Quiz> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        apiClient
            .get('/quizzes', {
                params: {
                    page,
                    search: search || undefined,
                    category: category || undefined,
                    difficulty: difficulty || undefined,
                },
            })
            .then((res) => setData(res.data))
            .catch(() => setError('Impossible de charger les quiz.'))
            .finally(() => setIsLoading(false));
    }, [page, search, category, difficulty, trigger]);

    return {
        data,
        isLoading,
        error,
        refetch: () => setTrigger((t) => t + 1),
    };
}