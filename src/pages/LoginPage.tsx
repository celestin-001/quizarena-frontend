import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
    const { t } = useTranslation();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await login({ email, password });
            navigate('/');
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })
                ?.response?.data?.message;
            setError(msg ?? t('errors.generic'));
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass =
        'w-full text-sm px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-indigo-400 transition text-gray-800 placeholder:text-gray-400';

    return (
        <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4 bg-gray-50">
            <div className="w-full max-w-sm">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                        {t('auth.loginTitle')}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {t('auth.noAccount')}{' '}
                        <Link to="/register" className="text-indigo-600 hover:underline font-medium">
                            {t('nav.register')}
                        </Link>
                    </p>
                </div>

                {/* Formulaire */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
                >
                    {/* Erreur */}
                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-600">
                            {t('auth.email')}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="alex@exemple.com"
                            required
                            className={inputClass}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-600">
                            {t('auth.password')}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className={inputClass}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                    >
                        {isLoading ? 'Connexion...' : t('nav.login')}
                    </button>
                </form>
            </div>
        </div>
    );
}