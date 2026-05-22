import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from 'react';
import { login as apiLogin, register as apiRegister } from '../api/auth.api';
import { getToken, setToken, clearToken, decodeTokenExpiry } from '../utils/token';
import type { User, LoginPayload, RegisterPayload } from '../types';

interface AuthContextValue {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setTokenState] = useState<string | null>(getToken());
    const [isLoading, setIsLoading] = useState(true);

    const logout = useCallback(() => {
        clearToken();
        setTokenState(null);
        setUser(null);
    }, []);

    // Renouvellement automatique du token avant expiration
    useEffect(() => {
        if (!token) return;
        const expiry = decodeTokenExpiry(token);
        if (!expiry) return;
        const delay = expiry - Date.now() - 60_000; // 1 min avant expiration
        if (delay <= 0) { logout(); return; }
        const timer = setTimeout(logout, delay);
        return () => clearTimeout(timer);
    }, [token, logout]);

    // Chargement initial — vérifie si un token est déjà stocké
    useEffect(() => {
        const stored = getToken();
        if (!stored) { setIsLoading(false); return; }
        // On fait confiance au token stocké, le user sera rechargé si nécessaire
        setTokenState(stored);
        setIsLoading(false);
    }, []);

    const login = async (payload: LoginPayload) => {
        const res = await apiLogin(payload);
        setToken(res.token);
        setTokenState(res.token);
        setUser(res.user);
    };

    const register = async (payload: RegisterPayload) => {
        const res = await apiRegister(payload);
        setToken(res.token);
        setTokenState(res.token);
        setUser(res.user);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}