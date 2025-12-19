
// This service handles sending data to your backend for compliance logging and CRM entry creation.
// Primary route: /api/audit (Transitioning to server-side handling)
// Fallback route: Zapier Webhook (Minimized payload for compliance)

const FALLBACK_ZAPIER_URL = (typeof process !== 'undefined' && process.env.VITE_LOGGING_WEBHOOK_URL) || '';

export const logClientData = async (source: 'WEALTH_SIMULATOR' | 'INTAKE_FORM' | 'NEWSLETTER', data: any) => {
  const clientTimestamp = new Date().toISOString();

  // Primary Attempt: POST to /api/audit
  try {
    const primaryResponse = await fetch('/api/audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source,
        clientTimestamp,
        ...data
      }),
    });

    if (primaryResponse.ok) {
      console.log(`[${source}] Primary logging successful.`);
      return;
    }
  } catch (error) {
    console.error(`[${source}] Primary logging failed, attempting fallback:`, error);
  }

  // Fallback Attempt: POST to Zapier Webhook
  if (FALLBACK_ZAPIER_URL) {
    try {
      // Construct minimized payload to reduce sensitivity in third-party logs
      // Excludes raw_input and full derived objects
      const fallbackPayload: any = {
        timestamp: clientTimestamp,
        source: source,
      };

      // Whitelist of allowed fields for fallback
      const whitelist = ['lead', 'keyFacts', 'presentedAlertIds', 'engineVersion', 'versions'];
      whitelist.forEach(key => {
        if (data[key] !== undefined) {
          fallbackPayload[key] = data[key];
        }
      });

      await fetch(FALLBACK_ZAPIER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fallbackPayload),
      });
      console.log(`[${source}] Fallback logging successful.`);
    } catch (fallbackError) {
      // Fail gracefully without blocking UX
      console.error(`[${source}] Fallback logging failed:`, fallbackError);
    }
  } else {
    console.warn(`[${source}] No fallback URL configured.`);
  }
};
