import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/User/HomePage";
import ContactPage from "./pages/User/ContactPage";
import MovieDetailPage from "./pages/User/MovieDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { MovieProvider } from "./context/MovieDetailContext";
import AdminDashboard from "./pages/Employee/AdminDashboard";
import CinemaMovieDetailPage from "./pages/User/CinemaMovieDetailPage";
import ErrorBoundary from "./components/ErrorBoundary ";
import OrderPage from "./pages/User/OrderPage"
import CheckoutPage from "./pages/User/CheckoutPage";
const queryClient = new QueryClient();

const App = () => {
  const [searchData, setSearchData] = useState([]);
  const location = useLocation();

  return (
      <MovieProvider>
        <div className="flex flex-col bg-black">
          {location.pathname !== "/admin" && (
            <Header setSearchData={setSearchData} />
          )}
          <Routes>
            <Route path="/" element={<Navigate to="/user" />} />
            <Route
              path="/user"
              element={<HomePage searchData={searchData} />}
            />
            <Route path="/user/contact" element={<ContactPage />} />
            <Route path="/user/movies/:id" element={<MovieDetailPage />} />
            <Route path = "user/cinema_movies/:id" element={<CinemaMovieDetailPage/>}/>
            <Route path = "user/cinema_movies/:id/order" element={<OrderPage/>}/>
            <Route path = "user/cinema_movies/:id/checkout" element={<CheckoutPage/>}/>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            
          </Routes>

          {location.pathname !== "/admin" && <Footer />}
        </div>
      </MovieProvider>
      
  );
};

const AppWithRouter = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <App />
    </Router>
  </QueryClientProvider>
);

export default AppWithRouter;
