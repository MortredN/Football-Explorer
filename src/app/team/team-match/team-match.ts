export class TeamMatch {
    constructor(
        public matchId: number,
        public opponentCrestUrl: string,
        public opponentName: string,
        public competitionName: string,
        public ftHomeScore: number, public ftAwayScore: number,
        public homeOrAway: string,
        public result: string,
        public date: string,
        public time: string
    ){}
}
