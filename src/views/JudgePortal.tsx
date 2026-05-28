import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, UserCircle2, ArrowRight, Eye, ChefHat } from "lucide-react";
import { useData } from "../context/DataContext";

export default function JudgePortal() {
  const [judgeName, setJudgeName] = useState("");
  const [role, setRole] = useState<'judge' | 'supervisor'>('judge');
  const { registerJudge } = useData();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judgeName.trim()) return;
    setIsSubmitting(true);
    try {
      const judge = await registerJudge(judgeName, role);
      if (role === 'judge') {
        navigate(`/judge/${judge.id}`);
      } else {
        navigate(`/supervisor/${judge.id}`);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      alert("Gagal mendaftar: " + (error.message || "Pastikan skema Supabase sudah diperbarui (termasuk kolom 'role' dan tabel 'violation_definitions', 'violation_records')."));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col justify-center items-center relative">
      <Link to="/" className="absolute top-8 left-8 inline-flex items-center text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
      </Link>

      <div className="max-w-md w-full bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
        <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-6 mx-auto">
          <UserCircle2 className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-bold text-center text-white mb-2">Registrasi Petugas</h2>
        <p className="text-slate-400 text-center text-sm mb-8">
          Pilih peran Anda dan masukkan nama untuk masuk ke dalam sistem.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole('judge')}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                role === 'judge' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
              }`}
            >
              <ChefHat className="w-6 h-6 mb-2" />
              <span className="font-medium">Juri</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('supervisor')}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                role === 'supervisor' ? 'bg-blue-500/20 border-blue-500 text-blue-500' : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
              }`}
            >
              <Eye className="w-6 h-6 mb-2" />
              <span className="font-medium">Pengawas</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Nama Lengkap</label>
            <input
              type="text"
              value={judgeName}
              onChange={(e) => setJudgeName(e.target.value)}
              className={`w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-1 transition-all font-medium text-lg text-center ${
                role === 'judge' ? 'focus:border-amber-500 focus:ring-amber-500' : 'focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="Contoh: Chef Renatta"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !judgeName.trim()}
            className={`w-full text-white font-bold py-4 px-4 rounded-xl transition-colors flex items-center justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed ${
              role === 'judge' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {isSubmitting ? "Mendaftarkan..." : "Mulai Bertugas"}
            {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
          </button>
        </form>
      </div>
    </div>
  );
}
