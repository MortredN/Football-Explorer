export class LeagueTable {
    constructor(
        public position: number,
        public teamId: number,
        public teamCrestUrl: string,
        public teamName: string,
        public matchPlayed: number,
        public wins: number,
        public draws: number,
        public loses: number,
        public goalsFor: number,
        public goalsAgainst: number,
        public goalsDifference: number,
        public points: number
    ){}
}
