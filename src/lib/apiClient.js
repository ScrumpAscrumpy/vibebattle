const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:4000";
const CURRENT_USER_STORAGE_KEY = "vibebattle.currentUser";

export class ApiError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export async function apiRequest(path, options = {}) {
  return performRequest(path, options, true);
}

async function performRequest(path, options = {}, allowRetry = false) {
  const currentUser = getStoredCurrentUser();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(!options.skipUserHeader && currentUser?.id ? { "x-user-id": currentUser.id } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    if (
      allowRetry &&
      currentUser?.id &&
      payload?.error?.details?.code === "USER_NOT_FOUND"
    ) {
      clearStoredCurrentUser();
      return performRequest(path, { ...options, skipUserHeader: true }, false);
    }

    const message = payload?.error?.message || "请求失败，请稍后重试。";
    throw new ApiError(message, response.status, payload?.error?.details || null);
  }

  return payload;
}

export function getStoredCurrentUser() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredCurrentUser(user) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredCurrentUser() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}

export { API_BASE_URL };
