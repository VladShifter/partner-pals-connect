
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OnboardVendor from "./pages/OnboardVendor";
import OnboardPartner from "./pages/OnboardPartner";
import Marketplace from "./pages/Marketplace";
import ProductDetail from "./pages/ProductDetail";
import Chat from "./pages/Chat";
import VendorDashboard from "./pages/VendorDashboard";
import PartnerDashboard from "./pages/PartnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboard/vendor" element={<OnboardVendor />} />
          <Route path="/onboard/partner" element={<OnboardPartner />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/chat/:threadId" element={<Chat />} />
          <Route path="/dashboard/vendor" element={<VendorDashboard />} />
          <Route path="/dashboard/partner" element={<PartnerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
