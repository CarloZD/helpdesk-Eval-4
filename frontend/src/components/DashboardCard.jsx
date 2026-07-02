"use client";

export default function DashboardCard({ titulo, valor, tipo, onClick }) {
  // Configuración de estilos según tipo
  const styles = {
    total: {
      border: "hover:border-indigo-500/30",
      bgIcon: "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400",
      gradient: "hover:bg-gradient-to-br hover:from-indigo-500/5 hover:to-transparent",
      svgPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
        />
      ),
    },
    pendiente: {
      border: "hover:border-amber-500/30",
      bgIcon: "bg-amber-500/10 text-amber-500 dark:text-amber-400",
      gradient: "hover:bg-gradient-to-br hover:from-amber-500/5 hover:to-transparent",
      svgPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      ),
    },
    proceso: {
      border: "hover:border-blue-500/30",
      bgIcon: "bg-blue-500/10 text-blue-500 dark:text-blue-400",
      gradient: "hover:bg-gradient-to-br hover:from-blue-500/5 hover:to-transparent",
      svgPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      ),
    },
    resuelto: {
      border: "hover:border-emerald-500/30",
      bgIcon: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
      gradient: "hover:bg-gradient-to-br hover:from-emerald-500/5 hover:to-transparent",
      svgPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
        />
      ),
    },
    cerrado: {
      border: "hover:border-zinc-500/30",
      bgIcon: "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400",
      gradient: "hover:bg-gradient-to-br hover:from-zinc-500/5 hover:to-transparent",
      svgPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      ),
    },
  };

  const style = styles[tipo] || styles.total;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 ${style.border} ${style.gradient} ${
        onClick ? "cursor-pointer hover:shadow-md hover:scale-[1.01]" : ""
      } dark:border-zinc-800 dark:bg-zinc-900`}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {titulo}
          </span>
          <span className="mt-2 block text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {valor}
          </span>
        </div>
        <div className={`rounded-xl p-3 ${style.bgIcon}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            {style.svgPath}
          </svg>
        </div>
      </div>
    </div>
  );
}
