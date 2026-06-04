import { useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleLogin = async () => {
    try {
      const response =
        await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/login`,
          {
            email,
            password,
          }
        );

      const token =
        response.data.token;

      localStorage.setItem(
        "token",
        token
      );

      const userResponse =
        await axios.get(
          `${import.meta.env.VITE_API_URL}/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      localStorage.setItem(
        "userId",
        userResponse.data._id
      );

      navigate("/chat");
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        "Login failed"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <Link
          to="/"
          className="mb-6 flex items-center gap-2 text-slate-300 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
        <h1 className="mb-6 text-center text-4xl font-bold text-white">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="mb-4 w-full rounded-xl border border-white/10 bg-white/10 p-3 text-white placeholder:text-slate-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="mb-4 w-full rounded-xl border border-white/10 bg-white/10 p-3 text-white placeholder:text-slate-400"
        />

        {error && (
          <p className="mb-4 text-red-500">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          className="w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:scale-105"
        >
          Login
        </button>

        <p className="mt-4 text-center text-slate-300">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-cyan-400"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;