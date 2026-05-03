import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { AuthProvider } from "@/context/AuthContext";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";
import PageTransition from "@/components/PageTransition";
import ScrollToTop from "@/components/ScrollToTop";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/ProductDetails";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Deals from "./pages/Deals";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import MyOrders from "./pages/MyOrders";
import NotFound from "./pages/NotFound";
import WhatsAppButton from "./components/WhatsAppButton";
import OfflineIndicator from "./components/OfflineIndicator";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import Coupons from "./pages/admin/Coupons";
import AdminNotifications from "./pages/admin/Notifications";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import AdminCategories from "./pages/admin/Categories";
import AdminBlogPosts from "./pages/admin/BlogPosts";

const queryClient = new QueryClient();

const PushNotificationListener = () => {
  usePushNotifications();
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/admin90" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="blog" element={<AdminBlogPosts />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <Toaster />
              <Sonner />
              <OfflineIndicator />
              <WhatsAppButton />
              <BrowserRouter>
                <ScrollToTop />
                <PushNotificationListener />
                <AnimatedRoutes />
              </BrowserRouter>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
