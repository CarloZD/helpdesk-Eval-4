"use client";

import { jwtDecode } from "jwt-decode";

export function esBrowser() {
  return typeof window !== "undefined";
}

export function obtenerToken() {
  if (!esBrowser()) return null;
  return localStorage.getItem("token");
}

export function obtenerUsuario() {
  if (!esBrowser()) return null;
  const userStr = localStorage.getItem("usuario");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (error) {
    return null;
  }
}

export function iniciarSesion(token, usuario) {
  if (!esBrowser()) return;
  localStorage.setItem("token", token);
  localStorage.setItem("usuario", JSON.stringify(usuario));
}

export function cerrarSesion() {
  if (!esBrowser()) return;
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  window.location.href = "/login";
}

export function estaAutenticado() {
  const token = obtenerToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    // Si el token expiró
    if (decoded.exp && decoded.exp < currentTime) {
      cerrarSesion();
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}
