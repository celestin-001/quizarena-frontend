import { useEffect, useState } from 'react';
import apiClient from '../api/axios';
import type { LeaderboardEntry } from '../api/game.api';

interface UseLeaderboardResult {
  data: LeaderboardEntry[] | null;
  isLoading: boolean;
  error: string | null;
}

export function useLeaderboard(): UseLeaderboardResult {
  const [data, setData] = useState<LeaderboardEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get('/games/leaderboard')
      .then((res) => setData(res.data))
      .catch(() => setError('Impossible de charger le classement.'))
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading, error };
}