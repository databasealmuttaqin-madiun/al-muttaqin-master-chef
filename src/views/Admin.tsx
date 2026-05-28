import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Users, Utensils, Hash, AlertTriangle, Key } from "lucide-react";
import { useData } from "../context/DataContext";

export default function Admin() {
  const { participants, scores, violationDefs, violationRecords, judges, addParticipant, addViolationDefinition, registerJudge } = useData();
  const [name, setName] = useState("");
  const [dish, setDish] = useState("");
  
  const [vName, setVName] = useState("");
  const [vPenalty, setVPenalty] = useState("5");

  const [accessId, setAccessId] = useState("");
  const [accessRole, setAccessRole] = useState<"judge" | "supervisor">("judge");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dish.trim()) return;
    await addParticipant(name, dish);
    setName("");
    setDish("");
  };

  const handleAddViolation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName.trim() || !vPenalty) return;
    await addViolationDefinition(vName, parseInt(vPenalty, 10));
    setVName("");
    setVPenalty("5");
  };

  const handleAddAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessId.trim()) return;
    await registerJudge(accessId.trim(), accessRole);
    setAccessId("");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Kembali ke Login
          </Link>
          <div className="flex flex-wrap items-center gap-3">
             <Link to="/audience" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-blue-500/20">
                Layar Penonton
             </Link>
             <Link to="/judge/admin-juri" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-amber-500/20">
                Mode Juri
             </Link>
             <Link to="/supervisor/admin-pengawas" className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-red-500/20">
                Mode Pengawas
             </Link>
            <div className="flex items-center space-x-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl border border-emerald-500/20 ml-auto">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium">Sistem Admin Aktif</span>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Penyelenggara</h1>
          <p className="text-slate-400">Kelola peserta, jenis pelanggaran, peran akses, dan pantau metrik.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            {/* Registrasi Peserta Baru */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-bold text-white flex items-center mb-6">
                <Plus className="w-5 h-5 mr-2 text-emerald-400" />
                Registrasi Peserta Baru
              </h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Nama Peserta / Kelompok</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                    placeholder="Contoh: Kelompok Abu Bakar"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Nama Hidangan</label>
                  <input
                    type="text"
                    value={dish}
                    onChange={(e) => setDish(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                    placeholder="Contoh: Nasi Biryani Rempah"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" /> Tambahkan
                </button>
              </form>
            </div>
            
            {/* Tambah Pelanggaran */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-bold text-white flex items-center mb-6">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                Tambah Jenis Pelanggaran
              </h2>
              <form onSubmit={handleAddViolation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Nama Pelanggaran</label>
                  <input
                    type="text"
                    value={vName}
                    onChange={(e) => setVName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-medium"
                    placeholder="Contoh: Tidak menjaga kebersihan"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Poin Pengurangan (Minus)</label>
                  <input
                    type="number"
                    min="1"
                    value={vPenalty}
                    onChange={(e) => setVPenalty(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-medium"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" /> Tambahkan
                </button>
              </form>
            </div>

            {/* Buat Akses */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-bold text-white flex items-center mb-6">
                <Key className="w-5 h-5 mr-2 text-amber-400" />
                Buat Akses Juri/Pengawas
              </h2>
              <form onSubmit={handleAddAccess} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">ID Akses Baru</label>
                  <input
                    type="text"
                    value={accessId}
                    onChange={(e) => setAccessId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
                    placeholder="Contoh: juri_ahmad"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Pilih Peran</label>
                  <select
                    value={accessRole}
                    onChange={(e) => setAccessRole(e.target.value as "judge" | "supervisor")}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
                  >
                    <option value="judge">Juri Penilai</option>
                    <option value="supervisor">Pengawas Waktu</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" /> Buat Akses
                </button>
              </form>
            </div>
            
          </div>

          <div className="lg:col-span-2 space-y-6">
            
            {/* Daftar Peserta */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-bold text-white flex items-center mb-6">
                <Utensils className="w-5 h-5 mr-2 text-blue-400" />
                Daftar Peserta ({participants.length})
              </h2>

              {participants.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                    <Utensils className="w-8 h-8" />
                  </div>
                  <p className="text-slate-400 font-medium">Belum ada peserta terdaftar</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 text-sm">
                        <th className="pb-3 font-medium">No</th>
                        <th className="pb-3 font-medium">Nama / Kelompok</th>
                        <th className="pb-3 font-medium">Hidangan</th>
                        <th className="pb-3 font-medium text-right">Nilai Masuk</th>
                        <th className="pb-3 font-medium text-right">Pelanggaran</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {participants.map((p, idx) => {
                        const pScores = scores.filter((s) => s.participant_id === p.id).length;
                        const pVio = violationRecords.filter((v) => v.participant_id === p.id).length;
                        return (
                          <tr key={p.id} className="text-slate-200">
                            <td className="py-4 text-slate-500">{idx + 1}</td>
                            <td className="py-4 font-medium">{p.name}</td>
                            <td className="py-4 text-slate-400">{p.dish_name}</td>
                            <td className="py-4 text-right">
                              <span
                                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                  pScores > 0 ? "bg-amber-500/10 text-amber-500" : "bg-slate-700 text-slate-400"
                                }`}
                              >
                                {pScores} Juri
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              {pVio > 0 ? (
                                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                                  {pVio} Catatan
                                </span>
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Daftar Akses Aktif */}
               <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                  <h2 className="text-lg font-bold text-white flex items-center mb-6">
                    <Users className="w-5 h-5 mr-2 text-cyan-400" />
                    Akses Terdaftar ({judges.length})
                  </h2>

                  {judges.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-400 font-medium">Belum ada akun/akses terdaftar.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                      {judges.map((j) => (
                        <div key={j.id} className="bg-slate-900 border border-slate-700 rounded-xl p-3 flex justify-between items-center">
                          <span className="font-medium text-slate-200">{j.name}</span>
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            j.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                            j.role === 'supervisor' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {j.role === 'admin' ? 'Admin' : j.role === 'supervisor' ? 'Pengawas' : 'Juri'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
               </div>

               {/* Daftar Pelanggaran */}
               <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 flex flex-col">
                  <h2 className="text-lg font-bold text-white flex items-center mb-6">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                    Jenis Pelanggaran ({violationDefs.length})
                  </h2>

                  {violationDefs.length === 0 ? (
                    <div className="text-center py-8 flex-1">
                      <p className="text-slate-400 font-medium">Belum ada jenis pelanggaran.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                      {violationDefs.map((def) => (
                        <div key={def.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex justify-between items-center">
                          <span className="font-medium text-slate-200 text-sm leading-tight mr-4">{def.name}</span>
                          <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-lg font-bold text-sm shrink-0">-{def.penalty_points} Pts</span>
                        </div>
                      ))}
                    </div>
                  )}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
