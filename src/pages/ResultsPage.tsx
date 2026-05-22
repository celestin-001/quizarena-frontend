import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { submitGame } from '../api/game.api';
import type { GameAnswer, Quiz, Question } from '../types';

interface LocationState {
  score: number;
  answers: GameAnswer[];
  quiz: Quiz & { questions: Question[] };
  submitted?: boolean;
}

export default function ResultsPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const state = location.state as LocationState | null;

     // Soumet le score une seule fois au montage
  useEffect(() => {
    if (!state || state.submitted) return;
    const totalPoints = state.quiz.questions.reduce((acc, q) => acc + q.points, 0);

    submitGame({
      quizId: state.quiz.id,
      score: state.score,
      totalPoints,
      answers: state.answers.map((a) => ({
        questionId: a.questionId,
        selectedIndex: a.selectedIndex,
        correct: a.correct,
      })),
    }).catch(console.error);
  }, [state]);

    if (!state) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-400 text-sm">
                Aucun résultat disponible.{' '}
                <button onClick={() => navigate('/quizzes')} className="text-indigo-600 ml-1">
                    Retour aux quiz
                </button>
            </div>
        );
    }

    const { score, answers, quiz } = state;
    const totalPoints = quiz.questions.reduce((acc, q) => acc + q.points, 0);
    const correctCount = answers.filter((a) => a.correct).length;
    const percentage = Math.round((score / totalPoints) * 100);

    const getEmoji = () => {
        if (percentage >= 80) return { text: 'Excellent !', color: 'text-green-600' };
        if (percentage >= 50) return { text: 'Bien joué !', color: 'text-indigo-600' };
        return { text: 'Pas de chance...', color: 'text-gray-500' };
    };

    const { text, color } = getEmoji();

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">

            {/* Score visuel */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center mb-6">
                <div className="w-24 h-24 rounded-full border-4 border-indigo-500 bg-indigo-50 flex flex-col items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-medium text-indigo-600">{score}</span>
                    <span className="text-xs text-indigo-400">pts</span>
                </div>
                <h1 className={`text-xl font-medium mb-1 ${color}`}>{text}</h1>
                <p className="text-sm text-gray-400">
                    {correctCount} bonne{correctCount > 1 ? 's' : ''} réponse{correctCount > 1 ? 's' : ''} sur {quiz.questions.length}
                </p>

                {/* Barre de score */}
                <div className="mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <p className="text-xs text-gray-400 mt-1">{percentage}% de réussite</p>
            </div>

            {/* Récap des réponses */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
                <h2 className="text-sm font-medium text-gray-900 mb-4">Récapitulatif</h2>
                <div className="flex flex-col gap-3">
                    {quiz.questions.map((question, index) => {
                        const answer = answers[index];
                        const correct = answer?.correct ?? false;
                        return (
                            <div
                                key={question.id}
                                className={`flex items-start gap-3 p-3 rounded-xl text-sm ${
                                    correct ? 'bg-green-50' : 'bg-red-50'
                                }`}
                            >
                                <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                        correct ? 'bg-green-500' : 'bg-red-400'
                                    }`}
                                >
                                    <span className="text-white text-xs">{correct ? '✓' : '✕'}</span>
                                </div>
                                <div>
                                    <p className={`font-medium ${correct ? 'text-green-800' : 'text-red-800'}`}>
                                        {question.text}
                                    </p>
                                    {!correct && (
                                        <p className="text-xs text-red-500 mt-0.5">
                                            Bonne réponse : {question.options[question.correctIndex]}
                                        </p>
                                    )}
                                </div>
                                {correct && (
                                    <span className="ml-auto text-xs font-medium text-green-600 flex-shrink-0">
                    +{question.points} pts
                  </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
                <button
                    onClick={() => navigate(`/game/${id}`)}
                    className="border border-gray-200 text-sm text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition"
                >
                    Rejouer
                </button>
                <button
                    onClick={() => navigate('/leaderboard')}
                    className="bg-indigo-600 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition"
                >
                    Voir le classement
                </button>
                <button
                    onClick={() => navigate('/quizzes')}
                    className="border border-gray-200 text-sm text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition"
                >
                    Autres quiz
                </button>
            </div>
        </div>
    );
}