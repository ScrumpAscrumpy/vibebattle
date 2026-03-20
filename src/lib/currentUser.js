import { apiRequest, getStoredCurrentUser, setStoredCurrentUser } from "./apiClient";

export function readCurrentUser() {
  return getStoredCurrentUser();
}

export async function switchCurrentUser(role) {
  const response = await apiRequest(`/api/users/me?role=${role}`, {
    skipUserHeader: true,
  });
  setStoredCurrentUser(response.data);
  return response.data;
}

export function isBuyer() {
  return readCurrentUser()?.role === "BUYER";
}
