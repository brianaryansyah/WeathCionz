export const SecurityLogger = {
  logAuthEvent: (status) => {
    const timestamp = new Date().toISOString();
    console.warn(`[SECURITY] ${timestamp} - Auth Attempt: ${status}`);
    // In production, send this to a monitoring service like Sentry or Datadog
  },
  logSuspiciousActivity: (event) => {
    const timestamp = new Date().toISOString();
    console.error(`[SECURITY] ${timestamp} - Suspicious Activity Detected: ${event}`);
  }
};
