import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, Eye, AlertTriangle, Search } from "lucide-react";
import { useData } from "../context/DataContext";
import { Participant, ViolationDefinition } from "../types";

export default function SupervisorScore() {
  const { id: supervisorId } = useParams<{ id: string }>();
  const { participants, judges, violationDefs, violationRecords, recordViolation, isLoading } = useData();

  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [selectedViolation, setSelectedViolation] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const supervisor = useMemo(() => judges.find((j) => j.id === supervisorId), [judges, supervisorId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl font-medium text-slate-300">Memuat data pengawas...</p>
      </div>
    );
  }

  if (!supervisor || supervisor.role !== 'supervisor') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <p className="text-2xl font-bold mb-2">Sesi pengawas tidak ditemukan atau tidak valid.</p>
        <p className="text-slate-400 mb-6 max-w-md mx-auto">Pastikan Anda masuk melalui portal pendaftaran atau ID pengawas yang Anda gunakan valid.</p>
        <Link to="/judge/register" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all inline-flex items-center">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Registrasi
        </Link>
      </div>
    );
  }

  const handleViolationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParticipant || !supervisorId || !selectedViolation) return;
    
    setIsSubmitting(true);
    try {
      const def = violationDefs.find(v => v.id === selectedViolation);
      if (def) {
        await recordViolation(selectedParticipant.id, supervisorId, def.id, def.penalty_points);
        setSelectedParticipant(null);
        setSelectedViolation("");
        // Show lightweight toast or message if needed
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredParticipants = participants.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.dish_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-12">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between mt-2 mb-2">
          <div className="flex items-center">
            {selectedParticipant ? (
              <button 
                onClick={() => setSelectedParticipant(null)}
                className="mr-4 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            ) : (
               <Link to="/" className="mr-4 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
            )}
            <div>
              <p className="text-sm text-blue-500 font-bold uppercase tracking-wider flex items-center">
                <Eye className="w-4 h-4 mr-1" /> PENGAWAS AKTIF
              </p>
              <h1 className="text-xl font-bold">{supervisor.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 mt-4">
         {violationDefs.length === 0 ? (
           <div className="bg-amber-500/10 border border-amber-500 text-amber-500 p-4 rounded-xl flex items-center">
             <AlertTriangle className="w-6 h-6 mr-3" />
             Belum ada jenis pelanggaran yang didefinisikan oleh admin. Anda belum bisa mencatat pelanggaran.
           </div>
         ) : !selectedParticipant ? (
           <div className="space-y-6">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
               <h2 className="text-2xl font-bold text-white">
                 Catat Pelanggaran Peserta
               </h2>
               <div className="relative">
                 <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Cari Kelompok..."
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   className="bg-slate-800 border border-slate-700 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white w-full md:w-64"
                 />
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {filteredParticipants.map((p) => {
                 const pVioCount = violationRecords.filter(v => v.participant_id === p.id).length;
                 return (
                   <button
                     key={p.id}
                     onClick={() => setSelectedParticipant(p)}
                     className="text-left p-6 rounded-2xl bg-slate-800 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all flex flex-col justify-between relative group"
                   >
                     {pVioCount > 0 && (
                       <div className="absolute top-4 right-4 text-red-400 bg-red-400/10 px-2 py-1 rounded-full text-xs font-bold border border-red-400/20">
                         {pVioCount} Pelanggaran
                       </div>
                     )}
                     <div>
                       <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{p.name}</h3>
                       <p className="text-slate-400 text-sm">{p.dish_name}</p>
                     </div>
                     <div className="mt-6 flex justify-end">
                       <div className="w-8 h-8 rounded-full bg-slate-700 group-hover:bg-blue-500 flex items-center justify-center transition-colors">
                         <ChevronRight className="w-5 h-5 text-white" />
                       </div>
                     </div>
                   </button>
                 );
               })}
               {filteredParticipants.length === 0 && (
                 <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-700 rounded-2xl">
                    Peserta tidak ditemukan.
                 </div>
               )}
             </div>
           </div>
        ) : (
           <div className="bg-slate-800 rounded-2xl border border-red-500/30 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
              <div className="mb-8 pb-6 border-b border-slate-700 flex flex-col items-start gap-2">
                <p className="text-red-400 font-bold uppercase text-sm tracking-wider flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" /> MENCATAT PELANGGARAN KEPADA
                </p>
                <h2 className="text-3xl font-extrabold text-white">{selectedParticipant.name}</h2>
              </div>

              <form onSubmit={handleViolationSubmit} className="space-y-8">
                 <div className="space-y-4">
                    <label className="text-lg font-bold text-white block">Pilih Jenis Pelanggaran</label>
                    <div className="grid grid-cols-1 gap-3">
                      {violationDefs.map(def => (
                        <label 
                          key={def.id} 
                          className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                            selectedViolation === def.id 
                            ? 'bg-red-500/10 border-red-500' 
                            : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="violation" 
                            value={def.id} 
                            checked={selectedViolation === def.id}
                            onChange={(e) => setSelectedViolation(e.target.value)}
                            className="w-5 h-5 accent-red-500 mr-4"
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-white">{def.name}</h4>
                          </div>
                          <div className="font-mono font-bold text-red-500">
                            -{def.penalty_points} Pts
                          </div>
                        </label>
                      ))}
                    </div>
                 </div>

                 <button
                    type="submit"
                    disabled={isSubmitting || !selectedViolation}
                    className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 px-4 rounded-xl transition-colors flex items-center justify-center text-lg mt-8"
                  >
                    {isSubmitting ? "Menyimpan Catatan..." : "Konfirmasi Pelanggaran"}
                  </button>
              </form>
           </div>
        )}
      </div>
    </div>
  );
}
