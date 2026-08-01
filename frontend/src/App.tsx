import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/contexts/theme-provider";
import { FoundationStatusPage } from "@/pages/FoundationStatusPage";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <Routes>
            <Route path="*" element={<FoundationStatusPage />} />
          </Routes>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

export default App;
