import { useLeaderboard } from '../hooks/useLeaderboard';
import { useTranslation } from 'react-i18next';
import Spinner from '../components/ui/Spinner';

const RANK_STYLES: Record<number, string> = {
  1: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  2: 'bg-gray-100 text-gray-600 border-gray-200',
  3: 'bg-orange-100 text-orange-600 border-orange-200',
};

const RANK_EMOJI: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

export default function LeaderboardPage() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useLeaderboard();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          {t('nav.leaderboard')}
        </h1>
        <p className="text-sm text-gray-500">
          Les meilleurs joueurs de QuizArena
        </p>
      </div>

      {isLoading && <Spinner />}

      {error && (
        <div className="text-center text-red-500 text-sm py-8 bg-red-50 border border-red-100 rounded-xl">
          {error}
        </div>
      )}

      {!isLoading && !error && data?.length === 0 && (
        <div className="text-center text-gray-400 text-sm py-16">
          Aucune partie jouée pour le moment. Sois le premier ! 🎯
        </div>
      )}

      {!isLoading && !error && data && data.length > 0 && (
        <div className="flex flex-col gap-2">
          {data.map((entry) => (
            <div
              key={entry.userId}
              className={`bg-white border rounded-xl px-5 py-4 flex items-center gap-4 ${
                entry.rank <= 3
                  ? 'border-indigo-100 shadow-sm'
                  : 'border-gray-100'
              }`}
            >
              
              <div
                className={`w-9 h-9 rounded-full border flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  RANK_STYLES[entry.rank] ?? 'bg-gray-50 text-gray-500 border-gray-200'
                }`}
              >
                {RANK_EMOJI[entry.rank] ?? entry.rank}
              </div>

              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {entry.username[0].toUpperCase()}
              </div>

              {/* Infos */}
              <div className="flex-1">
                <span className="text-sm font-semibold text-gray-900">
                  @{entry.username}
                </span>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-gray-400">
                    {entry.gamesPlayed} partie{entry.gamesPlayed > 1 ? 's' : ''}
                  </span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">
                    {entry.avgPercent}% de réussite
                  </span>
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="text-base font-bold text-indigo-600">
                  {entry.totalScore.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">pts</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}