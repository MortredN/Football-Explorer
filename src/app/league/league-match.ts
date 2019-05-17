export class LeagueMatch {
    constructor(
        public matchId: number,
        public date: string,
        public time: string,
        public status: string,
        public ftHomeScore: number,
        public ftAwayScore: number,
        public homeTeamId: number,
        public awayTeamId: number,
        public homeTeamName: string,
        public awayTeamName: string,
        public homeTeamCrestUrl: string,
        public awayTeamCrestUrl: string
    ){}
}
