import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "./Store/Store";

import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ProductsPage from "./pages/ProductsPage";
import ServicesPage from "./pages/ServicesPage";
import CategoryPage from "./pages/CategoryPage";
import CustomersPage from "./pages/CustomersPage";
import OrdersPage from "./pages/OrdersPage";
import Payments from "./pages/Payments";
import ShipingCompany from "./pages/ShipingCompany";
import SettingsPage from "./pages/ProfilePage";
import LoyaltyPoints from "./pages/loyaltyPoints/LoyaltyPoints";
import PlansPage from "./pages/PlansPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import StoreDetailsPage from "./pages/StoreDetailsPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import TicketDetailsPage from "./pages/TicketDetailsPage";
import "./i18n/i18n";
import StoreCreation from "./StoreCreationPage/StoreCreation";
import TemplateSelection from "./StoreCreationPage/TemplateSelection";
import ColorThemeSelection from "./StoreCreationPage/ColorThemeSelection";
import SectionCustomization from "./StoreCreationPage/SectionCustomization";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import YourStores from "./pages/YourStoresPage";
import ProtectedRoute from "./Routes/ProtectedRoute";
import IsCompletedRoute from "./Routes/IsCompletedRoute";
import ProtectedStoreRoute from "./Routes/ProtectedStoreRoute";
import ComponentContentForm from "./pages/ComponentContentForm/index";
import NotFoundPage from "./pages/NotFoundPage";
import TicketsPage from "./pages/tickets";
import StoreHoursPage from "./pages/storeHours/StoreHoursPage";
import PriceOffersPage from "./pages/priceOffers/PriceOffersPage";
import PriceOfferDetailsPage from "./pages/priceOffers/details/PriceOfferDetailsPage";
import CreateOrEditPriceOfferPage from "./pages/priceOffers/CreateOrEditPriceOfferPage";
import TranslationPage from "./pages/translation/TranslationPage";
import ManualTranslationPage from "./pages/translation/ManualTranslationPage";
import AutomaticTranslationPage from "./pages/translation/AutomaticTranslationPage";

