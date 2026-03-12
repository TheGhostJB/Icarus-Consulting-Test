export interface ApiMatch {
  match_id: number;
  status: string;
  home_team?: string;
  away_team?: string;
  start_time?: string | null;
  home_score?: number;
  away_score?: number;
  venue_name?: string;
  venue_city?: string;
}

export type MatchStatus = "LIVE" | "FINISHED" | "UPCOMING";

export interface MatchCardModel {
  id: number;
  status: MatchStatus;
  opponent: string;
  date: string;
  venue: string;
  resultLabel: string;
  resultValue: string;
}
