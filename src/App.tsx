import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import CustomerCheckout from "./pages/CustomerCheckout.tsx";
import SalesPortal from "./pages/SalesPortal.tsx";
import NewSession from "./pages/NewSession.tsx";
import SessionDetail from "./pages/SessionDetail.tsx";
import RenewalFlow from "./pages/RenewalFlow.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/checkout" element={<CustomerCheckout />} />
          <Route path="/checkout/session/:sessionId" element={<CustomerCheckout />} />
          <Route path="/checkout/session/:sessionId/:mobile" element={<CustomerCheckout />} />
          <Route path="/checkout/sales" element={<SalesPortal />} />
          <Route path="/checkout/sales/new-session" element={<NewSession />} />
          <Route path="/checkout/sales/session/:sessionId" element={<SessionDetail />} />
          <Route path="/checkout/sales/renewal" element={<RenewalFlow />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
