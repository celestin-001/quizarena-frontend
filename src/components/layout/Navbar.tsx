import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const { pathname } = useLocation();
    const { isAuthenticated, user, logout } = useAuth();

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr');
    };

    const navLink = (to: string, label: string) => (
        <Link
            to={to}
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
                pathname === to
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
        >
            {label}
        </Link>
    );

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-3">
            <div className="max-w-5xl mx-auto flex items-center justify-between">

                <Link to="/" className="flex items-center gap-2 text-gray-900 font-semibold text-base">
                    <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Q</span>
                    </div>
                    QuizArena
                </Link>

                <div className="flex items-center gap-1">
                    {navLink('/', 'Accueil')}
                    {navLink('/quizzes', t('nav.quizzes'))}
                    {navLink('/leaderboard', t('nav.leaderboard'))}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleLanguage}
                        className="text-xs border border-gray-200 px-2.5 py-1 rounded-full text-gray-500 hover:bg-gray-50 transition"
                    >
                        {i18n.language === 'fr' ? 'EN' : 'FR'}
                    </button>

                    {isAuthenticated ? (
                        <>
              <span className="text-sm text-gray-600 font-medium">
                @{user?.username}
              </span>
                            <button
                                onClick={logout}
                                className="text-sm text-gray-600 border border-gray-200 px-4 py-1.5 rounded-lg hover:bg-gray-50 transition"
                            >
                                {t('nav.logout')}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm text-gray-600 border border-gray-200 px-4 py-1.5 rounded-lg hover:bg-gray-50 transition"
                            >
                                {t('nav.login')}
                            </Link>
                            <Link
                                to="/register"
                                className="text-sm text-white bg-indigo-600 px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                            >
                                {t('nav.register')}
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}