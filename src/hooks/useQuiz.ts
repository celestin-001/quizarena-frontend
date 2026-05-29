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

        // Utilise un flag pour éviter l'appel synchrone
        let cancelled = false;

        setIsLoading(true); // eslint-disable-line react-hooks/set-state-in-effect
        setError(null); 

        apiClient
            .get(`/quizzes/${id}`)
            .then((res) => { if (!cancelled) setQuiz(res.data); })
            .catch(() => { if (!cancelled) setError('Impossible de charger le quiz.'); })
            .finally(() => { if (!cancelled) setIsLoading(false); });

        return () => { cancelled = true; };
    }, [id, trigger]);

    return {
        quiz,
        isLoading,
        error,
        refetch: () => setTrigger((t) => t + 1),
    };
}