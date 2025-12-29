import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// import BrowserRouter dari React Router
import { BrowserRouter } from "react-router";

// import QueryClient dan QueryClientProvider dari react
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// init QueryClient
const queryClient = new QueryClient();

// import AuthProvider
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
