// // services/loggingService.ts
export type LoggingSource = 'WEALTH_SIMULATOR' | 'INTAKE_FORM' | 'NEWSLETTER'; 

export async function logClientData(
  source: LoggingSource,
  data: any
): Promise<void> {
  try {
    const res = await fetch('/api/logClientData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, data }),
    });

    if (!res.ok) {
      console.warn(`[${source}] logClientData returned ${res.status}`);
    }
  } catch (err) {
    console.error(`[${source}] logClientData failed:`, err);
  }
}
