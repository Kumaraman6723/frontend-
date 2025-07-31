// reCAPTCHA Configuration
export const RECAPTCHA_CONFIG = {
  // reCAPTCHA v3 site key
  SITE_KEY:
    process.env.REACT_APP_RECAPTCHA_SITE_KEY ||
    "6LcTo5QrAAAAAJRHYqu4QXmLfaYi8g5lpeLwbD9W",
};

export const getRecaptchaSiteKey = () => {
  return RECAPTCHA_CONFIG.SITE_KEY;
};
