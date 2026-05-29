import apiClient from './axios';
import type { Quiz } from '../types';

export interface CreateQuizPayload {
    title: string;
    description?: string;
    category: string;
    difficulty: string;
}

export interface UpdateQuizPayload {
    title?: string;
    description?: string;
    category?: string;
    difficulty?: string;
}

export async function createQuiz(payload: CreateQuizPayload): Promise<Quiz> {
    const { data } = await apiClient.post<Quiz>('/quizzes', payload);
    return data;
}

export async function deleteQuiz(id: string): Promise<void> {
    await apiClient.delete(`/quizzes/${id}`);
}

export interface ImportQuizPayload {
    title: string;
    amount?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    categoryId?: number;
}

export async function importQuiz(payload: ImportQuizPayload): Promise<Quiz> {
    const { data } = await apiClient.post<Quiz>('/trivia/import', payload);
    return data;
}

export interface TriviaCategory {
    id: number;
    name: string;
}

export async function getTriviaCategories(): Promise<TriviaCategory[]> {
    const { data } = await apiClient.get<TriviaCategory[]>('/trivia/categories');
    return data;
}

export async function updateQuiz(
    id: string,
    payload: UpdateQuizPayload,
): Promise<Quiz> {
    const { data } = await apiClient.put<Quiz>(`/quizzes/${id}`, payload);
    return data;
}