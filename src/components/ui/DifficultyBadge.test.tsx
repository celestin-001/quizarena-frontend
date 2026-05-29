import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DifficultyBadge from './DifficultyBadge';

describe('DifficultyBadge', () => {
    it('affiche "Facile" pour la difficulté easy', () => {
        render(<DifficultyBadge difficulty="easy" />);
        expect(screen.getByText('Facile')).toBeInTheDocument();
    });

    it('affiche "Moyen" pour la difficulté medium', () => {
        render(<DifficultyBadge difficulty="medium" />);
        expect(screen.getByText('Moyen')).toBeInTheDocument();
    });

    it('affiche "Difficile" pour la difficulté hard', () => {
        render(<DifficultyBadge difficulty="hard" />);
        expect(screen.getByText('Difficile')).toBeInTheDocument();
    });

    it('applique la bonne couleur pour easy', () => {
        render(<DifficultyBadge difficulty="easy" />);
        expect(screen.getByText('Facile')).toHaveClass('text-green-800');
    });

    it('applique la bonne couleur pour hard', () => {
        render(<DifficultyBadge difficulty="hard" />);
        expect(screen.getByText('Difficile')).toHaveClass('text-red-800');
    });
});