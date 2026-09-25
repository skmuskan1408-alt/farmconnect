import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ThemePickerModal } from './components/common/ThemePickerModal';
import { AnimatedFarmBackground } from './components/common/AnimatedFarmBackground';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { BulkRequestsPage } from './pages/BulkRequestsPage';
import { HelpDeskPage } from './pages/HelpDeskPage';

import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { FPODashboard } from './pages/fpo/FPODashboard';
import { ConsumerDashboard } from './pages/consumer/ConsumerDashboard';
import { BuyerDashboard } from './pages/buyer/BuyerDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

import { AIAssistantFloatingButton } from './components/ai/AIAssistantFloatingButton';
import { AIAssistantModal } from './components/ai/AIAssistantModal';

export const AppContent: React.FC = () => {
  const [aiOpen, setAiOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      {/* Animated Agriculture Produce Background Shower */}
      <AnimatedFarmBackground />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/bulk-requests" element={<BulkRequestsPage />} />
        <Route path="/help" element={<HelpDeskPage />} />

        {/* Consumer Protected Routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={['CONSUMER']}>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={['CONSUMER']}>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consumer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['CONSUMER']}>
              <ConsumerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consumer/orders"
          element={
            <ProtectedRoute allowedRoles={['CONSUMER']}>
              <ConsumerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consumer/tracking"
          element={
            <ProtectedRoute allowedRoles={['CONSUMER']}>
              <ConsumerDashboard />
            </ProtectedRoute>
          }
        />

        {/* FPO Protected Routes */}
        <Route
          path="/fpo/dashboard"
          element={
            <ProtectedRoute allowedRoles={['FPO', 'ADMIN']}>
              <FPODashboard />
            </ProtectedRoute>
          }
        />

        {/* Order Tracking Timeline */}
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderTrackingPage />
            </ProtectedRoute>
          }
        />

        {/* Farmer Protected Routes */}
        <Route
          path="/farmer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/products"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/orders"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/forecast"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/deliveries"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/messages"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/reviews"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Bulk Buyer Protected Routes */}
        <Route
          path="/buyer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['BULK_BUYER']}>
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/bids"
          element={
            <ProtectedRoute allowedRoles={['BULK_BUYER']}>
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global KissanConnect AI Floating Assistant Button */}
      <AIAssistantFloatingButton onClick={() => setAiOpen(true)} />

      {/* Global KissanConnect AI Assistant Modal */}
      <AIAssistantModal
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        onOpenSupportTicket={() => navigate('/help')}
      />
      {/* Global KissanConnect Theme Customizer Modal */}
      <ThemePickerModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
