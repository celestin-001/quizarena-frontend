import { useNavigate } from 'react-router-dom';
import DifficultyBadge from '../ui/DifficultyBadge';
import type { Quiz } from '../../types';

interface Props {
    quiz: Quiz;
}

export default function QuizCard({ quiz }: Props) {
    const navigate = useNavigate();

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-900">{quiz.title}</span>
                    <DifficultyBadge difficulty={quiz.difficulty} />
                </div>
                <p className="text-xs text-gray-400 mb-4">
                    {quiz.questionsCount} questions · {quiz.category}
                </p>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">par @{quiz.author.username}</span>
                <button
                    onClick={() => navigate(`/game/${quiz.id}`)}
                    className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-100 transition"
                >
                    Jouer
                </button>
            </div>
        </div>
    );
}