function App() {
  const { i18n } = useTranslation();
  const customerData = useSelector(
    (state: RootState) => state.customer.customerData
  );
  const [isRegistrationCompleted, setRegistrationCompleted] = useState(false);

  useEffect(() => {
    if (customerData) {
      const hasBasicInfo = !!(
        customerData.location &&
        customerData.nationality !== null &&
        customerData.documentType !== null &&
        customerData.nationalAddress &&
        customerData.isFreelancer !== null &&
        customerData.birthDate &&
        customerData.idIssueDate &&
        customerData.idExpiryDate
      );

      const hasDocuments = !!(customerData.isFreelancer === true
        ? customerData.freelancerLicense
        : customerData.commercialRegistration);

      const hasBankAccount = !!customerData.bankAccount;
      const hasTaxDetails = !!customerData.taxDetails;
      const hasManagerDetails = !!customerData.managerDetails;

      const completed =
        hasBasicInfo &&
        hasDocuments &&
        hasBankAccount &&
        hasTaxDetails &&
        hasManagerDetails;
      setRegistrationCompleted(completed);
    } else {
      setRegistrationCompleted(false);
    }
  }, [customerData]);

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <IsCompletedRoute>
                <DashboardLayout
                  isRegistrationCompleted={isRegistrationCompleted}
                />
              </IsCompletedRoute>
            </ProtectedRoute>
          }>
          {/* Main Dashboard Routes */}
          <Route
            index
            element={
              <Dashboard
                isRegistrationCompleted={isRegistrationCompleted}
                setRegistrationCompleted={setRegistrationCompleted}
              />
            }
          />

          {/* User Profile & Store Management Routes */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="stores" element={<YourStores />} />
          <Route path="store/:id" element={<StoreDetailsPage />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="subscriptions" element={<SubscriptionsPage />} />

          {/* Ticket System Routes */}
          <Route path="tickets">
            <Route index element={<TicketsPage />} />
            <Route path="create" element={<CreateTicketPage />} />
            <Route path=":ticketId" element={<TicketDetailsPage />} />
          </Route>

          {/* Store Creation Routes */}
          <Route path="storeCreation" element={<StoreCreation />} />
          <Route path="templates" element={<TemplateSelection />} />
          <Route path="colors" element={<ColorThemeSelection />} />
          <Route path="customize" element={<SectionCustomization />} />

          {/* Store-specific Routes */}
          <Route path="store/:storeId">
            <Route index element={
              <ProtectedStoreRoute>
                <StoreDetailsPage />
              </ProtectedStoreRoute>
            } />
            <Route path="content-mapping" element={
              <ProtectedStoreRoute>
                <ComponentContentForm />
              </ProtectedStoreRoute>
            } />
            <Route
              path="dashboard"
              element={
                <ProtectedStoreRoute>
                  <Dashboard
                    isRegistrationCompleted={isRegistrationCompleted}
                    setRegistrationCompleted={setRegistrationCompleted}
                  />
                </ProtectedStoreRoute>
              }
            />

            {/* Routes that require registration completion */}
            <Route
              path="products"
              element={
                isRegistrationCompleted ? (
                  <ProtectedStoreRoute>
                    <ProductsPage />
                  </ProtectedStoreRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="services"
              element={
                isRegistrationCompleted ? (
                  <ProtectedStoreRoute>
                    <ServicesPage />
                  </ProtectedStoreRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="categories"
              element={
                isRegistrationCompleted ? (
                  <ProtectedStoreRoute>
                    <CategoryPage />
                  </ProtectedStoreRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="orders"
              element={
                isRegistrationCompleted ? (
                  <ProtectedStoreRoute>
                    <OrdersPage />
                  </ProtectedStoreRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="orders/:orderId"
              element={
                isRegistrationCompleted ? (
                  <ProtectedStoreRoute>
                    <OrderDetailsPage />
                  </ProtectedStoreRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="customers"
              element={
                isRegistrationCompleted ? (
                  <ProtectedStoreRoute>
                    <CustomersPage />
                  </ProtectedStoreRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="shipping"
              element={
                isRegistrationCompleted ? (
                  <ProtectedStoreRoute>
                    <ShipingCompany />
                  </ProtectedStoreRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="payments"
              element={
                isRegistrationCompleted ? (
                  <ProtectedStoreRoute>
                    <Payments />
                  </ProtectedStoreRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="settings"
              element={
                isRegistrationCompleted ? (
                  <ProtectedStoreRoute>
                    <SettingsPage />
                  </ProtectedStoreRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="loyalty"
              element={
                isRegistrationCompleted ? (
                  <ProtectedStoreRoute>
                    <LoyaltyPoints />
                  </ProtectedStoreRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="store-hours"
              element={
                isRegistrationCompleted ? (
                  <ProtectedStoreRoute>
                    <StoreHoursPage />
                  </ProtectedStoreRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="price-offers"
              element={
                isRegistrationCompleted ? (
                  <ProtectedStoreRoute>
                    <PriceOffersPage />
                  </ProtectedStoreRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="price-offers/create"
              element={
                isRegistrationCompleted ? (
                  <ProtectedStoreRoute>
                    <CreateOrEditPriceOfferPage />
                  </ProtectedStoreRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="price-offers/:offerId/edit"
              element={
                isRegistrationCompleted ? (
                  <ProtectedStoreRoute>
                    <CreateOrEditPriceOfferPage />
                  </ProtectedStoreRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="price-offers/:offerId"
              element={
                isRegistrationCompleted ? (
                  <ProtectedStoreRoute>
                    <PriceOfferDetailsPage />
                  </ProtectedStoreRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="translation"
              element={
                isRegistrationCompleted ? (
                  <ProtectedStoreRoute>
                    <TranslationPage />
                  </ProtectedStoreRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="translation/automatic"
              element={
                isRegistrationCompleted ? (
                  <ProtectedStoreRoute>
                    <AutomaticTranslationPage />
                  </ProtectedStoreRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="translation/manual"
              element={
                isRegistrationCompleted ? (
                  <ProtectedStoreRoute>
                    <ManualTranslationPage />
                  </ProtectedStoreRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Route>
        </Route>

        {/* Catch all route - show NotFoundPage */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
