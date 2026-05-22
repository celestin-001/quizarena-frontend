import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import QuizCard from '../components/quiz/QuizCard';
import { useQuizzes } from '../hooks/useQuizzes';

export default function HomePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data, isLoading } = useQuizzes({ limit: 3 } as never);

    return (
        <div>
            {/* Hero */}
            <section className="text-center py-16 px-4 bg-white border-b border-gray-100">
                <h1 className="text-4xl font-medium text-gray-900 mb-3">
                    {t('home.title')}
                </h1>
                <p className="text-gray-500 text-lg mb-8">
                    {t('home.subtitle')}
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => navigate('/quizzes')}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                    >
                        {t('home.cta')}
                    </button>
                    <button
                        onClick={() => navigate('/quizzes/create')}
                        className="border border-gray-200 px-6 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                        {t('quiz.create')}
                    </button>
                </div>
            </section>

            {/* Quiz populaires */}
            <section className="max-w-5xl mx-auto px-4 py-10">
                <h2 className="text-base font-medium text-gray-900 mb-5">
                    Quiz populaires
                </h2>

                {isLoading ? (
                    <div className="text-center text-gray-400 text-sm py-8">Chargement...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data?.data.slice(0, 3).map((quiz) => (
                            <QuizCard key={quiz.id} quiz={quiz} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}