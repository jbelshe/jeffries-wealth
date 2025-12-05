// // services/loggingService.ts
import {LoggingSource} from '@/types/loggingsource';

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
    
      const error = await res.text();
      console.error(`[${source}] logClientData failed:`, error);
      throw new Error(`Logging failed: ${error}`);
    }

    console.log(res.json())
  } catch (err) {
    console.error(`[${source}] logClientData failed:`, err);
  }
}
