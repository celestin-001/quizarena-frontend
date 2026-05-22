import { useEffect, useState } from 'react';
import apiClient from '../api/axios';
import type { Quiz, Question } from '../types';

type FullQuiz = Quiz & { questions: Question[] };

interface UseQuizResult {
    quiz: FullQuiz | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useQuiz(id: string): UseQuizResult {
    const [quiz, setQuiz] = useState<FullQuiz | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        if (!id) return;
        setIsLoading(true);
        setError(null);

        apiClient
            .get(`/quizzes/${id}`)
            .then((res) => setQuiz(res.data))
            .catch(() => setError('Impossible de charger le quiz.'))
            .finally(() => setIsLoading(false));
    }, [id, trigger]);

    return {
        quiz,
        isLoading,
        error,
        refetch: () => setTrigger((t) => t + 1),
    };
}