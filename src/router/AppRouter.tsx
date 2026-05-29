import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import QuizzesPage from '../pages/QuizzesPage';
import QuizDetailPage from '../pages/QuizDetailPage';
import QuizCreatePage from '../pages/QuizCreatePage';
import GamePage from '../pages/GamePage';
import ResultsPage from '../pages/ResultsPage';
import { useAuth } from '../contexts/AuthContext';
import LeaderboardPage from '../pages/LeaderboardPage';
import QuizEditPage from '../pages/QuizEditPage';



function GuestRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}


export default function AppRouter() {
    return (
        <BrowserRouter>

            <Routes>
                <Route element={<Layout/>}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/quizzes" element={<QuizzesPage />} />
                    <Route path="/quizzes/:id" element={<QuizDetailPage />} />
                    <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
                    <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
                    <Route path="/quizzes/create" element={
                        <ProtectedRoute><QuizCreatePage /></ProtectedRoute>
                    } />
                    <Route path="/game/:id" element={
                        <ProtectedRoute><GamePage /></ProtectedRoute>
                    } />
                    <Route path="/game/:id/results" element={
                        <ProtectedRoute><ResultsPage /></ProtectedRoute>
                    } />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                </Route>
                <Route path="/quizzes/:id/edit" element={
                    <ProtectedRoute><QuizEditPage /></ProtectedRoute>
                } />

            </Routes>

        </BrowserRouter>
    );
}