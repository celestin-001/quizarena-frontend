import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import QuizCard from './QuizCard';
import type { Quiz } from '../../types';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockQuiz: Quiz = {
    id: '1',
    title: 'Culture générale',
    description: 'Un quiz sympa',
    category: 'Géographie',
    difficulty: 'easy',
    questionsCount: 12,
    author: { id: '1', username: 'alex', email: 'alex@test.com' },
    createdAt: '2026-01-01',
};

describe('QuizCard', () => {
    it('affiche le titre du quiz', () => {
        render(
            <MemoryRouter>
                <QuizCard quiz={mockQuiz} />
            </MemoryRouter>,
        );
        expect(screen.getByText('Culture générale')).toBeInTheDocument();
    });

    it('affiche la catégorie et le nombre de questions', () => {
        render(
            <MemoryRouter>
                <QuizCard quiz={mockQuiz} />
            </MemoryRouter>,
        );
        expect(screen.getByText(/Géographie/)).toBeInTheDocument();
        expect(screen.getByText(/12 questions/)).toBeInTheDocument();
    });

    it("affiche le nom de l'auteur", () => {
        render(
            <MemoryRouter>
                <QuizCard quiz={mockQuiz} />
            </MemoryRouter>,
        );
        expect(screen.getByText(/alex/)).toBeInTheDocument();
    });

    it('affiche le badge de difficulté', () => {
        render(
            <MemoryRouter>
                <QuizCard quiz={mockQuiz} />
            </MemoryRouter>,
        );
        expect(screen.getByText('Facile')).toBeInTheDocument();
    });

    it('navigue vers le jeu au clic sur Jouer', () => {
        render(
            <MemoryRouter>
                <QuizCard quiz={mockQuiz} />
            </MemoryRouter>,
        );
        fireEvent.click(screen.getByText('Jouer'));
        expect(mockNavigate).toHaveBeenCalledWith('/game/1');
    });
});