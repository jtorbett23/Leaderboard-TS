export interface LeaderboardItem {
  id: number;
  name: string;
  score: number;
}

export let leaderboard: LeaderboardItem[] = [];