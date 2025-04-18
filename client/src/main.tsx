import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from '@/components/ui/sonner';
import './index.css';
import App from './App.tsx';
import QueryProvider from './context/query-provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <App />
      <Toaster richColors />
    </QueryProvider>
  </StrictMode>
);
