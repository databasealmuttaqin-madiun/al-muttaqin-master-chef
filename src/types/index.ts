export interface Participant {
  id: string;
  name: string;
  dish_name: string;
  created_at: string;
}

export interface Judge {
  id: string;
  name: string;
  role: 'judge' | 'supervisor' | 'admin';
  created_at: string;
}

export interface Score {
  id: string;
  participant_id: string;
  judge_id: string;
  taste: number;
  presentation: number;
  creativity: number;
  total: number;
  created_at: string;
}

export interface ViolationDefinition {
  id: string;
  name: string;
  penalty_points: number;
  created_at: string;
}

export interface ViolationRecord {
  id: string;
  participant_id: string;
  supervisor_id: string;
  violation_id: string;
  penalty_applied: number;
  created_at: string;
}

export interface ScoreDetail extends Score {
  judge_name: string;
}

export interface LeaderboardEntry extends Participant {
  total_score: number;
  average_score: number;
  scores_count: number;
  total_penalty: number;
  final_score: number;
  scores: ScoreDetail[];
}
