import apiClient from './axios';

export interface SubmitGamePayload {
  quizId: string;
  score: number;
  totalPoints: number;
  answers: {
    questionId: string;
    selectedIndex: number;
    correct: boolean;
  }[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  totalScore: number;
  gamesPlayed: number;
  avgPercent: number;
}

export async function submitGame(payload: SubmitGamePayload): Promise<void> {
  await apiClient.post('/games', payload);
}