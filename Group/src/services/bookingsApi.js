const BOOKINGS_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL?.trim()) ||
  "http://localhost:5050";

export async function createBooking(payload, token) {
  let response;

  try {
    response = await fetch(`${BOOKINGS_BASE_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Cannot connect to the booking server. Make sure the backend is running on port 5050.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data;
}
