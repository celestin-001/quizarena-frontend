import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'        // styles globaux
import App from './App.tsx' // ton application
import './i18n';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
)