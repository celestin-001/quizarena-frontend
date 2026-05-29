import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createQuiz, importQuiz, getTriviaCategories, type TriviaCategory } from '../api/quiz.api';
import { createQuestion } from '../api/question.api';

const CATEGORIES = ['Géographie', 'Histoire', 'Culture', 'Sciences', 'Sport', 'Musique'];
const DIFFICULTIES = [
    { value: 'easy', label: 'Facile' },
    { value: 'medium', label: 'Moyen' },
    { value: 'hard', label: 'Difficile' },
];

interface QuestionForm {
    text: string;
    options: [string, string, string, string];
    correctIndex: number;
    points: number;
}

const emptyQuestion = (): QuestionForm => ({
    text: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    points: 10,
});

export default function QuizCreatePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Quiz fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('easy');

    // Questions
    const [questions, setQuestions] = useState<QuestionForm[]>([emptyQuestion()]);

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Import state
    const [isImporting, setIsImporting] = useState(false);
    const [importTitle, setImportTitle] = useState('');
    const [importDifficulty, setImportDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
    const [importAmount, setImportAmount] = useState(10);
    const [showImport, setShowImport] = useState(false);
    const [triviaCategories, setTriviaCategories] = useState<TriviaCategory[]>([]);
    const [importCategoryId, setImportCategoryId] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (showImport && triviaCategories.length === 0) {
            getTriviaCategories().then(setTriviaCategories);
        }
    }, [showImport, triviaCategories.length]);

    // ── Question handlers ──────────────────────────────────
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

    const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()]);

    const removeQuestion = (index: number) => {
        if (questions.length === 1) return;
        setQuestions((prev) => prev.filter((_, i) => i !== index));
    };

    // ── Validation ─────────────────────────────────────────
    const validate = (): string | null => {
        if (!title.trim()) return 'Le titre est obligatoire.';
        if (!category) return 'La catégorie est obligatoire.';
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.text.trim()) return `La question ${i + 1} est vide.`;
            if (q.options.some((o) => !o.trim()))
                return `Toutes les options de la question ${i + 1} doivent être remplies.`;
        }
        return null;
    };

    // ── Submit ─────────────────────────────────────────────
    const handleSubmit = async () => {
        const validationError = validate();
        if (validationError) { setError(validationError); return; }

        setIsLoading(true);
        setError(null);

        try {
            const quiz = await createQuiz({ title, description, category, difficulty });
            await Promise.all(
                questions.map((q) =>
                    createQuestion(quiz.id, {
                        text: q.text,
                        options: q.options,
                        correctIndex: q.correctIndex,
                        points: q.points,
                    }),
                ),
            );
            navigate(`/quizzes/${quiz.id}`);
        } catch {
            setError('Une erreur est survenue lors de la création du quiz.');
        } finally {
            setIsLoading(false);
        }
    };

    // ── Import ─────────────────────────────────────────────
    const handleImport = async () => {
        if (!importTitle.trim()) {
            setError('Donne un titre à ton quiz importé.');
            return;
        }
        setIsImporting(true);
        setError(null);
        try {
            const quiz = await importQuiz({
                title: importTitle,
                difficulty: importDifficulty,
                amount: importAmount,
                categoryId: importCategoryId,
            });
            navigate(`/quizzes/${quiz.id}`);
        } catch {
            setError("Impossible d'importer depuis Open Trivia DB.");
        } finally {
            setIsImporting(false);
        }
    };

    const inputClass =
        'w-full text-sm px-3 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-indigo-400 transition text-gray-800 placeholder:text-gray-400';

    const optionLetters = ['A', 'B', 'C', 'D'];

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {t('quiz.create')}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {t('quiz.createSubtitle')}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/quizzes')}
                    className="text-sm text-gray-500 hover:text-gray-700 transition flex items-center gap-1"
                >
                    ← {t('common.back')}
                </button>
            </div>

            {/* Erreur globale */}
            {error && (
                <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                    {error}
                </div>
            )}

            {/* Bannière import */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-sm font-semibold text-indigo-900 flex items-center gap-1">
                            ✨ {t('quiz.importTitle')}
                        </h2>
                        <p className="text-xs text-indigo-500 mt-0.5">
                            {t('quiz.importSubtitle')}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowImport(!showImport)}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
                    >
                        {showImport ? t('common.hide') : t('common.use')}
                    </button>
                </div>

                {showImport && (
                    <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-indigo-100">

                        {/* Titre import */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-indigo-700">
                                {t('quiz.quizTitleLabel')} *
                            </label>
                            <input
                                value={importTitle}
                                onChange={(e) => setImportTitle(e.target.value)}
                                placeholder={t('quiz.importTitlePlaceholder')}
                                className="w-full text-sm px-3 py-2.5 rounded-lg border border-indigo-200 bg-white focus:outline-none focus:border-indigo-400 transition"
                            />
                        </div>

                        {/* Catégorie + Difficulté + Nombre -> 3 colonnes */}
                        <div className="grid grid-cols-3 gap-3">

                            {/* Catégorie import */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-indigo-700">
                                    {t('quiz.categoryLabel')}
                                </label>
                                <select
                                    value={importCategoryId ?? ''}
                                    onChange={(e) =>
                                        setImportCategoryId(
                                            e.target.value ? parseInt(e.target.value) : undefined,
                                        )
                                    }
                                    className="text-sm px-3 py-2.5 rounded-lg border border-indigo-200 bg-white focus:outline-none focus:border-indigo-400 transition"
                                >
                                    <option value="">{t('quiz.allCategories')}</option>
                                    {triviaCategories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Difficulté import */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-indigo-700">
                                    {t('quiz.difficultyLabel')}
                                </label>
                                <select
                                    value={importDifficulty}
                                    onChange={(e) =>
                                        setImportDifficulty(e.target.value as 'easy' | 'medium' | 'hard')
                                    }
                                    className="text-sm px-3 py-2.5 rounded-lg border border-indigo-200 bg-white focus:outline-none focus:border-indigo-400 transition"
                                >
                                    <option value="easy">{t('quiz.diff.easy')}</option>
                                    <option value="medium">{t('quiz.diff.medium')}</option>
                                    <option value="hard">{t('quiz.diff.hard')}</option>
                                </select>
                            </div>

                            {/* Nombre de questions import */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-indigo-700">
                                    {t('quiz.questionsLabel')}
                                </label>
                                <select
                                    value={importAmount}
                                    onChange={(e) => setImportAmount(parseInt(e.target.value))}
                                    className="text-sm px-3 py-2.5 rounded-lg border border-indigo-200 bg-white focus:outline-none focus:border-indigo-400 transition"
                                >
                                    {[5, 10, 15, 20].map((n) => (
                                        <option key={n} value={n}>
                                            {t('quiz.countQuestions', { count: n })}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleImport}
                            disabled={isImporting}
                            className="w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isImporting
                                ? t('quiz.importingInProgress')
                                : t('quiz.importSubmitButton', { count: importAmount })}
                        </button>
                    </div>
                )}
            </div>

            {/* Infos manuelles du quiz */}
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
                            placeholder={t('quiz.titleFieldPlaceholder')}
                            className={inputClass}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-600">{t('quiz.descriptionField')}</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('quiz.descriptionFieldPlaceholder')}
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

            {/* Zone des Questions dynamiques */}
            <div className="flex flex-col gap-4 mb-6">
                {questions.map((q, qIndex) => (
                    <div
                        key={qIndex}
                        className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-gray-900">
                                {t('quiz.questionIndexTitle', { index: qIndex + 1 })}
                            </h3>
                            <button
                                onClick={() => removeQuestion(qIndex)}
                                disabled={questions.length === 1}
                                className="text-xs text-red-400 hover:text-red-600 transition disabled:opacity-30"
                            >
                                {t('common.delete')}
                            </button>
                        </div>

                        <div className="flex flex-col gap-1.5 mb-4">
                            <label className="text-xs font-medium text-gray-600">{t('quiz.statementLabel')} *</label>
                            <input
                                value={q.text}
                                onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                                placeholder={t('quiz.statementPlaceholder')}
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
                            <p className="text-xs text-gray-400">
                                {t('quiz.optionsHelpText')}
                            </p>
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

            {/* Actions finales de validation */}
            <div className="flex gap-3 justify-end">
                <button
                    onClick={() => navigate('/quizzes')}
                    className="text-sm px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                >
                    {t('common.cancel')}
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="text-sm px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading
                        ? t('quiz.creationInProgress')
                        : t('quiz.submitCreateButton', { count: questions.length })}
                </button>
            </div>
        </div>
    );
}