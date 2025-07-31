# Frontend Authentication Update

## Overview

The frontend has been updated to remove Google Sign-In and implement a new email-based authentication system with reCAPTCHA v3 and OTP verification.

## Changes Made

### 1. Removed Google Sign-In

- Removed `@react-oauth/google` dependency from `package.json`
- Removed Google OAuth components and logic from `NavBar.jsx`
- Removed role selector dropdown (roles are now automatically determined by email domain)

### 2. New Authentication System

- **Email-based login**: Users enter their email address
- **Automatic role detection**:
  - Admin emails: `kumarprasadaman1234@gmail.com`, `drizzle003.ace@gmail.com`
  - User emails: `@ncuindia.edu` domain or `study.drizzle@gmail.com`
- **reCAPTCHA v3 integration**: Invisible verification for all login attempts
- **OTP verification**: 6-digit OTP sent to email for first-time users
- **Direct login**: Verified users can login directly without OTP

### 3. Updated Components

#### `src/pages/SigninPage/Section1.jsx`

- Complete rewrite with new authentication flow
- Email input with domain validation
- OTP sending and verification
- Direct login for verified users
- reCAPTCHA v3 integration
- Loading states and error handling

#### `src/pages/HomePage/NavBar.jsx`

- Removed Google OAuth components
- Removed role selector
- Updated login button to redirect to signin page
- Simplified user state management

#### `src/config/recaptcha.js`

- New configuration file for reCAPTCHA settings
- Centralized site key management

## Setup Instructions

### 1. reCAPTCHA Configuration

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Create a new site with reCAPTCHA v3
3. Add your domain(s) to the allowed domains
4. Copy the site key
5. Update `src/config/recaptcha.js`:
   ```javascript
   export const RECAPTCHA_CONFIG = {
     SITE_KEY: "your_actual_site_key_here",
   };
   ```

### 2. Backend Environment Variables

Ensure your backend has these environment variables:

```env
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
MAIL_USER=your_gmail_address
MAIL_PASS=your_gmail_app_password
JWT_SECRET=your_jwt_secret
```

### 3. Email Configuration

The system uses Gmail SMTP for sending OTP emails. Make sure:

- Gmail account has 2-factor authentication enabled
- App password is generated and used in `MAIL_PASS`
- Email templates are properly configured

## Authentication Flow

### First-time Users

1. Enter email address
2. System checks if user exists and is verified
3. If not verified, "Send OTP" button appears
4. Click "Send OTP" (requires reCAPTCHA verification)
5. Enter 6-digit OTP received via email
6. Click "Verify OTP" (requires reCAPTCHA verification)
7. User is created/verified and logged in

### Returning Users

1. Enter email address
2. System detects user is verified
3. "Login" button appears
4. Click "Login" (requires reCAPTCHA verification)
5. User is logged in directly

## Security Features

- **reCAPTCHA v3**: Invisible bot protection
- **Email domain validation**: Ensures proper email domains for each role
- **OTP expiration**: 5-minute expiration for OTP codes
- **JWT tokens**: 7-day expiration for authentication tokens
- **Role-based access**: Automatic role assignment based on email domain

## Error Handling

- Invalid email domains
- OTP expiration
- reCAPTCHA verification failures
- Network errors
- User not found/not verified

## Testing

1. Test with admin emails (should get admin role)
2. Test with @ncuindia.edu emails (should get user role)
3. Test first-time user flow (OTP verification)
4. Test returning user flow (direct login)
5. Test error scenarios (invalid OTP, expired OTP, etc.)

## Notes

- The system automatically handles role assignment based on email domains
- No manual role selection is required
- OTP is only required for first-time verification
- All subsequent logins are direct (with reCAPTCHA)
- The backend already has all the necessary endpoints implemented
