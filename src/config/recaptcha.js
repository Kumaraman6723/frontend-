// reCAPTCHA Configuration
export const RECAPTCHA_CONFIG = {
  // Replace with your actual reCAPTCHA v3 site key
  SITE_KEY:
    
    "6LcTo5QrAAAAAJRHYqu4QXmLfaYi8g5lpeLwbD9W",
  // For development, you can directly set your site key here:
  // SITE_KEY: "your_actual_site_key_here",
};

export const getRecaptchaSiteKey = () => {
  return RECAPTCHA_CONFIG.SITE_KEY;
};
