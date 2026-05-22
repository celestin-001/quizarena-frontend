export interface User {
    id: string;
    username: string;
    email: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Quiz {
    id: string;
    title: string;
    category: string;
    description?: string;
    difficulty: Difficulty;
    questionsCount: number;
    author: User;
    createdAt: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export interface Question {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
    points: number;
}

export interface GameAnswer {
    questionId: string;
    selectedIndex: number;
    correct: boolean;
    points: number;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}