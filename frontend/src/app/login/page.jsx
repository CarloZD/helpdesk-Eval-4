"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API_URL from "@/services/api";

export default function LoginPage() {

  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            correo,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.mensaje);
        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "usuario",
        JSON.stringify(data.usuario)
      );

      router.push("/dashboard");

    } catch (error) {

      console.error(error);

      alert("Error al iniciar sesión");

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >

        <h1 className="text-2xl font-bold mb-6">
          Iniciar Sesión
        </h1>

        <input
          type="email"
          placeholder="Correo"
          className="w-full border p-3 rounded mb-4"
          value={correo}
          onChange={(e) =>
            setCorreo(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border p-3 rounded mb-4"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          Ingresar
        </button>

      </form>

    </div>
  );
}