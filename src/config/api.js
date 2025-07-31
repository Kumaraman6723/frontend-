// API Configuration
export const API_CONFIG = {
  // Backend API Base URL
  BASE_URL: "https://backend-hrby.onrender.com",

  // API Endpoints
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      SEND_OTP: "/api/auth/send-otp",
      VERIFY_OTP: "/api/auth/verify-otp",
      DIRECT_LOGIN: "/api/auth/direct-login",
      CHECK_VERIFICATION: "/api/auth/check-verification",
    },

    // Reports endpoints
    REPORTS: {
      BASE: "/api/reports",
      USER_REPORTS: "/api/reports/user",
      SEND_OTP: "/api/reports/send-otp",
      VERIFY: "/api/reports/verify",
      RESET: "/api/reports/reset",
      CLAIM: "/api/reports/claim",
      NOTIFICATION_READ: "/api/reports/notification/read",
    },

    // User endpoints
    USERS: {
      UPDATE: "/api/users",
    },

    // Logs endpoints
    LOGS: {
      USER_LOGS: "/api/logs/user-logs",
      ADMIN_LOGS: "/api/logs/admin-logs",
    },

    // Contact endpoint
    CONTACT: "/api/contact",
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth endpoint
export const getAuthUrl = (endpoint) => {
  return getApiUrl(API_CONFIG.ENDPOINTS.AUTH[endpoint]);
};

// Helper function to get reports endpoint
export const getReportsUrl = (endpoint) => {
  return getApiUrl(API_CONFIG.ENDPOINTS.REPORTS[endpoint]);
};

// Helper function to get logs endpoint
export const getLogsUrl = (endpoint) => {
  return getApiUrl(API_CONFIG.ENDPOINTS.LOGS[endpoint]);
};
