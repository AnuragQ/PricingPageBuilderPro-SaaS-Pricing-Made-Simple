import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Light/Dark mode
// import {createNightowl} from '@bufferhead/nightowl'
  
// createNightowl({
//     defaultMode: 'dark',
//     toggleButtonMode: 'newState'
// })
// End light/dark mode

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
