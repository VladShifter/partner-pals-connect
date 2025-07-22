
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DevModeNavigation from "@/components/DevModeNavigation";
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
import { AdminGuard } from "./components/admin/AdminGuard";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminPartners from "./pages/admin/AdminPartners";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminTags from "./pages/admin/AdminTags";
import AdminProducts from "./pages/admin/AdminProducts";
import ProductServiceEdit from "./pages/admin/ProductServiceEdit";
import PartnerSuccess from "./pages/PartnerSuccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DevModeNavigation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboard/vendor" element={<OnboardVendor />} />
          <Route path="/onboard/partner" element={<OnboardPartner />} />
          <Route path="/partner/success" element={<PartnerSuccess />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/chat/:threadId" element={<Chat />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/partner/dashboard" element={<PartnerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }>
            <Route path="overview" element={<AdminOverview />} />
            <Route path="vendors" element={<AdminVendors />} />
            <Route path="vendors/:vendorId/edit" element={<ProductServiceEdit />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<ProductServiceEdit />} />
            <Route path="products/:productId/edit" element={<ProductServiceEdit />} />
            <Route path="partners" element={<AdminPartners />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="tags" element={<AdminTags />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
