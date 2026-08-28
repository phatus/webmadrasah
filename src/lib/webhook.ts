export async function dispatchWebhook(event: string, data: any) {
  const url = process.env.ELEARNING_WEBHOOK_URL || "http://localhost:3002/api/webhooks/webmadrasah";
  const secret = process.env.WEBHOOK_SECRET || "madrasah-elearning-secret-key-2026";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-secret": secret,
      },
      body: JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        data,
      }),
      // Set short timeout so webhook dispatch won't block UI if Elearning is offline
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`Webhook ${event} returned status ${response.status}: ${errText}`);
      return { success: false, status: response.status, error: errText };
    }

    const resJson = await response.json();
    return { success: true, data: resJson };
  } catch (err: any) {
    console.warn(`Failed to dispatch webhook ${event}:`, err.message);
    return { success: false, error: err.message };
  }
}
