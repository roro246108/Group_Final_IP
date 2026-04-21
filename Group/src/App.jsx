import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
<<<<<<< Updated upstream
import ProtectedRoute from "./Components/ProtectedRoute";
=======
import ProtectedRoute from "./RoutesFront/ProtectedRoute";
import AdminRoute from "./RoutesFront/AdminRoute";
>>>>>>> Stashed changes

import ReviewRating from "./Pages/ReviewRating";
import ContactHelp from "./Pages/ContactHelp";
import About from "./Pages/About";
import AdminSettings from "./Pages/adminSettings";
import HotelListingPage from "./Pages/HotelListingPage";
import FavoritesPage from "./Pages/FavoritesPage";
import { FavoritesProvider } from "./Context/FavoritesContext";
import { AuthProvider } from "./Context/AuthContext";
import { OffersProvider } from "./Context/OffersContext";
import HotelManagement from "./Pages/HotelManagement";
import AddBranch from "./Pages/AddBranch";
import EditBranch from "./Pages/EditBranch";
import BranchDetails from "./Pages/BranchDetails";
import UserBranchDetails from "./Pages/UserBranchDetails";
import Profile from "./Pages/profile";
import UserManagement from "./Pages/UserManagement";
import RoomBooking from "./Pages/BookingCheckOut";
import AdminRoomManagement from "./Pages/AdminRoomManagement";
import OffersPage from "./Pages/OffersPage";
import AdminOffersPage from "./Pages/AdminOffersPage";
import AdminBookingManagement from "./Pages/AdminBookingManagement";
import Payment from "./Pages/Payment";
import AdminDashboard from "./Pages/AdminDashBoard";
import HotelDetails from "./Pages/HotelDetails";
import HomePage from "./Pages/HomePage";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <OffersProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/hotels" element={<HotelListingPage />} />
            <Route path="/hotelDetails" element={<HotelDetails />} />
            <Route path="/branches/:slug" element={<UserBranchDetails />} />
            <Route path="/hotelDetails/booking" element={<RoomBooking />} />
            <Route path="/booking" element={<RoomBooking />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/payment" element={<Payment />} />

            {/* User protected */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin protected */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute role="admin">
                  <AdminBookingManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/rooms"
              element={
                <ProtectedRoute role="admin">
                  <AdminRoomManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/usermanagement"
              element={
                <ProtectedRoute role="admin">
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/hotels"
              element={
                <ProtectedRoute role="admin">
                  <HotelManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/hotels/add"
              element={
                <ProtectedRoute role="admin">
                  <AddBranch />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/hotels/:id"
              element={
                <ProtectedRoute role="admin">
                  <BranchDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/hotels/edit/:id"
              element={
                <ProtectedRoute role="admin">
                  <EditBranch />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/offers"
              element={
                <ProtectedRoute role="admin">
                  <AdminOffersPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute role="admin">
                  <AdminSettings />
                </ProtectedRoute>
              }
            />

          <Route path="/admin/settings" element={<AdminSettings />} />

          <Route element={<Layout />}>
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/reviews" element={<ReviewRating />} />
            <Route path="/help" element={<ContactHelp />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
        </OffersProvider>
    </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
