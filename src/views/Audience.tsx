import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Trophy, ChefHat, ArrowLeft, Activity, AlertTriangle } from "lucide-react";
import { useData } from "../context/DataContext";
import { LeaderboardEntry } from "../types";

export default function Audience() {
  const { participants, scores, violationRecords, violationDefs } = useData();

  const leaderboard: LeaderboardEntry[] = useMemo(() => {
    return participants.map((p) => {
      const pScores = scores.filter((s) => s.participant_id === p.id);
      const pViolations = violationRecords.filter((v) => v.participant_id === p.id);
      
      const total_score = pScores.reduce((sum, s) => sum + s.total, 0);
      const total_penalty = pViolations.reduce((sum, v) => sum + v.penalty_applied, 0);
      const final_score = total_score - total_penalty;
      
      const average_score = pScores.length > 0 ? total_score / pScores.length : 0;
      
      return {
        ...p,
        total_score,
        average_score,
        scores_count: pScores.length,
        total_penalty,
        final_score,
        scores: pScores.map(s => ({...s, judge_name: "Juri"}))
      };
    }).sort((a, b) => b.final_score - a.final_score);
  }, [participants, scores, violationRecords]);

  const topParticipant = leaderboard[0];

  return (
    <div className="h-screen bg-[#0f172a] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-amber-500/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      <header className="relative z-10 p-4 lg:p-6 flex items-center justify-between border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md">
         <div className="flex items-center space-x-2 lg:space-x-4">
            <Link to="/" className="text-slate-500 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5 lg:w-6 lg:h-6" />
            </Link>
            <div className="flex items-center text-amber-500">
               <ChefHat className="w-6 h-6 lg:w-8 lg:h-8 mr-2 lg:mr-3" />
               <div>
                 <h1 className="text-lg lg:text-xl font-black tracking-widest leading-none">AL MUTTAQIN</h1>
                 <p className="text-[10px] lg:text-xs text-amber-500/70 tracking-[0.2em] font-bold">MASTER CHEF</p>
               </div>
            </div>
         </div>
         <div className="flex items-center bg-emerald-500/10 text-emerald-400 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Activity className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5 lg:mr-2 animate-pulse" />
            <span className="text-[10px] lg:text-sm font-bold tracking-wider">LIVE SCORING</span>
         </div>
      </header>

      <main className="relative z-10 flex-1 overflow-hidden p-4 lg:p-8 flex flex-col lg:flex-row gap-4 lg:gap-8 w-full">
         
         {/* LEADERBOARD PANEL */}
         <div className="flex-1 flex flex-col space-y-4 lg:space-y-6 overflow-hidden min-h-0">
            <h2 className="text-xl lg:text-2xl font-bold flex items-center space-x-2 lg:space-x-3 text-white shrink-0">
              <Trophy className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500" />
              <span>Leaderboard Terkini</span>
            </h2>
            
            <div className="flex-1 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl lg:rounded-3xl p-2 overflow-hidden flex flex-col">
               <div className="flex-1 overflow-y-auto p-2 lg:p-4 space-y-4">
                  {leaderboard.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500">
                      <ChefHat className="w-16 h-16 mb-4 opacity-50" />
                      <p>Menunggu penilaian peserta...</p>
                    </div>
                  ) : (
                    leaderboard.map((entry, index) => (
                      <div 
                        key={entry.id} 
                        className={`relative flex items-center p-3 lg:p-4 rounded-2xl border transition-all ${
                          index === 0 
                            ? "bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)]" 
                            : index === 1
                            ? "bg-slate-800 border-slate-600/50"
                            : index === 2
                            ? "bg-slate-800/80 border-slate-700/50"
                            : "bg-slate-800/40 border-transparent"
                        }`}
                      >
                         <div className={`w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full font-black text-lg lg:text-xl mr-3 lg:mr-5 shrink-0 ${
                            index === 0 ? "bg-amber-500 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.5)]" : 
                            index === 1 ? "bg-slate-300 text-slate-900" :
                            index === 2 ? "bg-amber-700 text-amber-100" :
                            "bg-slate-800 text-slate-500"
                         }`}>
                            {index + 1}
                         </div>
                         <div className="flex-1 min-w-0">
                            <h3 className={`font-bold truncate ${index === 0 ? "text-xl lg:text-2xl text-amber-400" : "text-lg lg:text-xl text-white"}`}>
                              {entry.name}
                            </h3>
                            <p className="text-slate-400 text-xs lg:text-sm truncate">{entry.dish_name}</p>
                            {entry.total_penalty > 0 && (
                              <p className="text-red-400 text-[10px] lg:text-xs font-bold flex items-center mt-1">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Penalti Pelanggaran: -{entry.total_penalty}
                              </p>
                            )}
                         </div>
                         <div className="text-right ml-2 lg:ml-4 shrink-0">
                            <p className={`font-black text-2xl lg:text-3xl tabular-nums leading-none ${index === 0 ? "text-amber-500" : "text-white"}`}>
                              {entry.final_score}
                            </p>
                            <p className="text-[10px] lg:text-xs text-slate-500 font-medium mt-1">
                              {entry.scores_count} Juri
                            </p>
                         </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
         </div>

         {/* VISUALIZATION PANEL */}
         <div className="flex-1 lg:max-w-screen-md xl:max-w-screen-lg flex flex-col space-y-4 lg:space-y-6 overflow-hidden min-h-0">
            {/* Highlight Card */}
            {topParticipant && topParticipant.scores_count > 0 ? (
              <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl lg:rounded-3xl p-1 shadow-[0_0_40px_rgba(245,158,11,0.2)] shrink-0">
                 <div className="bg-slate-900/90 backdrop-blur-xl rounded-[14px] lg:rounded-[23px] p-4 lg:p-8">
                    <p className="text-amber-500 font-bold tracking-widest text-[10px] lg:text-sm mb-1 lg:mb-2 uppercase">Posisi Pertama Sementara</p>
                    <h2 className="text-2xl lg:text-4xl font-black text-white mb-1 lg:mb-2 truncate">{topParticipant.name}</h2>
                    <p className="text-sm lg:text-xl text-slate-300 italic mb-4 lg:mb-8 border-l-4 border-amber-500 pl-3 lg:pl-4">"{topParticipant.dish_name}"</p>
                    
                    <div className="grid grid-cols-3 gap-2 lg:gap-4">
                       <div className="bg-slate-800/80 rounded-xl p-2 lg:p-4 text-center flex flex-col justify-center">
                          <p className="text-slate-400 text-[10px] lg:text-xs font-bold uppercase mb-0.5 lg:mb-1">Skor Masuk</p>
                          <p className="text-lg lg:text-2xl font-bold text-white">{topParticipant.total_score}</p>
                       </div>
                       <div className="bg-red-500/10 rounded-xl p-2 lg:p-4 text-center flex flex-col justify-center border border-red-500/20">
                          <p className="text-red-400 text-[10px] lg:text-xs font-bold uppercase mb-0.5 lg:mb-1">Pengurangan</p>
                          <p className="text-lg lg:text-2xl font-bold text-red-500">{topParticipant.total_penalty > 0 ? `-${topParticipant.total_penalty}` : '0'}</p>
                       </div>
                       <div className="bg-amber-500/20 rounded-xl p-2 lg:p-4 text-center border border-amber-500/30 flex flex-col justify-center">
                          <p className="text-amber-500 text-[10px] lg:text-xs font-bold uppercase mb-0.5 lg:mb-1">Poin Akhir</p>
                          <p className="text-xl lg:text-2xl font-black text-amber-500">{topParticipant.final_score}</p>
                       </div>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="bg-slate-800/50 rounded-2xl lg:rounded-3xl p-4 lg:p-8 border border-slate-700/50 flex items-center justify-center min-h-[150px] lg:min-h-[250px] shrink-0">
                 <p className="text-slate-500 font-medium">Belum ada data cukup untuk highlight.</p>
              </div>
            )}

            {/* Violation History */}
            <div className="flex-1 bg-slate-800/30 border border-slate-700/50 rounded-2xl lg:rounded-3xl p-4 lg:p-6 flex flex-col min-h-0 overflow-hidden">
               <h3 className="text-slate-400 font-bold mb-2 lg:mb-4 uppercase tracking-wider text-xs lg:text-sm shrink-0 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Riwayat Pelanggaran Terbaru
               </h3>
               <div className="flex-1 min-h-[200px] w-full overflow-y-auto pr-2 space-y-3">
                  {violationRecords.length > 0 ? (
                    [...violationRecords].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 50).map((record) => {
                      const participant = participants.find(p => p.id === record.participant_id);
                      const violationDef = violationDefs.find(v => v.id === record.violation_id);
                      
                      return (
                        <div key={record.id} className="bg-slate-800/80 border border-red-500/20 rounded-xl p-3 lg:p-4 flex items-center justify-between">
                          <div className="flex-1 min-w-0 pr-4">
                            <p className="text-white font-bold text-sm lg:text-base truncate">
                              {participant?.name || 'Peserta Tidak Diketahui'}
                            </p>
                            <p className="text-slate-400 text-xs lg:text-sm truncate mt-0.5">
                              {violationDef?.name || 'Pelanggaran Tidak Diketahui'}
                            </p>
                          </div>
                          <div className="bg-red-500/10 text-red-500 font-bold px-3 py-1.5 rounded-lg border border-red-500/20 text-sm whitespace-nowrap">
                            -{record.penalty_applied} Pts
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-600">
                       Belum ada pelanggaran yang dicatat
                    </div>
                  )}
               </div>
            </div>
         </div>
      </main>
    </div>
  );
}
