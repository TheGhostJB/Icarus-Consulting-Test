export type MatchStatus = "LIVE" | "FINISHED" | "UPCOMING";

export interface Match {
  id: number;
  status: MatchStatus;
  opponent: string;
  date: string;
  venue: string;
  resultLabel: string;
  resultValue: string;
}

export interface ApiMatch {
  match_id: number;
  status?: string;
  home_team?: string;
  away_team?: string;
  start_time?: string;
  venue_name?: string;
  venue_city?: string;
  home_score?: number;
  away_score?: number;
}

export interface StoreProduct {
  id: string;
  name: string;
  description?: string;
  default_price: string;
  images?: string[];
}

export interface Profile {
  first_name: string;
  last_name: string;
  username: string;
  country: string;
  user_id: number | string;
  account_id: number | string;
  avatar_url: string;
}

export interface InsertNewUserRequest {
  user_id: string, 
  country: string,
  first_name: string, 
  last_name: string, 
  username: string,
  avatar_url: string 
}
