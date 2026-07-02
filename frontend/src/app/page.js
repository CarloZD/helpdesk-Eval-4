"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { estaAutenticado } from "../utils/auth";

export default function Home() {
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    setAutenticado(estaAutenticado());
  }, []);

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white overflow-hidden flex flex-col font-sans">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
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
          <span className="text-xl font-bold tracking-tight">
            Help<span className="text-indigo-400">Desk</span>
          </span>
        </div>
        <div>
          {autenticado ? (
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
            >
              Ir al Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 active:scale-95 transition-all"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
        {/* Tagline */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20 mb-8 select-none">
          ⚡ Sistema Inteligente de Soporte Técnico
        </span>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
          Gestiona y Resuelve Incidencias con{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Velocidad Record
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed">
          Nuestra plataforma centralizada conecta a clientes, agentes de soporte y administradores para solucionar tickets de soporte técnico de forma ágil y transparente.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          {autenticado ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 text-base font-semibold shadow-lg shadow-indigo-500/25 hover:opacity-95 active:scale-95 transition-all"
            >
              Acceder a mi Cuenta
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 text-base font-semibold shadow-lg shadow-indigo-500/25 hover:opacity-95 active:scale-95 transition-all"
              >
                Comenzar Ahora
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 px-8 text-base font-semibold hover:border-zinc-700 active:scale-95 transition-all"
              >
                Registrar un Agente
              </Link>
            </>
          )}
        </div>

        {/* Features grid */}
        <div className="mt-20 w-full grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="rounded-2xl border border-zinc-900 bg-zinc-900/20 p-6 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Tickets Organizados</h3>
            <p className="mt-2 text-sm text-zinc-400">Creación rápida de tickets e historiales de comentarios completos con línea de tiempo.</p>
          </div>
          <div className="rounded-2xl border border-zinc-900 bg-zinc-900/20 p-6 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0 1 10.089 18H8.25c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h1.839A9.74 9.74 0 0 0 9 12.003c0-1.159.2-2.27.568-3.303M15 19.128A11.387 11.387 0 0 1 8.25 18a11.378 11.378 0 0 1-5.875-1.625" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Asignación Directa</h3>
            <p className="mt-2 text-sm text-zinc-400">Los administradores pueden derivar tickets a soportes dedicados en segundos con un click.</p>
          </div>
          <div className="rounded-2xl border border-zinc-900 bg-zinc-900/20 p-6 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Roles y Permisos</h3>
            <p className="mt-2 text-sm text-zinc-400">Paneles personalizados e información restringida garantizando la seguridad de tu información.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between text-zinc-600 text-xs border-t border-zinc-900 mt-20">
        <p>&copy; {new Date().getFullYear()} HelpDesk. Todos los derechos reservados.</p>
        <p>Hecho con Next.js & Tailwind CSS v4</p>
      </footer>
    </div>
  );
}
