import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuizzes } from '../hooks/useQuizzes';
import DifficultyBadge from '../components/ui/DifficultyBadge';
import type { Difficulty } from '../types';

const CATEGORIES = ['Géographie', 'Histoire', 'Culture', 'Sciences'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const DIFFICULTY_LABELS: Record<string, string> = {
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
};

export default function QuizzesPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page') ?? '1');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('');

    const { data, isLoading, error } = useQuizzes({ page, search, category, difficulty });

    const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

    const goToPage = (p: number) => {
        setSearchParams({ page: String(p) });
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">

            {/* En-tête */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-medium text-gray-900">
                    {t('nav.quizzes')}
                </h1>
                <button
                    onClick={() => navigate('/quizzes/create')}
                    className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    + {t('quiz.create')}
                </button>
            </div>

            {/* Filtres */}
            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); goToPage(1); }}
                    placeholder="Rechercher un quiz..."
                    className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-300"
                />
                <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); goToPage(1); }}
                    className="text-sm px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 focus:outline-none"
                >
                    <option value="">Toutes catégories</option>
                    {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                <select
                    value={difficulty}
                    onChange={(e) => { setDifficulty(e.target.value); goToPage(1); }}
                    className="text-sm px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 focus:outline-none"
                >
                    <option value="">Toutes difficultés</option>
                    {DIFFICULTIES.map((d) => (
                        <option key={d} value={d}>{DIFFICULTY_LABELS[d]}</option>
                    ))}
                </select>
            </div>

            {/* Liste */}
            {isLoading && (
                <div className="text-center text-gray-400 text-sm py-8">Chargement...</div>
            )}

            {error && (
                <div className="text-center text-red-500 text-sm py-8">{error}</div>
            )}

            {!isLoading && !error && (
                <div className="flex flex-col gap-3">
                    {data?.data.map((quiz) => (
                        <div
                            key={quiz.id}
                            className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between"
                        >
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-900">{quiz.title}</span>
                                <span className="text-xs text-gray-400">
                  {quiz.questionsCount} questions · {quiz.category} · par @{quiz.author.username}
                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <DifficultyBadge difficulty={quiz.difficulty as Difficulty} />
                                <button
                                    onClick={() => navigate(`/quizzes/${quiz.id}`)}
                                    className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-100 transition"
                                >
                                    Jouer
                                </button>
                            </div>
                        </div>
                    ))}

                    {data?.data.length === 0 && (
                        <div className="text-center text-gray-400 text-sm py-8">
                            Aucun quiz trouvé.
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 1}
                        className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
                    >
                        ‹
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => goToPage(p)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm border transition ${
                                p === page
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        onClick={() => goToPage(page + 1)}
                        disabled={page === totalPages}
                        className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
                    >
                        ›
                    </button>
                </div>
            )}
        </div>
    );
}