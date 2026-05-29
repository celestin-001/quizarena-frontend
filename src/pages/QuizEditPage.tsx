import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuiz } from '../hooks/useQuiz';
import { updateQuiz } from '../api/quiz.api';
import { createQuestion, deleteQuestion } from '../api/question.api';
import Spinner from '../components/ui/Spinner';

const CATEGORIES = ['Géographie', 'Histoire', 'Culture', 'Sciences', 'Sport', 'Musique'];
const DIFFICULTIES = [
    { value: 'easy', label: 'Facile' },
    { value: 'medium', label: 'Moyen' },
    { value: 'hard', label: 'Difficile' },
];

interface QuestionForm {
    id?: string;
    text: string;
    options: [string, string, string, string];
    correctIndex: number;
    points: number;
    isNew?: boolean;
}

export default function QuizEditPage() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { quiz, isLoading } = useQuiz(id ?? '');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('easy');
    const [questions, setQuestions] = useState<QuestionForm[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);


    useEffect(() => {
        if (!quiz) return;
        setTitle(quiz.title);
        setDescription(quiz.description ?? '');
        setCategory(quiz.category);
        setDifficulty(quiz.difficulty);
        setQuestions(
            quiz.questions.map((q) => ({
                id: q.id,
                text: q.text,
                options: q.options as [string, string, string, string],
                correctIndex: q.correctIndex,
                points: q.points,
                isNew: false,
            })),
        );
    }, [quiz]);

    const updateQuestion = (index: number, field: keyof QuestionForm, value: unknown) => {
        setQuestions((prev) =>
            prev.map((q, i) => (i === index ? { ...q, [field]: value } : q)),
        );
    };

    const updateOption = (qIndex: number, oIndex: number, value: string) => {
        setQuestions((prev) =>
            prev.map((q, i) => {
                if (i !== qIndex) return q;
                const options = [...q.options] as [string, string, string, string];
                options[oIndex] = value;
                return { ...q, options };
            }),
        );
    };

    const addQuestion = () => {
        setQuestions((prev) => [
            ...prev,
            { text: '', options: ['', '', '', ''], correctIndex: 0, points: 10, isNew: true },
        ]);
    };

    const removeQuestion = async (index: number) => {
        const q = questions[index];
        if (q.id && !q.isNew) {
            await deleteQuestion(q.id);
        }
        setQuestions((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!id) return;
        setIsSaving(true);
        setError(null);

        try {
            // 1. Mettre à jour les infos du quiz via PUT
            await updateQuiz(id, { title, description, category, difficulty });

            // 2. Créer les nouvelles questions
            await Promise.all(
                questions
                    .filter((q) => q.isNew)
                    .map((q) =>
                        createQuestion(id, {
                            text: q.text,
                            options: q.options,
                            correctIndex: q.correctIndex,
                            points: q.points,
                        }),
                    ),
            );

            setSuccess(true);
            setTimeout(() => navigate(`/quizzes/${id}`), 1500);
        } catch {
            setError('Une erreur est survenue lors de la sauvegarde.');
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass =
        'w-full text-sm px-3 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-indigo-400 transition text-gray-800 placeholder:text-gray-400';

    const optionLetters = ['A', 'B', 'C', 'D'];

    if (isLoading) return <Spinner />;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {t('quiz.edit')}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {t('quiz.editSubtitle')}
                    </p>
                </div>
                <button
                    onClick={() => navigate(`/quizzes/${id}`)}
                    className="text-sm text-gray-500 hover:text-gray-700 transition flex items-center gap-1"
                >
                    ← {t('common.back')}
                </button>
            </div>

            {/* Succès */}
            {success && (
                <div className="mb-6 text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
                    🎉 {t('quiz.editSuccessRedirect')}
                </div>
            )}

            {/* Erreur */}
            {error && (
                <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                    {error}
                </div>
            )}

            {/* Infos du quiz */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                    {t('quiz.manualInfoTitle')}
                </h2>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-600">{t('quiz.titleField')} *</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-600">{t('quiz.descriptionField')}</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            className={`${inputClass} resize-none`}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-600">{t('quiz.categoryLabel')} *</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className={inputClass}
                            >
                                <option value="">{t('quiz.selectCategoryPlaceholder')}</option>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-600">{t('quiz.difficultyLabel')}</label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className={inputClass}
                            >
                                {DIFFICULTIES.map((d) => (
                                    <option key={d.value} value={d.value}>{t(`quiz.diff.${d.value}`)}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Questions */}
            <div className="flex flex-col gap-4 mb-6">
                {questions.map((q, qIndex) => (
                    <div
                        key={qIndex}
                        className={`bg-white border rounded-2xl p-6 shadow-sm ${
                            q.isNew ? 'border-indigo-200' : 'border-gray-100'
                        }`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                {t('quiz.questionIndexTitle', { index: qIndex + 1 })}
                                {q.isNew && (
                                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                                {t('quiz.badgeNewQuestion')}
                            </span>
                                )}
                            </h3>
                            <button
                                onClick={() => removeQuestion(qIndex)}
                                className="text-xs text-red-400 hover:text-red-600 transition"
                            >
                                {t('common.delete')}
                            </button>
                        </div>

                        <div className="flex flex-col gap-1.5 mb-4">
                            <label className="text-xs font-medium text-gray-600">{t('quiz.statementLabel')} *</label>
                            <input
                                value={q.text}
                                onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col gap-2 mb-4">
                            <label className="text-xs font-medium text-gray-600">
                                {t('quiz.optionsLabel')}
                            </label>
                            {q.options.map((option, oIndex) => (
                                <div key={oIndex} className="flex items-center gap-3">
                                    <button
                                        onClick={() => updateQuestion(qIndex, 'correctIndex', oIndex)}
                                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 transition ${
                                            q.correctIndex === oIndex
                                                ? 'border-indigo-500 bg-indigo-500 text-white'
                                                : 'border-gray-300 text-gray-400 hover:border-indigo-300'
                                        }`}
                                    >
                                        {optionLetters[oIndex]}
                                    </button>
                                    <input
                                        value={option}
                                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                        placeholder={`${t('quiz.optionSingle')} ${optionLetters[oIndex]}`}
                                        className={inputClass}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="text-xs font-medium text-gray-600">{t('quiz.pointsLabel')}</label>
                            <select
                                value={q.points}
                                onChange={(e) =>
                                    updateQuestion(qIndex, 'points', parseInt(e.target.value))
                                }
                                className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-indigo-400 transition"
                            >
                                {[5, 10, 20, 50].map((p) => (
                                    <option key={p} value={p}>{p} pts</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ajouter une question */}
            <button
                onClick={addQuestion}
                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition mb-8"
            >
                + {t('quiz.addQuestionButton')}
            </button>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
                <button
                    onClick={() => navigate(`/quizzes/${id}`)}
                    className="text-sm px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                >
                    {t('common.cancel')}
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="text-sm px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? t('common.savingInProgress') : t('quiz.saveChangesButton')}
                </button>
            </div>
        </div>
    );
}