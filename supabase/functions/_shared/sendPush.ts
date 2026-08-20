const expoPushUrl = "https://exp.host/--/api/v2/push/send";

export async function sendPush({
  token,
  title,
  body,
  data,
}: {
  token: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}) {
  const response = await fetch(expoPushUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: token,
      title,
      body,
      sound: "default",
      data,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Expo push failed: ${JSON.stringify(result)}`);
  }

  return result;
}
