
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import NetworkEnforcer from "./components/NetworkEnforcer";
import Index from "./pages/Index";
import Agents from "./pages/Agents";
import Proposals from "./pages/Proposals";
import Network from "./pages/Network";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <NetworkEnforcer>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/proposals" element={<Proposals />} />
              <Route path="/network" element={<Network />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </NetworkEnforcer>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
