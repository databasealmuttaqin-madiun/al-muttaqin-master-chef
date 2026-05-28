import React, { createContext, useContext, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { Judge, Participant, Score, ViolationDefinition, ViolationRecord } from "../types";

interface DataContextType {
  participants: Participant[];
  judges: Judge[];
  scores: Score[];
  violationDefs: ViolationDefinition[];
  violationRecords: ViolationRecord[];
  addParticipant: (name: string, dish_name: string) => Promise<void>;
  registerJudge: (name: string, role: 'judge' | 'supervisor' | 'admin') => Promise<Judge>;
  submitScore: (scoreEntry: Omit<Score, "id" | "created_at" | "total">) => Promise<void>;
  addViolationDefinition: (name: string, penalty_points: number) => Promise<void>;
  recordViolation: (participant_id: string, supervisor_id: string, violation_id: string, penalty_applied: number) => Promise<void>;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper for local mock IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [violationDefs, setViolationDefs] = useState<ViolationDefinition[]>([]);
  const [violationRecords, setViolationRecords] = useState<ViolationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      const fetchData = async () => {
        setIsLoading(true);
        const [pRes, jRes, sRes, vdRes, vrRes] = await Promise.all([
          supabase.from("participants").select("*").order("created_at", { ascending: true }),
          supabase.from("judges").select("*"),
          supabase.from("scores").select("*"),
          supabase.from("violation_definitions").select("*"),
          supabase.from("violation_records").select("*"),
        ]);
        if (pRes.data) setParticipants(pRes.data);
        
        let judgesData = jRes.data || [];
        const adminsToSeed = ["angie_seprisa", "fahmi_maulana"];
        for (const adminName of adminsToSeed) {
           if (!judgesData.some((j: Judge) => j.name === adminName)) {
              const res = await supabase.from("judges").insert([{ name: adminName, role: "admin" }]).select().single();
              if (res.data) judgesData.push(res.data);
           }
        }
        setJudges(judgesData);

        if (sRes.data) setScores(sRes.data);
        if (vdRes.data) setViolationDefs(vdRes.data);
        if (vrRes.data) setViolationRecords(vrRes.data);
        setIsLoading(false);
      };

      fetchData();

      // Realtime subscriptions
      const channel = supabase
        .channel("schema-db-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "participants" }, (payload) => {
          if (payload.eventType === "INSERT") setParticipants((prev) => prev.some(p => p.id === payload.new.id) ? prev : [...prev, payload.new as Participant]);
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "judges" }, (payload) => {
          if (payload.eventType === "INSERT") setJudges((prev) => prev.some(j => j.id === payload.new.id) ? prev : [...prev, payload.new as Judge]);
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "scores" }, (payload) => {
          if (payload.eventType === "INSERT") setScores((prev) => prev.some(s => s.id === payload.new.id) ? prev : [...prev, payload.new as Score]);
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "violation_definitions" }, (payload) => {
          if (payload.eventType === "INSERT") setViolationDefs((prev) => prev.some(v => v.id === payload.new.id) ? prev : [...prev, payload.new as ViolationDefinition]);
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "violation_records" }, (payload) => {
          if (payload.eventType === "INSERT") setViolationRecords((prev) => prev.some(v => v.id === payload.new.id) ? prev : [...prev, payload.new as ViolationRecord]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      // Local fallback using localStorage to allow multi-tab preview
      const localP = JSON.parse(localStorage.getItem("mock_participants") || "[]");
      let localJ = JSON.parse(localStorage.getItem("mock_judges") || "[]");
      const localS = JSON.parse(localStorage.getItem("mock_scores") || "[]");
      const localVD = JSON.parse(localStorage.getItem("mock_violation_defs") || "[]");
      const localVR = JSON.parse(localStorage.getItem("mock_violation_records") || "[]");
      
      // Seed Admins locally
      const mockAdmins = [
        { id: "admin_1", name: "angie_seprisa", role: "admin", created_at: new Date().toISOString() },
        { id: "admin_2", name: "fahmi_maulana", role: "admin", created_at: new Date().toISOString() }
      ];
      let jUpdated = false;
      for (const a of mockAdmins) {
        if (!localJ.some((j: Judge) => j.name === a.name)) {
          localJ.push(a);
          jUpdated = true;
        }
      }
      if (jUpdated) localStorage.setItem("mock_judges", JSON.stringify(localJ));
      
      if (localP.length === 0) {
        // Seed initial mock data
        const initialP = [
          { id: "1", name: "Ahmad Rizky", dish_name: "Nasi Goreng Kampung Kari", created_at: new Date().toISOString() },
          { id: "2", name: "Siti Aminah", dish_name: "Ayam Bakar Madu Pedas", created_at: new Date().toISOString() },
        ];
        localStorage.setItem("mock_participants", JSON.stringify(initialP));
        setParticipants(initialP);
      } else {
        setParticipants(localP);
      }
      
      setJudges(localJ);
      setScores(localS);
      setViolationDefs(localVD);
      setViolationRecords(localVR);
      setIsLoading(false);

      // Listen for local storage changes across tabs
      const handleStorage = () => {
        setParticipants(JSON.parse(localStorage.getItem("mock_participants") || "[]"));
        setJudges(JSON.parse(localStorage.getItem("mock_judges") || "[]"));
        setScores(JSON.parse(localStorage.getItem("mock_scores") || "[]"));
        setViolationDefs(JSON.parse(localStorage.getItem("mock_violation_defs") || "[]"));
        setViolationRecords(JSON.parse(localStorage.getItem("mock_violation_records") || "[]"));
      };
      
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    }
  }, []);

  const addParticipant = async (name: string, dish_name: string) => {
    const newP: Omit<Participant, "id" | "created_at"> = { name, dish_name };
    if (isSupabaseConfigured && supabase) {
      await supabase.from("participants").insert([newP]);
    } else {
      const p = { ...newP, id: generateId(), created_at: new Date().toISOString() };
      const updated = [...participants, p];
      setParticipants(updated);
      localStorage.setItem("mock_participants", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage")); // Trigger local update
    }
  };

  const registerJudge = async (name: string, role: 'judge' | 'supervisor' | 'admin'): Promise<Judge> => {
    // Check if exists
    const existing = judges.find((j) => j.name.toLowerCase() === name.toLowerCase() && j.role === role);
    if (existing) return existing;

    const newJ: Omit<Judge, "id" | "created_at"> = { name, role };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from("judges").insert([newJ]).select().single();
      if (error) throw error;
      
      // Update local state immediately to avoid race condition with navigation
      setJudges((prev) => {
        if (!prev.some(j => j.id === data.id)) return [...prev, data];
        return prev;
      });
      return data;
    } else {
      const j = { ...newJ, id: generateId(), created_at: new Date().toISOString() };
      const updated = [...judges, j];
      setJudges(updated);
      localStorage.setItem("mock_judges", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      return j;
    }
  };

  const submitScore = async (scoreEntry: Omit<Score, "id" | "created_at" | "total">) => {
    const total = scoreEntry.taste + scoreEntry.presentation + scoreEntry.creativity;
    const newScore: Omit<Score, "id" | "created_at"> = { ...scoreEntry, total };

    if (isSupabaseConfigured && supabase) {
      await supabase.from("scores").insert([newScore]);
    } else {
      const s = { ...newScore, id: generateId(), created_at: new Date().toISOString() };
      const updated = [...scores, s];
      setScores(updated);
      localStorage.setItem("mock_scores", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
    }
  };

  const addViolationDefinition = async (name: string, penalty_points: number) => {
    const newDef: Omit<ViolationDefinition, "id" | "created_at"> = { name, penalty_points };
    if (isSupabaseConfigured && supabase) {
      await supabase.from("violation_definitions").insert([newDef]);
    } else {
      const d = { ...newDef, id: generateId(), created_at: new Date().toISOString() };
      const updated = [...violationDefs, d];
      setViolationDefs(updated);
      localStorage.setItem("mock_violation_defs", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
    }
  };

  const recordViolation = async (participant_id: string, supervisor_id: string, violation_id: string, penalty_applied: number) => {
    const newRecord: Omit<ViolationRecord, "id" | "created_at"> = { participant_id, supervisor_id, violation_id, penalty_applied };
    if (isSupabaseConfigured && supabase) {
      await supabase.from("violation_records").insert([newRecord]);
    } else {
      const r = { ...newRecord, id: generateId(), created_at: new Date().toISOString() };
      const updated = [...violationRecords, r];
      setViolationRecords(updated);
      localStorage.setItem("mock_violation_records", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <DataContext.Provider
      value={{ participants, judges, scores, violationDefs, violationRecords, addParticipant, registerJudge, submitScore, addViolationDefinition, recordViolation, isLoading }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
