import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChefHat, MonitorPlay, ShieldAlert, LogIn } from "lucide-react";
import { isSupabaseConfigured } from "../lib/supabase";
import { useData } from "../context/DataContext";

export default function Landing() {
  const [loginId, setLoginId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { judges } = useData();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!loginId.trim()) {
      setError("Masukkan ID Anda.");
      return;
    }

    const user = judges.find((j) => j.name.toLowerCase() === loginId.trim().toLowerCase());

    if (!user) {
      setError("ID tidak ditemukan. Silakan hubungi Admin.");
      return;
    }

    // Route based on role
    if (user.role === "admin") {
      navigate("/admin");
    } else if (user.role === "judge") {
      navigate(`/judge/${user.id}`);
    } else if (user.role === "supervisor") {
      navigate(`/supervisor/${user.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="absolute top-6 flex items-center justify-center space-x-3 text-amber-500">
        <ChefHat className="w-10 h-10" />
        <h1 className="text-2xl font-bold tracking-wider">AL MUTTAQIN</h1>
      </div>

      <div className="max-w-xl w-full space-y-10 text-center mt-8">
        <div className="space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
            Master Chef <span className="text-amber-500">Scoring</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-lg mx-auto">
            Sistem penilaian digital real-time. Masukkan ID Anda untuk melanjutkan.
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl p-4 flex items-start text-left">
            <ShieldAlert className="w-6 h-6 mr-3 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Mode Demo Aktif (Supabase Belum Dikonfigurasi)</p>
              <p className="text-xs opacity-80 mt-1">
                Data akan disimpan sementara di memori lokal. Untuk sinkronisasi real-time antar perangkat yang sebenarnya, harap tambahkan Variabel Environment Supabase.
              </p>
            </div>
          </div>
        )}

        <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-xl">
          <form onSubmit={handleLogin} className="space-y-6 text-left">
            <div>
              <label htmlFor="loginId" className="block text-sm font-medium text-slate-300 mb-2">
                ID Akses
              </label>
              <input
                type="text"
                id="loginId"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="Masukkan ID Anda..."
                autoComplete="off"
              />
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-center space-x-2"
            >
              <span>Masuk Sistem</span>
              <LogIn className="w-5 h-5" />
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-700">
            <Link
              to="/audience"
              className="group flex flex-col items-center justify-center p-4 bg-slate-800/50 rounded-2xl hover:bg-slate-700/50 border border-slate-700 hover:border-blue-500/50 transition-all text-center"
            >
              <MonitorPlay className="w-8 h-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-bold mb-1">Layar Penonton</h3>
              <p className="text-xs text-slate-400">Lihat live ranking tanpa login</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
