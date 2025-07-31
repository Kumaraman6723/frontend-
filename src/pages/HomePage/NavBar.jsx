import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../../redux/userSlice";
import mainLogo from "../../Images/ncu.png";
import darkLogo from "../../Images/ncuDark.png";
import { FaSun, FaMoon, FaBell } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import "./Navbar.css";
import { getApiUrl, getLogsUrl } from "../../config/api";

export default function NavBar({ darkMode, toggleDarkMode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getUserInitials = (user) => {
    if (user && user.firstName) {
      return user.lastName
        ? `${user.firstName[0]}${user.lastName[0]}`
        : `${user.firstName[0]}`;
    }
    return "";
  };

  const handleLogout = async () => {
    try {
      const loggedOutUser = JSON.parse(localStorage.getItem("user"));

      if (loggedOutUser) {
        await axios.post(
          getLogsUrl("ADMIN_LOGS"),
          {
            adminId: loggedOutUser._id,
            action: `User Logged Out (${loggedOutUser.email})`,
            timestamp: new Date(),
          },
          {
            headers: {
              Email: loggedOutUser.email,
            },
            withCredentials: true,
          }
        );
      }

      dispatch(setUser(null));
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");

      toast.success("Logged out successfully", {
        autoClose: 2000,
        onClose: () => navigate("/"),
      });
    } catch (error) {
      console.error("Error during logout", error);
      toast.error("Logout failed", {
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      dispatch(setUser(savedUser));
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        const response = await axios.get(getApiUrl("/api/reports"), {
          headers: {
            Authorization: `Bearer ${user.token}`,
            email: user.email,
          },
        });

        let userNotifications;
        if (user.role === "admin") {
          userNotifications = response.data.filter(
            (notification) => notification.claimedBy
          );
        } else {
          userNotifications = response.data.filter(
            (report) =>
              (report.reportType === "lost" &&
                report.user.email === user.email &&
                report.claimedBy) ||
              (report.reportType === "found" && report.claimedBy === user.email)
          );
        }

        userNotifications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setNotifications(userNotifications);

        const unreadCount = userNotifications.filter(
          (notification) => !notification.read
        ).length;
        setUnreadCount(unreadCount);

        const markAsReadPromises = userNotifications.map((notification) => {
          if (!notification.read) {
            return axios.put(
              `${getApiUrl("/api/reports/notification")}/${
                notification._id
              }/read`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                  email: user.email,
                },
              }
            );
          }
          return null;
        });

        await Promise.all(markAsReadPromises);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleBellClick = () => {
    navigate("/notifications");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".navbar-user")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <>
      <nav
        className={`py-2 px-4 shadow ${
          darkMode
            ? "bg-gray-800 text-white border-b border-gray-700"
            : "bg-white text-black border-b border-gray-300"
        }`}
      >
        <div className="container mx-auto navbar-container">
          <div className="navbar-top">
            <div className="navbar-logo">
              <NavLink to="/">
                <img
                  src={darkMode ? darkLogo : mainLogo}
                  alt="logo"
                  className="w-24 h-auto mx-auto"
                />
              </NavLink>
            </div>
            <button className="mobile-menu-button" onClick={toggleSidebar}>
              ☰
            </button>
          </div>

          <div className="navbar-links desktop-links">
            <NavLink
              to="/"
              className={`nav-link ${darkMode ? "text-white" : "text-black"}`}
            >
              HOME
            </NavLink>
            <NavLink
              to="/LostItems"
              className={`nav-link ${darkMode ? "text-white" : "text-black"}`}
            >
              LOST ITEMS
            </NavLink>
            <NavLink
              to="/FoundItems"
              className={`nav-link ${darkMode ? "text-white" : "text-black"}`}
            >
              FOUND ITEMS
            </NavLink>
            <NavLink
              to="/Report"
              className={`nav-link ${darkMode ? "text-white" : "text-black"}`}
            >
              REPORT
            </NavLink>
            {user && user.role === "user" && (
              <NavLink
                to="/Contactus"
                className={`nav-link ${darkMode ? "text-white" : "text-black"}`}
              >
                CONTACT US
              </NavLink>
            )}
            {user && user.role === "admin" && (
              <NavLink
                to="/VerificationPage"
                className={`nav-link ${darkMode ? "text-white" : "text-black"}`}
              >
                VERIFICATION
              </NavLink>
            )}
          </div>

          <div className="navbar-icons desktop-icons bgTest">
            <div className="relative">
              <FaBell
                className={`text-2xl ${
                  darkMode ? "text-white" : "text-black"
                } cursor-pointer`}
                onClick={handleBellClick}
              />
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {unreadCount}
                </div>
              )}
            </div>
            <button
              onClick={toggleDarkMode}
              className={`text-2xl focus:outline-none ml-4 ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            {user ? (
              <div className="relative navbar-user">
                <div
                  className="flex items-center space-x-2 cursor-pointer user-box"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div
                    className={`user-initials ${
                      darkMode
                        ? "bg-white text-gray-800"
                        : "bg-gray-800 text-white"
                    }`}
                  >
                    {getUserInitials(user)}
                  </div>
                  <span
                    className={`text-lg ${
                      darkMode ? "text-white" : "text-black"
                    }`}
                  >
                    <b>
                      {user.firstName} {user.lastName ? user.lastName : ""}
                    </b>
                  </span>
                </div>
                {dropdownOpen && (
                  <div
                    className={`dropdown-menu ${
                      darkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <NavLink
                      to="/EditProfile"
                      className={`block px-4 py-2 ${
                        darkMode
                          ? "hover:bg-gray-600 text-white"
                          : "hover:bg-gray-200 text-black"
                      }`}
                      onClick={() => setDropdownOpen(false)}
                    >
                      Edit Profile
                    </NavLink>
                    {user.role !== "admin" && (
                      <NavLink
                        to="/MyListings"
                        className={`block px-4 py-2 ${
                          darkMode
                            ? "hover:bg-gray-600 text-white"
                            : "hover:bg-gray-200 text-black"
                        }`}
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Reports
                      </NavLink>
                    )}

                    {user.role === "admin" ? (
                      <>
                        <NavLink
                          to="/AdminLogs"
                          className={`block px-4 py-2 ${
                            darkMode
                              ? "hover:bg-gray-600 text-white"
                              : "hover:bg-gray-200 text-black"
                          }`}
                          onClick={() => setDropdownOpen(false)}
                        >
                          Admin Logs
                        </NavLink>
                        <NavLink
                          to="/AllUsersLogs"
                          className={`block px-4 py-2 ${
                            darkMode
                              ? "hover:bg-gray-600 text-white"
                              : "hover:bg-gray-200 text-black"
                          }`}
                          onClick={() => setDropdownOpen(false)}
                        >
                          All Users Logs
                        </NavLink>
                      </>
                    ) : (
                      <NavLink
                        to="/UserLogs"
                        className={`block px-4 py-2 ${
                          darkMode
                            ? "hover:bg-gray-600 text-white"
                            : "hover:bg-gray-200 text-black"
                        }`}
                        onClick={() => setDropdownOpen(false)}
                      >
                        User Logs
                      </NavLink>
                    )}

                    <button
                      onClick={() => {
                        handleLogout();
                        setDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 ${
                        darkMode
                          ? "hover:bg-gray-600 text-white"
                          : "hover:bg-gray-200 text-black"
                      }`}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <NavLink
                  to="/signin"
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  Sign In
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`sidebar ${isSidebarOpen ? "open" : ""} ${
          darkMode
            ? "bg-gray-800 text-white border-r border-gray-700"
            : "bg-white text-black border-r border-gray-300"
        }`}
      >
        <div className="sidebar-content p-4">
          <button
            className={`close-sidebar text-lg ${
              darkMode
                ? "text-white hover:text-gray-400"
                : "text-black hover:text-gray-600"
            } transition duration-200 ease-in-out`}
            onClick={toggleSidebar}
          >
            ✖
          </button>
          <h1
            className={`py-4 text-2xl font-semibold ${
              darkMode
                ? "text-white border-b border-gray-700"
                : "text-black border-b border-gray-300"
            }`}
          >
            MENU
          </h1>

          <NavLink
            to="/"
            className={`nav-link block py-3 px-4 mt-4 rounded-md transition-colors duration-300 ease-in-out ${
              darkMode
                ? "text-white border-gray-700 hover:bg-gray-700 hover:text-gray-300"
                : "text-black border-gray-300 hover:bg-gray-200 hover:text-gray-800"
            }`}
            onClick={toggleSidebar}
          >
            HOME
          </NavLink>
          <NavLink
            to="/LostItems"
            className={`nav-link block py-3 px-4 mt-2 rounded-md transition-colors duration-300 ease-in-out border-t ${
              darkMode
                ? "text-white border-gray-700 hover:bg-gray-700 hover:text-gray-300"
                : "text-black border-gray-300 hover:bg-gray-200 hover:text-gray-800"
            }`}
            onClick={toggleSidebar}
          >
            LOST ITEMS
          </NavLink>
          <NavLink
            to="/FoundItems"
            className={`nav-link block py-3 px-4 mt-2 rounded-md transition-colors duration-300 ease-in-out border-t ${
              darkMode
                ? "text-white border-gray-700 hover:bg-gray-700 hover:text-gray-300"
                : "text-black border-gray-300 hover:bg-gray-200 hover:text-gray-800"
            }`}
            onClick={toggleSidebar}
          >
            FOUND ITEMS
          </NavLink>
          <NavLink
            to="/Report"
            className={`nav-link block py-3 px-4 mt-2 rounded-md transition-colors duration-300 ease-in-out border-t ${
              darkMode
                ? "text-white border-gray-700 hover:bg-gray-700 hover:text-gray-300"
                : "text-black border-gray-300 hover:bg-gray-200 hover:text-gray-800"
            }`}
            onClick={toggleSidebar}
          >
            REPORT
          </NavLink>

          {/* User-specific sidebar items */}
          {user && (
            <>
              <NavLink
                to="/EditProfile"
                className={`nav-link block py-3 px-4 mt-2 rounded-md transition-colors duration-300 ease-in-out border-t ${
                  darkMode
                    ? "text-white border-gray-700 hover:bg-gray-700 hover:text-gray-300"
                    : "text-black border-gray-300 hover:bg-gray-200 hover:text-gray-800"
                }`}
                onClick={toggleSidebar}
              >
                EDIT PROFILE
              </NavLink>

              {user.role === "admin" ? (
                <>
                  <NavLink
                    to="/VerificationPage"
                    className={`nav-link block py-3 px-4 mt-2 rounded-md transition-colors duration-300 ease-in-out border-t ${
                      darkMode
                        ? "text-white border-gray-700 hover:bg-gray-700 hover:text-gray-300"
                        : "text-black border-gray-300 hover:bg-gray-200 hover:text-gray-800"
                    }`}
                    onClick={toggleSidebar}
                  >
                    VERIFICATION
                  </NavLink>
                  <NavLink
                    to="/AdminLogs"
                    className={`nav-link block py-3 px-4 mt-2 rounded-md transition-colors duration-300 ease-in-out border-t ${
                      darkMode
                        ? "text-white border-gray-700 hover:bg-gray-700 hover:text-gray-300"
                        : "text-black border-gray-300 hover:bg-gray-200 hover:text-gray-800"
                    }`}
                    onClick={toggleSidebar}
                  >
                    ADMIN LOGS
                  </NavLink>
                  <NavLink
                    to="/AllUsersLogs"
                    className={`nav-link block py-3 px-4 mt-2 rounded-md transition-colors duration-300 ease-in-out border-t ${
                      darkMode
                        ? "text-white border-gray-700 hover:bg-gray-700 hover:text-gray-300"
                        : "text-black border-gray-300 hover:bg-gray-200 hover:text-gray-800"
                    }`}
                    onClick={toggleSidebar}
                  >
                    ALL USERS LOGS
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/Contactus"
                    className={`nav-link block py-3 px-4 mt-2 rounded-md transition-colors duration-300 ease-in-out border-t ${
                      darkMode
                        ? "text-white border-gray-700 hover:bg-gray-700 hover:text-gray-300"
                        : "text-black border-gray-300 hover:bg-gray-200 hover:text-gray-800"
                    }`}
                    onClick={toggleSidebar}
                  >
                    CONTACT US
                  </NavLink>
                  <NavLink
                    to="/MyListings"
                    className={`nav-link block py-3 px-4 mt-2 rounded-md transition-colors duration-300 ease-in-out border-t ${
                      darkMode
                        ? "text-white border-gray-700 hover:bg-gray-700 hover:text-gray-300"
                        : "text-black border-gray-300 hover:bg-gray-200 hover:text-gray-800"
                    }`}
                    onClick={toggleSidebar}
                  >
                    MY REPORTS
                  </NavLink>
                  <NavLink
                    to="/UserLogs"
                    className={`nav-link block py-3 px-4 mt-2 rounded-md transition-colors duration-300 ease-in-out border-t ${
                      darkMode
                        ? "text-white border-gray-700 hover:bg-gray-700 hover:text-gray-300"
                        : "text-black border-gray-300 hover:bg-gray-200 hover:text-gray-800"
                    }`}
                    onClick={toggleSidebar}
                  >
                    USER LOGS
                  </NavLink>
                </>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  toggleSidebar();
                }}
                className={`block w-full text-left py-3 px-4 mt-2 rounded-md transition-colors duration-300 ease-in-out border-t ${
                  darkMode
                    ? "text-white border-gray-700 hover:bg-gray-700 hover:text-gray-300"
                    : "text-black border-gray-300 hover:bg-gray-200 hover:text-gray-800"
                }`}
              >
                LOGOUT
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
