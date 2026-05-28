import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Users, Utensils, Hash, AlertTriangle } from "lucide-react";
import { useData } from "../context/DataContext";

export default function Admin() {
  const { participants, scores, violationDefs, violationRecords, addParticipant, addViolationDefinition } = useData();
  const [name, setName] = useState("");
  const [dish, setDish] = useState("");
  
  const [vName, setVName] = useState("");
  const [vPenalty, setVPenalty] = useState("5");

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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Kembali
          </Link>
          <div className="flex items-center space-x-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium">Sistem Admin Aktif</span>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Penyelenggara</h1>
          <p className="text-slate-400">Kelola peserta dan metrik kompetisi Al Muttaqin Master Chef.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 text-center">
                <p className="text-slate-400 text-sm font-medium">Nilai Masuk</p>
                <p className="text-2xl font-bold text-amber-500 mt-1">{scores.length}</p>
              </div>
              <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 text-center">
                <p className="text-slate-400 text-sm font-medium">Pelanggaran</p>
                <p className="text-2xl font-bold text-red-500 mt-1">{violationRecords.length}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-bold text-white flex items-center mb-6">
                <Users className="w-5 h-5 mr-2 text-blue-400" />
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

            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-bold text-white flex items-center mb-6">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                Daftar Jenis Pelanggaran Tersedia ({violationDefs.length})
              </h2>

              {violationDefs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 font-medium">Belum ada jenis pelanggaran.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {violationDefs.map((def) => (
                    <div key={def.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex justify-between items-center">
                      <span className="font-medium text-slate-200">{def.name}</span>
                      <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-lg font-bold">-{def.penalty_points} Pts</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
