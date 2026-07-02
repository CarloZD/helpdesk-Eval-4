"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { obtenerUsuario, obtenerToken, estaAutenticado } from "../../utils/auth";
import API_URL from "../../services/api";
import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // Solo para ADMIN
  const [soporteList, setSoporteList] = useState([]); // Solo para ADMIN
  const [cargando, setCargando] = useState(true);

  // Estados para creación de ticket (CLIENTE)
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [creandoTicket, setCreandoTicket] = useState(false);
  const [errorTicket, setErrorTicket] = useState("");

  useEffect(() => {
    if (!estaAutenticado()) {
      router.push("/login");
      return;
    }

    const usr = obtenerUsuario();
    setUsuario(usr);
    cargarDatos(usr);
  }, [router]);

  const cargarDatos = async (usr) => {
    setCargando(true);
    const token = obtenerToken();

    try {
      // 1. Cargar estadísticas según rol
      const endpointStats =
        usr.rol === "ADMIN"
          ? "admin"
          : usr.rol === "SOPORTE"
          ? "soporte"
          : "cliente";

      const resStats = await fetch(`${API_URL}/dashboard/${endpointStats}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataStats = await resStats.json();
      setEstadisticas(dataStats);

      // 2. Cargar tickets
      const resTickets = await fetch(`${API_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataTickets = await resTickets.json();
      setTickets(Array.isArray(dataTickets) ? dataTickets : []);

      // 3. Cargar usuarios (Solo ADMIN)
      if (usr.rol === "ADMIN") {
        const resUsers = await fetch(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataUsers = await resUsers.json();
        setUsuarios(Array.isArray(dataUsers) ? dataUsers : []);
        setSoporteList(
          Array.isArray(dataUsers)
            ? dataUsers.filter((u) => u.rol === "SOPORTE")
            : []
        );
      }
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
    } finally {
      setCargando(false);
    }
  };

  // Crear un ticket (CLIENTE)
  const handleCrearTicket = async (e) => {
    e.preventDefault();
    setErrorTicket("");
    setCreandoTicket(true);
    const token = obtenerToken();

    try {
      const res = await fetch(`${API_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: nuevoTitulo,
          descripcion: nuevaDescripcion,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.mensaje || "Error al crear ticket");
      }

      setNuevoTitulo("");
      setNuevaDescripcion("");
      setModalAbierto(false);
      // Recargar datos
      await cargarDatos(usuario);
    } catch (err) {
      setErrorTicket(err.message);
    } finally {
      setCreandoTicket(false);
    }
  };

  // Asignar soporte a un ticket (ADMIN)
  const handleAsignarSoporte = async (ticketId, soporteId) => {
    if (!soporteId) return;
    const token = obtenerToken();

    try {
      const res = await fetch(`${API_URL}/tickets/${ticketId}/asignar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ soporte_id: parseInt(soporteId) }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.mensaje || "Error al asignar soporte");
        return;
      }

      // Recargar datos
      await cargarDatos(usuario);
    } catch (error) {
      console.error(error);
    }
  };

  // Eliminar ticket (ADMIN)
  const handleEliminarTicket = async (ticketId) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este ticket?")) return;
    const token = obtenerToken();

    try {
      const res = await fetch(`${API_URL}/tickets/${ticketId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.mensaje || "Error al eliminar");
        return;
      }

      await cargarDatos(usuario);
    } catch (error) {
      console.error(error);
    }
  };

  // Eliminar usuario (ADMIN)
  const handleEliminarUsuario = async (userId) => {
    if (userId === usuario.id) {
      alert("No puedes eliminarte a ti mismo.");
      return;
    }
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;
    const token = obtenerToken();

    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.mensaje || "Error al eliminar usuario");
        return;
      }

      await cargarDatos(usuario);
    } catch (error) {
      console.error(error);
    }
  };

  // Badges de estado del ticket
  const stateBadges = {
    PENDIENTE: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-500/10",
    EN_PROCESO: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-500/10",
    RESUELTO: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-500/10",
    CERRADO: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400 border border-zinc-500/10",
  };

  if (cargando || !usuario) {
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
        <span className="mt-4 text-zinc-400 font-medium">Cargando panel de control...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Panel de Control</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">
              Bienvenido de nuevo, {usuario.nombre}. Aquí tienes un resumen de la actividad.
            </p>
          </div>
          {usuario.rol === "CLIENTE" && (
            <button
              onClick={() => setModalAbierto(true)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Crear Ticket
            </button>
          )}
        </div>

        {/* Stats Grid */}
        {estadisticas && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              titulo="Total Tickets"
              valor={estadisticas.totalTickets}
              tipo="total"
            />
            <DashboardCard
              titulo="Tickets Pendientes"
              valor={estadisticas.pendientes}
              tipo="pendiente"
            />
            <DashboardCard
              titulo="En Proceso"
              valor={estadisticas.enProceso}
              tipo="proceso"
            />
            <DashboardCard
              titulo={usuario.rol === "ADMIN" ? "Resueltos" : "Mis Resueltos"}
              valor={estadisticas.resueltos}
              tipo="resuelto"
            />
          </div>
        )}

        {/* Tickets Section */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-bold tracking-tight mb-6">Listado de Tickets</h2>

          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                />
              </svg>
              <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">No hay tickets registrados</h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {usuario.rol === "CLIENTE"
                  ? "Crea un ticket para reportar un problema técnico."
                  : "No hay tickets asignados a tu cuenta."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-xs">
                    <th className="py-4 px-3">ID</th>
                    <th className="py-4 px-3">Título</th>
                    {usuario.rol !== "CLIENTE" && <th className="py-4 px-3">Cliente</th>}
                    <th className="py-4 px-3">Soporte Asignado</th>
                    <th className="py-4 px-3">Estado</th>
                    <th className="py-4 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="py-4 px-3 font-semibold text-zinc-500">#{t.id}</td>
                      <td className="py-4 px-3 font-semibold text-zinc-950 dark:text-zinc-100">{t.titulo}</td>
                      {usuario.rol !== "CLIENTE" && (
                        <td className="py-4 px-3">
                          <div className="flex flex-col">
                            <span>{t.cliente?.nombre}</span>
                            <span className="text-xs text-zinc-500">{t.cliente?.correo}</span>
                          </div>
                        </td>
                      )}
                      <td className="py-4 px-3">
                        {t.soporte ? (
                          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            {t.soporte.nombre}
                          </span>
                        ) : usuario.rol === "ADMIN" ? (
                          <select
                            onChange={(e) => handleAsignarSoporte(t.id, e.target.value)}
                            className="bg-zinc-100 border border-zinc-300 rounded-lg px-2 py-1 text-xs outline-none dark:bg-zinc-800 dark:border-zinc-700 cursor-pointer"
                            defaultValue=""
                          >
                            <option value="" disabled>Asignar Agente...</option>
                            {soporteList.map((s) => (
                              <option key={s.id} value={s.id}>{s.nombre}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-xs italic text-zinc-400">Sin asignar</span>
                        )}
                      </td>
                      <td className="py-4 px-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${stateBadges[t.estado]}`}>
                          {t.estado.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/tickets/${t.id}`}
                            className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 px-3 text-xs font-semibold hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-white"
                          >
                            Ver Detalles
                          </Link>
                          {usuario.rol === "ADMIN" && (
                            <button
                              onClick={() => handleEliminarTicket(t.id)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 cursor-pointer"
                              title="Eliminar ticket"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Users Section (Only ADMIN) */}
        {usuario.rol === "ADMIN" && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-xl font-bold tracking-tight mb-6">Gestión de Usuarios</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-xs">
                    <th className="py-4 px-3">ID</th>
                    <th className="py-4 px-3">Nombre</th>
                    <th className="py-4 px-3">Correo</th>
                    <th className="py-4 px-3">Rol</th>
                    <th className="py-4 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {usuarios.map((u) => (
                    <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="py-4 px-3 font-semibold text-zinc-500">#{u.id}</td>
                      <td className="py-4 px-3 font-semibold text-zinc-950 dark:text-zinc-100">{u.nombre}</td>
                      <td className="py-4 px-3 text-zinc-600 dark:text-zinc-400">{u.correo}</td>
                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${
                            u.rol === "ADMIN"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
                              : u.rol === "SOPORTE"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                          }`}
                        >
                          {u.rol}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right">
                        <button
                          onClick={() => handleEliminarUsuario(u.id)}
                          disabled={u.id === usuario.id}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                          title="Eliminar usuario"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal Crear Ticket (CLIENTE) */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6">
              <h3 className="text-xl font-bold tracking-tight">Crear Nuevo Ticket</h3>
              <button
                onClick={() => setModalAbierto(false)}
                className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCrearTicket} className="space-y-5">
              {errorTicket && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
                  {errorTicket}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Título de la Incidencia
                </label>
                <input
                  type="text"
                  placeholder="Ej. Problemas con acceso a la red interna"
                  required
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all dark:bg-zinc-950 dark:border-zinc-800 dark:text-white"
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Descripción Detallada
                </label>
                <textarea
                  placeholder="Describe detalladamente cuál es el problema..."
                  required
                  rows={4}
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all dark:bg-zinc-950 dark:border-zinc-800 dark:text-white resize-none"
                  value={nuevaDescripcion}
                  onChange={(e) => setNuevaDescripcion(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 hover:bg-zinc-50 px-5 text-sm font-semibold transition-all dark:border-zinc-800 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  disabled={creandoTicket}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:scale-100 cursor-pointer"
                >
                  {creandoTicket ? "Creando..." : "Enviar Reporte"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}