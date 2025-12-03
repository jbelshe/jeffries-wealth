
// This service handles sending data to your backend automation tools (Zapier, Make.com, etc.)
// This ensures compliance logging and CRM entry creation.

// TODO: Replace this URL with your actual Zapier/Make Webhook URL
// Example: 'https://hooks.zapier.com/hooks/catch/123456/abcde/'
const LOGGING_WEBHOOK_URL = import.meta.env.VITE_LOGGING_WEBHOOK_URL || '';

export const logClientData = async (source: 'WEALTH_SIMULATOR' | 'INTAKE_FORM' | 'NEWSLETTER', data: any) => {
  if (!LOGGING_WEBHOOK_URL) {
    console.warn("Logging Webhook URL is not set. Data was not sent to backend.");
    return;
  }

  const payload = {
    timestamp: new Date().toISOString(),
    source: source,
    ...data
  };

  try {
    // We use 'no-cors' mode often for simple webhooks to avoid CORS preflight issues 
    // depending on the provider (Zapier usually handles CORS well without it, but this is safer for generic endpoints)
    await fetch(LOGGING_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    console.log(`[${source}] Data logged successfully.`);
  } catch (error) {
    // We log the error but do not block the user experience
    console.error(`[${source}] Logging failed:`, error);
  }
};
