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
        let cancelled = false;

        setIsLoading(true); // eslint-disable-line react-hooks/set-state-in-effect
        setError(null); // eslint-disable-line react-hooks/set-state-in-effect

        apiClient
            .get('/quizzes', {
                params: {
                    page,
                    search: search || undefined,
                    category: category || undefined,
                    difficulty: difficulty || undefined,
                },
            })
            .then((res) => { if (!cancelled) setData(res.data); })
            .catch(() => { if (!cancelled) setError('Impossible de charger les quiz.'); })
            .finally(() => { if (!cancelled) setIsLoading(false); });

        return () => { cancelled = true; };
    }, [page, search, category, difficulty, trigger]);

    return {
        data,
        isLoading,
        error,
        refetch: () => setTrigger((t) => t + 1),
    };
}