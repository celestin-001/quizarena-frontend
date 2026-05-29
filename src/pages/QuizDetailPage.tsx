import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import { useAuth } from '../contexts/AuthContext';
import DifficultyBadge from '../components/ui/DifficultyBadge';
import Spinner from '../components/ui/Spinner';
import type { Difficulty } from '../types';
import {t} from "i18next";

export default function QuizDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { quiz, isLoading, error } = useQuiz(id ?? '');

    if (isLoading) return <Spinner />;
    if (error || !quiz) {
        return (
            <div className="text-center py-16 text-gray-400 text-sm">
                Quiz introuvable.{' '}
                <button onClick={() => navigate('/quizzes')} className="text-indigo-600">
                    Retour aux quiz
                </button>
            </div>
        );
    }

    return (

        <div className="max-w-2xl mx-auto px-4 py-8">

            {/* Retour */}
            <button
                onClick={() => navigate('/quizzes')}
                className="text-sm text-gray-500 hover:text-gray-700 mb-6 block transition"
            >
                ← {t('quiz.backToList')}
            </button>

            {/* Infos du quiz */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-4">
                <div className="flex justify-between items-start mb-3">
                    <h1 className="text-xl font-semibold text-gray-900">{quiz.title}</h1>
                    <DifficultyBadge difficulty={quiz.difficulty as Difficulty} />
                </div>
                {quiz.description && (
                    <p className="text-sm text-gray-500 mb-3">{quiz.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>
                {t('quiz.countQuestions', { count: quiz.questions.length })}
            </span>
                    <span>•</span>
                    <span>{quiz.category}</span>
                    <span>•</span>
                    <span>
                {t('quiz.authorBy', { username: quiz.author.username })}
            </span>
                </div>
            </div>

            {/* Aperçu des questions */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                    {t('quiz.previewQuestions')}
                </h2>
                <div className="flex flex-col gap-3">
                    {quiz.questions.map((q, i) => (
                        <div key={q.id} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                    </span>
                            <span className="text-sm text-gray-700">{q.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
                <button
                    onClick={() => navigate(`/game/${quiz.id}`)}
                    className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition text-sm"
                >
                    {t('quiz.playButton')}
                </button>

                {user?.id === quiz.author.id && (
                    <button
                        onClick={() => navigate(`/quizzes/${quiz.id}/edit`)}
                        className="w-full py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition text-sm flex items-center justify-center gap-1"
                    >
                        ✏️ {t('quiz.editButton')}
                    </button>
                )}
            </div>
        </div>
    );
}