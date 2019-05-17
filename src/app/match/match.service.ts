import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  matchId: number;

  tokens = [
    {token: '73db4763234e4741aeb5e65834e4e811', isAvailable: true},
    {token: 'a1a0689a90464eb884d5e8b48782c5d7', isAvailable: true},
    {token: 'cd53b999fa594fa48f979ead7e309456', isAvailable: true},
    {token: '347dcdd698c54c878f832856c8d524f0', isAvailable: true}
  ]
  tokenIndex = 0;

  getHeaders(){
    let headers: HttpHeaders;
    let isHeadersEmpty = true;
    while(isHeadersEmpty){
      if(this.tokens[this.tokenIndex]["isAvailable"]){
        headers = new HttpHeaders({'X-Auth-Token': this.tokens[this.tokenIndex]["token"]});
        isHeadersEmpty = false;
        if(this.tokenIndex == (this.tokens.length - 1)){
          for(let i = 0; i < this.tokens.length; i++){
            this.tokens[i]["isAvailable"] = true;
          }
          this.tokenIndex = 0;
        }
        else {
          this.tokens[this.tokenIndex]["isAvailable"] = false;
        }
      } else {
        this.tokenIndex++;
      }
    }
    return headers;
  }

  constructor(private http: HttpClient) { }

  fetchMatchInfo(matchId: number){
    const matchUrl = 'https://api.football-data.org/v2/matches/'+ matchId;

    let obsTeamsFromCompetition = this.http.get(matchUrl, {headers: this.getHeaders()}).pipe(
      mergeMap((resMatch) => {
        return this.http.get('https://api.football-data.org/v2/competitions/' +
          resMatch["match"]["competition"]["id"] + '/teams', {headers: this.getHeaders()}).pipe(
            map(resCompetition => resCompetition)
          );
      })
    );
    let obsMatch = this.http.get(matchUrl, {headers: this.getHeaders()}).pipe(map(res => res));
    let obsHomeTeamMatches = this.http.get(matchUrl, {headers: this.getHeaders()}).pipe(
      mergeMap((resMatch) => {
        return this.http.get('https://api.football-data.org/v2/teams/' +
          resMatch["match"]["homeTeam"]["id"] + '/matches', {headers: this.getHeaders()}).pipe(
            map(resTeam => resTeam)
          );
      })
    );
    let obsAwayTeamMatches = this.http.get(matchUrl, {headers: this.getHeaders()}).pipe(
      mergeMap((resMatch) => {
        return this.http.get('https://api.football-data.org/v2/teams/' +
          resMatch["match"]["awayTeam"]["id"] + '/matches', {headers: this.getHeaders()}).pipe(
            map(resTeam => resTeam)
          );
      })
    );

    let teamCrestUrls: TeamCrestUrl[] = [];
    let h2hMatches: H2HMatches[] = [];
    let homeRecentPerformance: string[];
    let awayRecentPerformance: string[];
    let matchInfo: MatchInfo[] = [];

    forkJoin([obsTeamsFromCompetition, obsMatch, obsHomeTeamMatches, obsAwayTeamMatches]).subscribe(
      res => {
        let resTeams: any[] = res[0]["teams"];
        for(let ind = 0; ind < resTeams.length; ind++) {
          let resTeam = resTeams[ind];
          let teamId = resTeam["id"];
          let teamCrestUrl = resTeam["crestUrl"];
          if(teamCrestUrl == null || teamCrestUrl == ""){
            teamCrestUrl = 'assets/img/unknown-team-crest.png';
          }
          teamCrestUrls.push(new TeamCrestUrl(teamId, teamCrestUrl));
        }

        let resMatch = res[1]["match"];
        let resHomeTeam = resMatch["homeTeam"];
        let homeTeamId = resHomeTeam["id"];
        let homeTeamName = resHomeTeam["name"];
        let resAwayTeam = resMatch["awayTeam"];
        let awayTeamId = resAwayTeam["id"];
        let awayTeamName = resAwayTeam["name"];
        let resFtScore = resMatch["score"]["fullTime"];
        let ftHomeScore = resFtScore["homeTeam"];
        let ftAwayScore = resFtScore["awayTeam"];
        let status = resMatch["status"];
        let datetime = new Date(resMatch["utcDate"]);
        let date = datetime.getDate() + "/" + (datetime.getMonth() + 1) + "/" + datetime.getFullYear();
        let hoursStr = (datetime.getHours() < 10) ? ('0' + datetime.getHours()) : ('' + datetime.getHours());
        let minutesStr = (datetime.getMinutes() < 10) ? ('0' + datetime.getMinutes()) : ('' + datetime.getMinutes());
        let time: string;
        if(status == "FINISHED"){
          time = "FT"
        } else if(status == "IN_PLAY"){
          time = "LIVE"
        } else {
          time = hoursStr + ":" + minutesStr;
        }
        let competitionName = resMatch["competition"]["name"];
        let homeTeamCrestUrl = "";
        let awayTeamCrestUrl = "";
        for(let crestInd = 0; crestInd < teamCrestUrls.length; crestInd++){
          if(homeTeamId == teamCrestUrls[crestInd].teamId){
            homeTeamCrestUrl = teamCrestUrls[crestInd].teamCrestUrl;
          }
          if(awayTeamId == teamCrestUrls[crestInd].teamId){
            awayTeamCrestUrl = teamCrestUrls[crestInd].teamCrestUrl;
          }
        }
        let resHead2Head = res[1]["head2head"]["homeTeam"];
        let h2hHomeWins = resHead2Head["wins"];
        let h2hDraws = resHead2Head["draws"];
        let h2hAwayWins = resHead2Head["losses"];

        let h2hResMatches: any[] = res[2]["matches"];
        for(let ind = 0; ind < h2hResMatches.length; ind++) {
          let h2hResMatch = h2hResMatches[ind];
          let h2hResHomeTeam = h2hResMatch["homeTeam"];
          let h2hResAwayTeam = h2hResMatch["awayTeam"];
          let h2hHomeTeamId = h2hResHomeTeam["id"];
          let h2hAwayTeamId = h2hResAwayTeam["id"];
          if((h2hHomeTeamId == homeTeamId && h2hAwayTeamId == awayTeamId)
          || (h2hHomeTeamId == awayTeamId && h2hAwayTeamId == homeTeamId)){
            let h2hHomeTeamName = h2hResHomeTeam["name"];
            let h2hAwayTeamName = h2hResAwayTeam["name"];
            let h2hResFtScore = h2hResMatch["score"]["fullTime"];
            let h2hFtHomeScore = h2hResFtScore["homeTeam"];
            let h2hFtAwayScore = h2hResFtScore["awayTeam"];
            let h2hStatus = h2hResMatch["status"];
            let h2hDatetime = new Date(h2hResMatch["utcDate"]);
            let h2hDate = h2hDatetime.getDate() + "/" + (h2hDatetime.getMonth() + 1) + "/" + h2hDatetime.getFullYear();
            let h2hHoursStr = (h2hDatetime.getHours() < 10) ? ('0' + h2hDatetime.getHours()) : ('' + h2hDatetime.getHours());
            let h2hMinutesStr = (h2hDatetime.getMinutes() < 10) ? ('0' + h2hDatetime.getMinutes()) : ('' + h2hDatetime.getMinutes());
            let h2hTime: string;
            if(h2hStatus == "FINISHED"){
              h2hTime = "FT"
            } else if(h2hStatus == "IN_PLAY"){
              h2hTime = "LIVE"
            } else {
              h2hTime = h2hHoursStr + ":" + h2hMinutesStr;
            }
            let h2hHomeTeamCrestUrl = "";
            let h2hAwayTeamCrestUrl = "";
            for(let crestInd = 0; crestInd < teamCrestUrls.length; crestInd++){
              if(h2hHomeTeamId == teamCrestUrls[crestInd].teamId){
                h2hHomeTeamCrestUrl = teamCrestUrls[crestInd].teamCrestUrl;
              }
              if(h2hAwayTeamId == teamCrestUrls[crestInd].teamId){
                h2hAwayTeamCrestUrl = teamCrestUrls[crestInd].teamCrestUrl;
              }
            }
            h2hMatches.push(new H2HMatches(h2hStatus, h2hHomeTeamName, h2hAwayTeamName,
              h2hHomeTeamCrestUrl, h2hAwayTeamCrestUrl, h2hFtHomeScore, h2hFtAwayScore, h2hDate, h2hTime));
          }
        }

        let homeResMatches: any[] = res[2]["matches"];
        let homeMatches: any[] = [];
        for(let ind = 0; ind < homeResMatches.length; ind++) {
          if(homeResMatches[ind]["status"] == "FINISHED"){
            homeMatches.push(homeResMatches[ind]);
          }
        }
        homeMatches = homeMatches.slice(-5);
        homeRecentPerformance = this.fetchRecentPerformance(homeMatches, homeTeamId);

        let awayResMatches: any[] = res[2]["matches"];
        let awayMatches: any[] = [];
        for(let ind = 0; ind < awayResMatches.length; ind++) {
          if(awayResMatches[ind]["status"] == "FINISHED"){
            awayMatches.push(awayResMatches[ind]);
          }
        }
        awayMatches = awayMatches.slice(-5);
        awayRecentPerformance = this.fetchRecentPerformance(awayMatches, awayTeamId);

        matchInfo.push(new MatchInfo(status, homeTeamId, awayTeamId, homeTeamName, awayTeamName,
          homeTeamCrestUrl, awayTeamCrestUrl, ftHomeScore, ftAwayScore, date, time, competitionName,
          h2hHomeWins, h2hDraws, h2hAwayWins, h2hMatches, homeRecentPerformance, awayRecentPerformance));
      }
    )
    return matchInfo;
  }

  fetchRecentPerformance(resMatches: any[], teamId: number){
    var recentPerformance: string[] = [];
    for(let ind = 0; ind < resMatches.length; ind++) {
      let result: string;
      let resMatch = resMatches[ind];
      let isHomeTeam: boolean;
      let homeTeamRes = resMatch["homeTeam"];
      let homeTeamId = homeTeamRes["id"];
      if(teamId == homeTeamId){
        isHomeTeam = true;
      } else {
        isHomeTeam = false;
      }
      let resScore = resMatch["score"];
      let winner = resScore["winner"];
      if(winner == "HOME_TEAM"){
        result = (isHomeTeam) ? 'W' : 'L';
      } else if(winner == "AWAY_TEAM"){
        result = (isHomeTeam) ? 'L' : 'W';
      } else {
        result = 'D';
      }
      recentPerformance.push(result);
    }
    return recentPerformance;
  }
}


export class MatchInfo {
  constructor(
    public status: string,
    public homeTeamId: number,
    public awayTeamId: number,
    public homeTeamName: string,
    public awayTeamName: string,
    public homeTeamCrestUrl: string,
    public awayTeamCrestUrl: string,
    public ftHomeScore: number,
    public ftAwayScore: number,
    public date: string,
    public time: string,
    public competitionName: string,
    public h2hHomeWins: number,
    public h2hDraws: number,
    public h2hAwayWins: number,
    public h2hMatches: H2HMatches[],
    public homeRecentPerformance: string[],
    public awayRecentPerformance: string[]
  ){}
}

class TeamCrestUrl {
  constructor(
    public teamId: number,
    public teamCrestUrl: string
  ){}
}

class H2HMatches {
  constructor(
    public h2hStatus: string,
    public h2hHomeTeamName: string,
    public h2hAwayTeamName: string,
    public h2hHomeTeamCrestUrl: string,
    public h2hAwayTeamCrestUrl: string,
    public h2hFtHomeScore: number,
    public h2hFtAwayScore: number,
    public h2hDate: string,
    public h2hTime: string
  ){}
}