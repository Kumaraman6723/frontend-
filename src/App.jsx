import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/HomePage/Home";
import Signin from "./pages/SigninPage/Signin";
import Report from "./pages/ReportPage/Report";
import LostItems from "./pages/LostItemsPage/LostItems";
import FoundItems from "./pages/FoundItemsPage/FoundItems";
import EditProfile from "./pages/EditProfilePage/EditProfile";
import MyListings from "./pages/MyReports/MyReports";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationsPage from "./pages/NotificationsPage/NotificationsPage";
import VerificationPage from "./pages/VerficationPage/VerificationPage";
import UserLogsPage from "./pages/UserLogsPage/UserLogsPage.jsx";
import AllUserLogsPage from "./pages/AllUserLogsPage/AllUserLogsPage.jsx";
import AdminLogsPage from "./pages/AdminLogsPage/AdminLogsPage.jsx";
import Contactus from "./pages/ContactusPage/Contactus.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedLoginStatus = localStorage.getItem("isLoggedIn");
    return savedLoginStatus === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    // Simulate loading time and ensure app is ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className={`w-screen min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <Routes>
        <Route
          path="/"
          element={<Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        />
        <Route
          path="/home"
          element={<Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        />
        <Route
          path="/signin"
          element={
            <Signin darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
        <Route
          path="/notifications"
          element={
            <NotificationsPage
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
        <Route
          path="/Report"
          element={
            <Report darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
        <Route
          path="/LostItems"
          element={
            <LostItems darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
        <Route
          path="/FoundItems"
          element={
            <FoundItems darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
        <Route
          path="/EditProfile"
          element={
            <EditProfile darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
        <Route
          path="/MyListings"
          element={
            <MyListings darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
        <Route
          path="/VerificationPage"
          element={
            <VerificationPage
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
        <Route
          path="/ContactUs"
          element={
            <Contactus darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />

        <Route
          path="/UserLogs"
          element={
            <UserLogsPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
        <Route
          path="/AllUsersLogs"
          element={
            <AllUserLogsPage
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
        <Route
          path="//AdminLogs"
          element={
            <AdminLogsPage
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
      </Routes>
      <ToastContainer
        theme={darkMode ? "dark" : "light"}
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
      />
    </div>
  );
}

export default App;
