import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ChevronRight, Star } from "lucide-react";
import { useData } from "../context/DataContext";
import { Participant } from "../types";

export default function JudgeScore() {
  const { id: judgeId } = useParams<{ id: string }>();
  const { participants, judges, scores, submitScore, isLoading } = useData();

  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  
  // Score state
  const [taste, setTaste] = useState<number>(0); // Max 50
  const [presentation, setPresentation] = useState<number>(0); // Max 25
  const [creativity, setCreativity] = useState<number>(0); // Max 25
  const [isSubmitting, setIsSubmitting] = useState(false);

  const judge = useMemo(() => judges.find((j) => j.id === judgeId), [judges, judgeId]);
  
  const scoredParticipantIds = useMemo(() => {
    return scores.filter((s) => s.judge_id === judgeId).map((s) => s.participant_id);
  }, [scores, judgeId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl font-medium text-slate-300">Memuat data juri...</p>
      </div>
    );
  }

  if (!judge) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <p className="text-2xl font-bold mb-2">Sesi juri tidak ditemukan atau tidak valid.</p>
        <p className="text-slate-400 mb-6 max-w-md mx-auto">Pastikan Anda masuk melalui portal pendaftaran atau ID juri yang Anda gunakan valid.</p>
        <Link to="/judge/register" className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition-all inline-flex items-center">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Registrasi
        </Link>
      </div>
    );
  }

  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParticipant || !judgeId) return;
    
    setIsSubmitting(true);
    try {
      await submitScore({
        participant_id: selectedParticipant.id,
        judge_id: judgeId,
        taste: Number(taste),
        presentation: Number(presentation),
        creativity: Number(creativity)
      });
      // Reset form on success
      setSelectedParticipant(null);
      setTaste(0);
      setPresentation(0);
      setCreativity(0);
    } catch(err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCurrentScore = Number(taste) + Number(presentation) + Number(creativity);

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
              <p className="text-sm text-amber-500 font-bold uppercase tracking-wider">Juri Aktif</p>
              <h1 className="text-xl font-bold">{judge.name}</h1>
            </div>
          </div>
          <div className="text-right">
             <p className="text-sm text-slate-400">Progres</p>
             <p className="font-bold text-white">{scoredParticipantIds.length} / {participants.length}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 mt-4">
        {!selectedParticipant ? (
           <div className="space-y-4">
             <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500 mb-6">
               Pilih Peserta untuk Dinilai
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {participants.map((p) => {
                 const isScored = scoredParticipantIds.includes(p.id);
                 return (
                   <button
                     key={p.id}
                     onClick={() => !isScored && setSelectedParticipant(p)}
                     disabled={isScored}
                     className={`text-left p-6 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden group ${
                       isScored 
                        ? "bg-slate-800/50 border-slate-700/50 cursor-not-allowed opacity-70" 
                        : "bg-slate-800 border-slate-700 hover:border-amber-500/50 hover:bg-slate-800"
                     }`}
                   >
                     {isScored && (
                       <div className="absolute top-4 right-4 text-emerald-500 flex items-center bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold">
                         <CheckCircle2 className="w-4 h-4 mr-1" /> Ternilai
                       </div>
                     )}
                     <div>
                       <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">{p.name}</h3>
                       <p className="text-slate-400">{p.dish_name}</p>
                     </div>
                     {!isScored && (
                       <div className="mt-6 flex justify-end">
                         <div className="w-8 h-8 rounded-full bg-slate-700 group-hover:bg-amber-500 flex items-center justify-center transition-colors">
                           <ChevronRight className="w-5 h-5 text-white" />
                         </div>
                       </div>
                     )}
                   </button>
                 );
               })}
               {participants.length === 0 && (
                 <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-700 rounded-2xl">
                    Belum ada peserta terdaftar.
                 </div>
               )}
             </div>
           </div>
        ) : (
           <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
              <div className="mb-8 pb-6 border-b border-slate-700 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <p className="text-amber-500 font-bold uppercase text-sm tracking-wider mb-1">MEMBERIKAN NILAI KEPADA</p>
                  <h2 className="text-3xl font-extrabold text-white mb-2">{selectedParticipant.name}</h2>
                  <p className="text-xl text-slate-300 italic">"{selectedParticipant.dish_name}"</p>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 min-w-[120px] text-center">
                   <p className="text-xs text-slate-400 uppercase font-bold mb-1">SKOR TOTAL</p>
                   <p className="text-4xl font-black text-amber-500 flex items-baseline justify-center">
                     {totalCurrentScore} <span className="text-lg text-slate-500 ml-1">/100</span>
                   </p>
                </div>
              </div>

              <form onSubmit={handleScoreSubmit} className="space-y-8">
                 <div className="space-y-6">
                    {/* Taste */}
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-lg font-bold text-white flex items-center">
                           Rasa (Taste)
                        </label>
                        <span className="text-amber-500 font-bold text-xl">{taste} <span className="text-sm text-slate-500">/ 50</span></span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="50" 
                        value={taste} 
                        onChange={(e) => setTaste(Number(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                         <span>0</span>
                         <span>Maks 50</span>
                      </div>
                    </div>

                    {/* Presentation */}
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-lg font-bold text-white flex items-center">
                           Penyajian (Presentation)
                        </label>
                        <span className="text-amber-500 font-bold text-xl">{presentation} <span className="text-sm text-slate-500">/ 25</span></span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="25" 
                        value={presentation} 
                        onChange={(e) => setPresentation(Number(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                         <span>0</span>
                         <span>Maks 25</span>
                      </div>
                    </div>

                    {/* Creativity */}
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-lg font-bold text-white flex items-center">
                           Kreativitas (Creativity)
                        </label>
                        <span className="text-amber-500 font-bold text-xl">{creativity} <span className="text-sm text-slate-500">/ 25</span></span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="25" 
                        value={creativity} 
                        onChange={(e) => setCreativity(Number(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                         <span>0</span>
                         <span>Maks 25</span>
                      </div>
                    </div>
                 </div>

                 <button
                    type="submit"
                    disabled={isSubmitting || totalCurrentScore === 0}
                    className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 px-4 rounded-xl transition-colors flex items-center justify-center text-lg mt-8"
                  >
                    {isSubmitting ? "Menyimpan Nilai..." : "Submit Nilai Akhir"}
                  </button>
              </form>
           </div>
        )}
      </div>
    </div>
  );
}
