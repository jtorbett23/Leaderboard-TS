export interface Score {
    id: number;
    name: string;
    score?: number;
    time?: number;
}

export let leaderboard: Score[] = [];
