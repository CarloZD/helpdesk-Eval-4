"use client";

import { useEffect, useState } from "react";
import { obtenerUsuario, cerrarSesion } from "../utils/auth";
import Link from "next/link";

export default function Navbar() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    setUsuario(obtenerUsuario());
  }, []);

  if (!usuario) return null;

  // Custom colors for role badges
  const badgeStyles = {
    ADMIN: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    SOPORTE: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    CLIENTE: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand/Logo */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20 transition-all group-hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 21l8.982-8.982M18 13.612l.19-.19a4.243 4.243 0 0 0-6-6l-.19.19m6 6-1.127 1.128M18 13.612l-1.127-1.127M12 7.625l.707-.707a4.243 4.243 0 1 1 6 6l-.707.707M6 18a2.25 2.25 0 0 1-2.25-2.25V9A2.25 2.25 0 0 1 6 6.75h3"
                />
              </svg>
            </span>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Help<span className="text-indigo-500">Desk</span>
            </span>
          </Link>
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {usuario.nombre}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {usuario.correo}
            </span>
          </div>

          {/* Role Badge */}
          <span
            className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
              badgeStyles[usuario.rol] || "bg-zinc-100 text-zinc-800"
            }`}
          >
            {usuario.rol}
          </span>

          <span className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />

          {/* Logout Button */}
          <button
            onClick={cerrarSesion}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 hover:text-zinc-900 active:scale-95 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
            title="Cerrar sesión"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4.5 w-4.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
              />
            </svg>
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
}
