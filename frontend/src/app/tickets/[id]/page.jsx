"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { obtenerUsuario, obtenerToken, estaAutenticado } from "../../../utils/auth";
import API_URL from "../../../services/api";
import Navbar from "../../../components/Navbar";
import Link from "next/link";

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id;

  const [usuario, setUsuario] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados para nuevo comentario
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);

  // Estados para cambiar estado
  const [estadoSelect, setEstadoSelect] = useState("");
  const [guardandoEstado, setGuardandoEstado] = useState(false);

  useEffect(() => {
    if (!estaAutenticado()) {
      router.push("/login");
      return;
    }

    const usr = obtenerUsuario();
    setUsuario(usr);
    cargarTicketYComentarios(usr);
  }, [ticketId, router]);

  const cargarTicketYComentarios = async (usr) => {
    setCargando(true);
    const token = obtenerToken();

    try {
      // 1. Obtener detalles del ticket
      const resTicket = await fetch(`${API_URL}/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resTicket.ok) {
        if (resTicket.status === 403) {
          alert("No tienes permiso para acceder a este ticket.");
          router.push("/dashboard");
          return;
        }
        if (resTicket.status === 404) {
          alert("El ticket no existe.");
          router.push("/dashboard");
          return;
        }
        throw new Error("Error al cargar ticket");
      }

      const dataTicket = await resTicket.json();
      setTicket(dataTicket);
      setEstadoSelect(dataTicket.estado);

      // 2. Obtener comentarios
      const resComs = await fetch(`${API_URL}/tickets/${ticketId}/comentarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resComs.ok) {
        const dataComs = await resComs.json();
        setComentarios(Array.isArray(dataComs) ? dataComs : []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const handleAgregarComentario = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;
    setEnviandoComentario(true);
    const token = obtenerToken();

    try {
      const res = await fetch(`${API_URL}/tickets/${ticketId}/comentarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comentario: nuevoComentario }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Error al enviar comentario");
      }

      setNuevoComentario("");
      // Recargar comentarios
      const resComs = await fetch(`${API_URL}/tickets/${ticketId}/comentarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resComs.ok) {
        const dataComs = await resComs.json();
        setComentarios(dataComs);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setEnviandoComentario(false);
    }
  };

  const handleCambiarEstado = async (nuevoEstado) => {
    setEstadoSelect(nuevoEstado);
    setGuardandoEstado(true);
    const token = obtenerToken();

    try {
      const res = await fetch(`${API_URL}/tickets/${ticketId}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Error al cambiar estado");
      }

      // Recargar datos para actualizar historial y datos de estado
      await cargarTicketYComentarios();
    } catch (error) {
      alert(error.message);
      // Revertir estado select
      if (ticket) setEstadoSelect(ticket.estado);
    } finally {
      setGuardandoEstado(false);
    }
  };

  // Badge styles
  const stateBadges = {
    PENDIENTE: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-500/10",
    EN_PROCESO: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-500/10",
    RESUELTO: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-500/10",
    CERRADO: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400 border border-zinc-500/10",
  };

  // Helper formats
  const formatearFecha = (dateStr) => {
    return new Date(dateStr).toLocaleString("es-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (cargando || !usuario || !ticket) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
        <svg
          className="animate-spin h-10 w-10 text-indigo-500"
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
        <span className="mt-4 text-zinc-400 font-medium">Cargando detalles del ticket...</span>
      </div>
    );
  }

  // Permiso para comentar (parseInt para evitar discrepancias de tipos string/number)
  const uid = parseInt(usuario.id);
  const puedeComentar =
    usuario.rol === "ADMIN" ||
    (usuario.rol === "SOPORTE" && parseInt(ticket.soporte_id) === uid) ||
    (usuario.rol === "CLIENTE" && parseInt(ticket.cliente_id) === uid);

  // Permiso para cambiar estado
  const puedeCambiarEstado =
    usuario.rol === "ADMIN" ||
    (usuario.rol === "SOPORTE" && parseInt(ticket.soporte_id) === uid);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Back Button */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver al Panel
          </Link>
        </div>

        {/* Ticket Header & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main info card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5 mb-5">
                <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Ticket #{ticket.id}
                </span>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${stateBadges[ticket.estado]}`}>
                  {ticket.estado.replace("_", " ")}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-tight">
                {ticket.titulo}
              </h1>

              <div className="mt-6 text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {ticket.descripcion}
              </div>
            </div>

            {/* Comments timeline */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-xl font-bold tracking-tight mb-6">Historial de Comentarios</h2>

              {comentarios.length === 0 ? (
                <p className="text-zinc-500 dark:text-zinc-400 text-sm italic py-4 text-center">
                  No hay comentarios aún en este ticket.
                </p>
              ) : (
                <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
                  {comentarios.map((c) => {
                    const isAuthorSupport = c.Usuario?.rol === "SOPORTE";
                    const isAuthorAdmin = c.Usuario?.rol === "ADMIN";

                    return (
                      <div key={c.id} className="relative pl-10">
                        {/* Dot indicator on timeline */}
                        <span className={`absolute left-2.5 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-400 ${
                          isAuthorAdmin ? "bg-rose-500" : isAuthorSupport ? "bg-blue-500" : "bg-emerald-500"
                        }`} />

                        <div className="rounded-xl bg-zinc-50 p-4 border border-zinc-200/50 dark:bg-zinc-950 dark:border-zinc-800/50">
                          <div className="flex items-center justify-between gap-4 flex-wrap border-b border-zinc-200/60 dark:border-zinc-800/60 pb-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                {c.Usuario?.nombre}
                              </span>
                              <span className={`inline-flex rounded px-1.5 py-0.2 text-[10px] font-semibold uppercase ${
                                isAuthorAdmin
                                  ? "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300"
                                  : isAuthorSupport
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                              }`}>
                                {c.Usuario?.rol}
                              </span>
                            </div>
                            <span className="text-[11px] text-zinc-400 font-medium">
                              {formatearFecha(c.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                            {c.comentario}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add comment form */}
              {puedeComentar ? (
                <form onSubmit={handleAgregarComentario} className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 space-y-4">
                  <textarea
                    placeholder="Escribe tu comentario o actualización..."
                    required
                    rows={3}
                    className="w-full bg-zinc-50 border border-zinc-300 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all dark:bg-zinc-950 dark:border-zinc-800 dark:text-white resize-none"
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <button
                      disabled={enviandoComentario}
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:scale-100 cursor-pointer"
                    >
                      {enviandoComentario ? "Enviando..." : "Comentar"}
                    </button>
                  </div>
                </form>
              ) : (
                <p className="mt-8 text-center text-xs italic text-zinc-500 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                  No tienes permisos para agregar comentarios en este ticket (no eres el cliente creador ni el soporte asignado).
                </p>
              )}
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="space-y-6">
            {/* Status Manager Card */}
            {puedeCambiarEstado && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">
                  Estado del Ticket
                </h3>
                <div className="space-y-4">
                  <select
                    disabled={guardandoEstado}
                    value={estadoSelect}
                    onChange={(e) => handleCambiarEstado(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-sm text-zinc-900 outline-none transition-all dark:bg-zinc-950 dark:border-zinc-800 dark:text-white cursor-pointer"
                  >
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="EN_PROCESO">EN PROCESO</option>
                    <option value="RESUELTO">RESUELTO</option>
                    <option value="CERRADO">CERRADO</option>
                  </select>
                  {guardandoEstado && (
                    <span className="text-xs text-indigo-400 flex items-center gap-1.5 animate-pulse">
                      <svg className="animate-spin h-3.5 w-3.5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Actualizando estado...
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* People Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Reportado Por
                </h4>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-zinc-950 dark:text-white">
                    {ticket.cliente?.nombre}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {ticket.cliente?.correo}
                  </span>
                </div>
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Soporte Asignado
                </h4>
                {ticket.soporte ? (
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-zinc-950 dark:text-white">
                      {ticket.soporte.nombre}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {ticket.soporte.correo}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs italic text-zinc-400">Sin asignar aún</span>
                )}
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Fecha de Reporte
                </h4>
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {formatearFecha(ticket.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
