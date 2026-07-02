"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API_URL from "../../services/api";
import { estaAutenticado } from "../../utils/auth";

export default function LoginPage() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (estaAutenticado()) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setCargando(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.mensaje || "Credenciales incorrectas");
        setCargando(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-950 font-sans px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[100px]" />

      <div className="w-full max-w-md z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
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
                  d="M9.75 17L15 12l-5.25-5"
                />
              </svg>
            </span>

            <span className="text-2xl font-bold text-white">
              Help<span className="text-indigo-400">Desk</span>
            </span>
          </Link>

          <h2 className="text-2xl font-bold text-zinc-100">
            Bienvenido de nuevo
          </h2>

          <p className="text-sm text-zinc-400 mt-1">
            Inicia sesión para gestionar tus incidencias
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>

                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Correo Electrónico
              </label>

              <input
                type="email"
                placeholder="nombre@empresa.com"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Contraseña
              </label>

              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {cargando ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                  />
                </svg>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-zinc-800/80 pt-5">
            <p className="text-sm text-zinc-400">
              ¿No tienes una cuenta?{" "}
              <Link
                href="/register"
                className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}