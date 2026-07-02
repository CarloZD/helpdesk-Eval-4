"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API_URL from "../../services/api";
import { estaAutenticado } from "../../utils/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("CLIENTE");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  // Redirigir al dashboard si ya está autenticado
  useEffect(() => {
    if (estaAutenticado()) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");
    setCargando(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          correo,
          password,
          rol,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.mensaje || "Error al registrar el usuario");
        setCargando(false);
        return;
      }

      setExito("Usuario registrado con éxito. Redirigiendo al inicio de sesión...");
      setCargando(false);

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      setError("Error de conexión con el servidor");
      setCargando(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-950 font-sans px-4 overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 group mb-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5.5 w-5.5 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 21l8.982-8.982M18 13.612l.19-.19a4.243 4.243 0 0 0-6-6l-.19.19m6 6-1.127 1.128M18 13.612l-1.127-1.127M12 7.625l.707-.707a4.243 4.243 0 1 1 6 6l-.707.707M6 18a2.25 2.25 0 0 1-2.25-2.25V9A2.25 2.25 0 0 1 6 6.75h3"
                />
              </svg>
            </span>
            <span className="text-2xl font-bold tracking-tight text-white">
              Help<span className="text-indigo-400">Desk</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-zinc-100">Crear una cuenta</h2>
          <p className="text-sm text-zinc-400 mt-1">Regístrate para empezar a dar o recibir soporte</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 flex items-start gap-2 animate-shake">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 mt-0.5 shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {exito && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-400 flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 mt-0.5 shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{exito}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                placeholder="Juan Pérez"
                required
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                placeholder="nombre@ejemplo.com"
                required
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Selecciona tu Rol
              </label>
              <select
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all appearance-none cursor-pointer"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
              >
                <option value="CLIENTE" className="bg-zinc-900 text-white">Cliente (Tengo problemas técnicos)</option>
                <option value="SOPORTE" className="bg-zinc-900 text-white">Soporte (Resolveré incidencias)</option>
                <option value="ADMIN" className="bg-zinc-900 text-white">Administrador (Gestionar sistema)</option>
              </select>
            </div>

            <button
              disabled={cargando}
              className="w-full flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 cursor-pointer mt-2"
            >
              {cargando ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Registrarse"
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-zinc-800/80 pt-5">
            <p className="text-sm text-zinc-400">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/login"
                className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
