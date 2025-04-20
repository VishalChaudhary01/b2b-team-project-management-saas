import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { Toaster } from '@/components/ui/sonner';
import QueryProvider from './context/query-provider.tsx';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <NuqsAdapter>
        <App />
      </NuqsAdapter>
      <Toaster richColors />
    </QueryProvider>
  </StrictMode>
);
