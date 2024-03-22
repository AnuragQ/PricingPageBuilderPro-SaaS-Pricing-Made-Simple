import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const cacheTimeExpire = parseInt(process.env.REACT_APP_CACHE_DURATION);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: cacheTimeExpire, // 24 hours
      // Optionally, set staleTime if you want the data to be considered fresh for a day as well
      staleTime: cacheTimeExpire,
    },
  },
});

console.log(cacheTimeExpire);

// Light/Dark mode
// import {createNightowl} from '@bufferhead/nightowl'

// createNightowl({
//     defaultMode: 'dark',
//     toggleButtonMode: 'newState'
// })
// End light/dark mode

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
