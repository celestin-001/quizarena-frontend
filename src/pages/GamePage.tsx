import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuiz } from '../hooks/useQuiz';
import type { GameAnswer } from '../types';

const TIMER_SECONDS = 15;

type AnswerState = 'idle' | 'correct' | 'wrong';

export default function GamePage() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { quiz, isLoading, error } = useQuiz(id ?? '');

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [answerState, setAnswerState] = useState<AnswerState>('idle');
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState<GameAnswer[]>([]);
    const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);

    const question = quiz?.questions[currentIndex];
    const total = quiz?.questions.length ?? 0;
    const progress = total > 0 ? ((currentIndex) / total) * 100 : 0;

    const handleNext = useCallback(() => {
        if (currentIndex + 1 >= total) {
            navigate(`/game/${id}/results`, {
                state: { score, answers, quiz },
            });
        } else {
            setCurrentIndex((i) => i + 1);
            setSelected(null);
            setAnswerState('idle');
            setTimeLeft(TIMER_SECONDS);
        }
    }, [currentIndex, total, id, score, answers, quiz, navigate]);

    // Timer
    useEffect(() => {
        if (answerState !== 'idle' || !question) return;
        if (timeLeft === 0) {
            setTimeout(() => { // ← enveloppe dans setTimeout
                setAnswerState('wrong');
                setAnswers((prev) => [
                    ...prev,
                    { questionId: question.id, selectedIndex: -1, correct: false, points: 0 },
                ]);
            }, 0);
            return;
        }
        const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearInterval(interval);
    }, [timeLeft, answerState, question]);

// Reset timer
    useEffect(() => {
        setTimeout(() => setTimeLeft(TIMER_SECONDS), 0); // ← enveloppe dans setTimeout
    }, [currentIndex]);

    const handleSelect = (index: number) => {
        if (answerState !== 'idle' || !question) return;

        const correct = index === question.correctIndex;
        setSelected(index);
        setAnswerState(correct ? 'correct' : 'wrong');

        if (correct) setScore((s) => s + question.points);

        setAnswers((prev) => [
            ...prev,
            { questionId: question.id, selectedIndex: index, correct, points: correct ? question.points : 0 },
        ]);
    };

    const getOptionClass = (index: number) => {
        const base = 'w-full text-left px-4 py-3 rounded-xl border text-sm flex items-center gap-3 transition';
        if (answerState === 'idle') {
            return `${base} border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer`;
        }
        if (index === question?.correctIndex) {
            return `${base} border-green-400 bg-green-50 text-green-800`;
        }
        if (index === selected && answerState === 'wrong') {
            return `${base} border-red-400 bg-red-50 text-red-800`;
        }
        return `${base} border-gray-100 bg-white text-gray-400`;
    };

    const optionLetters = ['A', 'B', 'C', 'D'];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-400 text-sm">
                {t('quiz.loading')}
            </div>
        );
    }

    if (error || !quiz || !question) {
        return (
            <div className="flex justify-center items-center h-64 text-red-500 text-sm">
                {error ?? t('errors.quizNotFound')}
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">

            {/* En-tête : progression + timer */}
            <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-gray-400 whitespace-nowrap">
                    {t('game.question', { current: currentIndex + 1, total })}
                </span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                        timeLeft <= 5
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    {timeLeft}s
                </span>
            </div>

            {/* Score */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-base font-medium text-gray-900">{quiz.title}</h1>
                <span className="text-sm font-medium text-indigo-600">
                    {t('game.score', { score })}
                </span>
            </div>

            {/* Question */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
                <p className="text-base font-medium text-gray-900 mb-6 leading-relaxed">
                    {question.text}
                </p>

                <div className="flex flex-col gap-3">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelect(index)}
                            className={getOptionClass(index)}
                        >
                            <span
                                className={`w-6 h-6 rounded-full border text-xs font-medium flex items-center justify-center flex-shrink-0 ${
                                    answerState === 'idle'
                                        ? 'border-gray-300 text-gray-500'
                                        : index === question.correctIndex
                                            ? 'border-green-500 text-green-700'
                                            : index === selected
                                                ? 'border-red-400 text-red-600'
                                                : 'border-gray-200 text-gray-400'
                                }`}
                            >
                                {optionLetters[index]}
                            </span>
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feedback + bouton suivant */}
            {answerState !== 'idle' && (
                <div className="flex items-center justify-between mt-4">
                    <span
                        className={`text-sm font-medium ${
                            answerState === 'correct' ? 'text-green-600' : 'text-red-500'
                        }`}
                    >
                        {answerState === 'correct'
                            ? t('game.correct', { points: question.points })
                            : t('game.wrong', { answer: question.options[question.correctIndex] })}
                    </span>
                    <button
                        onClick={handleNext}
                        className="text-sm bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        {currentIndex + 1 >= total ? t('game.finish') : t('game.next')}
                    </button>
                </div>
            )}
        </div>
    );
}