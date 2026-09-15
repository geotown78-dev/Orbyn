import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '@fontsource/noto-sans-georgian/400.css';
import '@fontsource/noto-sans-georgian/600.css';
import '@fontsource/noto-sans-georgian/700.css';
import '@fontsource/noto-sans-georgian/900.css';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';

// Register service worker in production / installed builds
if ('serviceWorker' in navigator && !import.meta.env.DEV) {
  import('virtual:pwa-register')
    .then(({ registerSW }) => {
      registerSW({ immediate: true });
    })
    .catch(() => {});
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
