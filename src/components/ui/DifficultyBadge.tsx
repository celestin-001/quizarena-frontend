import type { Difficulty } from '../../types';

interface Props {
    difficulty: Difficulty;
}

const config: Record<Difficulty, { label: string; className: string }> = {
    easy: { label: 'Facile', className: 'bg-green-100 text-green-800' },
    medium: { label: 'Moyen', className: 'bg-yellow-100 text-yellow-800' },
    hard: { label: 'Difficile', className: 'bg-red-100 text-red-800' },
};

export default function DifficultyBadge({ difficulty }: Props) {
    const { label, className } = config[difficulty];
    return (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${className}`}>
      {label}
    </span>
    );
}