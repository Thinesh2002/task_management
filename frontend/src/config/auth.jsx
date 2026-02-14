import { jwtDecode } from "jwt-decode";

export const USER_KEY = "user";
export const TOKEN_KEY = "token";

function emitAuthChange() {
  try {
    window.dispatchEvent(new Event("auth_change"));
  } catch {}
}

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? safeParse(raw) : null;
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isTokenExpired() {
  const token = getAuthToken();
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
}

export function setStoredUser(user) {
  if (!user) localStorage.removeItem(USER_KEY);
  else localStorage.setItem(USER_KEY, JSON.stringify(user));
  emitAuthChange();
}

export function setAuthToken(token) {
  if (!token) localStorage.removeItem(TOKEN_KEY);
  else localStorage.setItem(TOKEN_KEY, token);
  emitAuthChange();
}

export function storeAuth(user, token) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (token) localStorage.setItem(TOKEN_KEY, token);
  emitAuthChange();
}

export function clearAuth() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  emitAuthChange();
}

export function logout() {
  clearAuth();
}

export function getUserRole() {
  const user = getStoredUser();
  return user?.role || null;
}

export function hasRole(roles = []) {
  const role = getUserRole();
  return roles.includes(role);
}

export function isAuthenticated() {
  const token = getAuthToken();
  if (!token) return false;

  return !isTokenExpired();
}

export const getUser = getStoredUser;
export const getToken = getAuthToken;
export const setUser = setStoredUser;
export const setToken = setAuthToken;
