import apiClient from './axios';
import type { Question } from '../types';

export interface CreateQuestionPayload {
    text: string;
    options: string[];
    correctIndex: number;
    points?: number;
}

export async function createQuestion(
    quizId: string,
    payload: CreateQuestionPayload,
): Promise<Question> {
    const { data } = await apiClient.post<Question>(
        `/quizzes/${quizId}/questions`,
        payload,
    );
    return data;
}

export async function deleteQuestion(id: string): Promise<void> {
    await apiClient.delete(`/questions/${id}`);
}