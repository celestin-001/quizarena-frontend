const TOKEN_KEY = 'quizarena_token';

export const getToken = (): string | null =>
    localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
};

export const decodeTokenExpiry = (token: string): number | null => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp ? payload.exp * 1000 : null;
    } catch {
        return null;
    }
};