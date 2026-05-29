import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// ← Mocks au top level obligatoirement
vi.mock('../../contexts/AuthContext', () => ({
    useAuth: () => ({
        isAuthenticated: false,
        user: null,
        logout: vi.fn(),
    }),
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'fr', changeLanguage: vi.fn() },
    }),
}));

// Import APRÈS les mocks
import Navbar from './Navbar';

describe('Navbar — non connecté', () => {
    it('affiche le logo QuizArena', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>,
        );
        expect(screen.getByText('QuizArena')).toBeInTheDocument();
    });

    it('affiche les boutons connexion et inscription', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>,
        );
        expect(screen.getByText('nav.logout')).toBeInTheDocument();
    });

    it('affiche le bouton de changement de langue', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>,
        );
        expect(screen.getByText('EN')).toBeInTheDocument();
    });
});


describe('Navbar connecté', () => {
    it('affiche le username si connecté', () => {
        vi.mock('../../contexts/AuthContext', () => ({
            useAuth: () => ({
                isAuthenticated: true,
                user: { id: '1', username: 'alex', email: 'alex@test.com' },
                logout: vi.fn(),
            }),
        }));

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>,
        );
        expect(screen.getByText('QuizArena')).toBeInTheDocument();
    });
});