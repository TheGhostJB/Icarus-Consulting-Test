export interface HealthCheckResult {
  now: Date | string;
}

export interface MatchRow {
  match_id: number;
  status: string;
  home_team: string;
  away_team: string;
  start_time: Date | string | null;
  home_score?: number;
  away_score?: number;
  venue_name?: string;
  venue_city?: string;
}
