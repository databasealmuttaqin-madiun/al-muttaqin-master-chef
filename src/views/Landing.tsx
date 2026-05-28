import React from "react";
import { Link } from "react-router-dom";
import { ChefHat, MonitorPlay, Users, ShieldAlert } from "lucide-react";
import { isSupabaseConfigured } from "../lib/supabase";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="absolute top-6 flex items-center justify-center space-x-3 text-amber-500">
        <ChefHat className="w-10 h-10" />
        <h1 className="text-2xl font-bold tracking-wider">AL MUTTAQIN</h1>
      </div>

      <div className="max-w-3xl w-full space-y-12 text-center mt-12">
        <div className="space-y-4">
          <h2 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-white">
            Master Chef <span className="text-amber-500">Scoring</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Sistem penilaian digital real-time. Pilih peran Anda untuk masuk ke dalam sistem.
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl p-4 flex items-start text-left max-w-2xl mx-auto">
            <ShieldAlert className="w-6 h-6 mr-3 shrink-0" />
            <div>
              <p className="font-semibold">Mode Demo Aktif (Supabase Belum Dikonfigurasi)</p>
              <p className="text-sm opacity-80 mt-1">
                Data akan disimpan sementara di memori lokal. Untuk performa dan sinkronisasi real-time antar perangkat yang sebenarnya, harap tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di konfifgurasi Anda.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Link
            to="/judge/register"
            className="group relative flex flex-col items-center p-8 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-all border border-slate-700 hover:border-amber-500/50"
          >
            <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ChefHat className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Portal Juri</h3>
            <p className="text-slate-400 text-sm text-center">Masuk untuk memberikan penilaian kepada peserta.</p>
          </Link>

          <Link
            to="/audience"
            className="group relative flex flex-col items-center p-8 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-all border border-slate-700 hover:border-blue-500/50"
          >
            <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MonitorPlay className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Layar Penonton</h3>
            <p className="text-slate-400 text-sm text-center">Lihat live ranking dan perolehan skor secara langsung.</p>
          </Link>

          <Link
            to="/admin"
            className="group relative flex flex-col items-center p-8 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-all border border-slate-700 hover:border-emerald-500/50"
          >
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Dashboard Admin</h3>
            <p className="text-slate-400 text-sm text-center">Kelola peserta dan pantau ringkasan nilai.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
