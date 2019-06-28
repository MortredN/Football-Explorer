import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { LeagueTable } from './league-table/league-table';
import { LeagueMatch } from './league-match/league-match';

import { TokenService } from '../token.service';

@Injectable({
  providedIn: 'root'
})
export class LeagueService {

  constructor(private tokenService: TokenService, private http: HttpClient) { }

  leagueId: number;
  setLeagueId(leagueId){this.leagueId = leagueId;}
  getLeagueId(){return this.leagueId;}

  fetchLeagueInfo(leagueId: number) {
    const url = 'https://api.football-data.org/v2/competitions/'+ leagueId;
    var leagueInfo: LeagueInfo[] = [];
    this.http.get(url, {headers: this.tokenService.getHeaders()}).pipe(map(res => res)).subscribe(res => {
      let resArea = res["area"];
      let leagueArea = resArea["name"];
      let leagueAreaFlagUrl = 'assets/img/area-flag/' + leagueArea + '.jpg';
      let leagueName = res["name"];
      leagueInfo.push(new LeagueInfo(leagueAreaFlagUrl, leagueName));
    });
    return leagueInfo;
  }

  fetchLeagueTable(leagueId: number) {
    const url = 'https://api.football-data.org/v2/competitions/'+ leagueId +'/standings?standingType=TOTAL';
    var table: LeagueTable[] = [];
    this.http.get(url, {headers: this.tokenService.getHeaders()}).pipe(map(res => res)).subscribe(res => {
      let resTable: any[] = res["standings"][0]["table"];
      for (let ind = 0; ind < resTable.length; ind++){
        let resTeam = resTable[ind];
        let position = resTeam["position"];
        let teamDetails = resTeam["team"];
        let teamId = teamDetails["id"];
        let teamCrestUrl = teamDetails["crestUrl"];
        if(teamCrestUrl == null || teamCrestUrl == ""){
          teamCrestUrl = 'assets/img/unknown-team-crest.png';
        }
        let teamName = teamDetails["name"];
        let matchPlayed = resTeam["playedGames"];
        let wins = resTeam["won"];
        let draws = resTeam["draw"];
        let loses = resTeam["lost"];
        let goalsFor = resTeam["goalsFor"];
        let goalsAgainst = resTeam["goalsAgainst"];
        let goalsDifference = resTeam["goalDifference"];
        let points = resTeam["points"];
        table.push(new LeagueTable(position, teamId, teamCrestUrl,
          teamName, matchPlayed, wins, draws, loses,
          goalsFor, goalsAgainst, goalsDifference, points));
      }
    });
    return table;
  }

  fetchGroupTables(leagueId: number) {
    const url = 'https://api.football-data.org/v2/competitions/'+ leagueId +'/standings?standingType=TOTAL';
    var groupTables: LeagueGroupTables[] = [];
    this.http.get(url, {headers: this.tokenService.getHeaders()}).pipe(map(res => res)).subscribe(res => {
      let resStandings: any[] = res["standings"];
      for(let tablesInd = 0; tablesInd < resStandings.length; tablesInd++){
        let table: LeagueTable[] = [];
        let resTotalStanding = resStandings[tablesInd];
        let groupName: string = resTotalStanding["group"];
        groupName = groupName.replace("_", " ");
        let resTable: any[] = resTotalStanding["table"];
        for (let ind = 0; ind < resTable.length; ind++){
          let resTeam = resTable[ind];
          let position = resTeam["position"];
          let teamDetails = resTeam["team"];
          let teamId = teamDetails["id"];
          let teamCrestUrl = teamDetails["crestUrl"];
          if(teamCrestUrl == null || teamCrestUrl == ""){
            teamCrestUrl = 'assets/img/unknown-team-crest.png';
          }
          let teamName = teamDetails["name"];
          let matchPlayed = resTeam["playedGames"];
          let wins = resTeam["won"];
          let draws = resTeam["draw"];
          let loses = resTeam["lost"];
          let goalsFor = resTeam["goalsFor"];
          let goalsAgainst = resTeam["goalsAgainst"];
          let goalsDifference = resTeam["goalDifference"];
          let points = resTeam["points"];
          table.push(new LeagueTable(position, teamId, teamCrestUrl,
            teamName, matchPlayed, wins, draws, loses,
            goalsFor, goalsAgainst, goalsDifference, points));
        }
        groupTables.push(new LeagueGroupTables(groupName, table));
      }
    });
    return groupTables;
  }

  fetchFinishedMatches(leagueId: number){
    const urlTeams = 'https://api.football-data.org/v2/competitions/'+ leagueId +'/teams';
    const urlFinishedMatches = 'https://api.football-data.org/v2/competitions/'+ leagueId +'/matches?status=FINISHED';
    let obsTeams = this.http.get(urlTeams, {headers: this.tokenService.getHeaders()}).pipe(map(res => res));
    let obsFinishedMatches = this.http.get(urlFinishedMatches, {headers: this.tokenService.getHeaders()}).pipe(map(res => res));

    var teamCrestUrls: TeamCrestUrl[] = [];
    var finishedMatches: LeagueMatch[] = [];
    
    forkJoin([obsTeams, obsFinishedMatches]).subscribe(res => {
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

      let resMatches: any[] = res[1]["matches"];
      for(let ind = 0; ind < resMatches.length; ind++){
        let resMatch = resMatches[ind];
        let matchId = resMatch["id"];
        let datetime = new Date(resMatch["utcDate"]);
        let date = datetime.getDate() + "/" + (datetime.getMonth() + 1) + "/" + datetime.getFullYear();
        let hoursStr = (datetime.getHours() < 10) ? ('0' + datetime.getHours()) : ('' + datetime.getHours());
        let minutesStr = (datetime.getMinutes() < 10) ? ('0' + datetime.getMinutes()) : ('' + datetime.getMinutes());
        let time = hoursStr + ":" + minutesStr;
        let status = resMatch["status"];
        let score = resMatch["score"];
        let ftScore = score["fullTime"];
        let ftHomeScore = ftScore["homeTeam"], ftAwayScore = ftScore["awayTeam"];
        let homeTeamRes = resMatch["homeTeam"], awayTeamRes = resMatch["awayTeam"];
        let homeTeamId = homeTeamRes["id"], awayTeamId = awayTeamRes["id"];
        let homeTeamName = homeTeamRes["name"], awayTeamName = awayTeamRes["name"];
        let homeTeamCrestUrl = "", awayTeamCrestUrl = "";

        for(let crestInd = 0; crestInd < teamCrestUrls.length; crestInd++){
          if(homeTeamId == teamCrestUrls[crestInd].teamId){
            homeTeamCrestUrl = teamCrestUrls[crestInd].teamCrestUrl;
          }
          if(awayTeamId == teamCrestUrls[crestInd].teamId){
            awayTeamCrestUrl = teamCrestUrls[crestInd].teamCrestUrl;
          }
        }

        finishedMatches.unshift(new LeagueMatch(matchId, date, time, status,
          ftHomeScore, ftAwayScore, homeTeamId, awayTeamId,
          homeTeamName, awayTeamName, homeTeamCrestUrl, awayTeamCrestUrl));
      }
    });
    return finishedMatches;
  }

  fetchScheduledMatches(leagueId: number){
    const urlTeams = 'https://api.football-data.org/v2/competitions/'+ leagueId +'/teams';
    const urlScheduledMatches = 'https://api.football-data.org/v2/competitions/'+ leagueId +'/matches?status=SCHEDULED';
    let obsTeams = this.http.get(urlTeams, {headers: this.tokenService.getHeaders()}).pipe(map(res => res));
    let obsScheduledMatches = this.http.get(urlScheduledMatches, {headers: this.tokenService.getHeaders()}).pipe(map(res => res));

    var teamCrestUrls: TeamCrestUrl[] = [];
    var scheduledMatches: LeagueMatch[] = [];
    
    forkJoin([obsTeams, obsScheduledMatches]).subscribe(res => {
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

      let resMatches: any[] = res[1]["matches"];
      for(let ind = 0; ind < resMatches.length; ind++){
        let resMatch = resMatches[ind];
        let matchId = resMatch["id"];
        let datetime = new Date(resMatch["utcDate"]);
        let date = datetime.getDate() + "/" + (datetime.getMonth() + 1) + "/" + datetime.getFullYear();
        let hoursStr = (datetime.getHours() < 10) ? ('0' + datetime.getHours()) : ('' + datetime.getHours());
        let minutesStr = (datetime.getMinutes() < 10) ? ('0' + datetime.getMinutes()) : ('' + datetime.getMinutes());
        let time = hoursStr + ":" + minutesStr;
        let status = resMatch["status"];
        let score = resMatch["score"];
        let ftScore = score["fullTime"];
        let ftHomeScore = ftScore["homeTeam"], ftAwayScore = ftScore["awayTeam"];
        let homeTeamRes = resMatch["homeTeam"], awayTeamRes = resMatch["awayTeam"];
        let homeTeamId = homeTeamRes["id"], awayTeamId = awayTeamRes["id"];
        let homeTeamName = homeTeamRes["name"], awayTeamName = awayTeamRes["name"];
        let homeTeamCrestUrl = "", awayTeamCrestUrl = "";

        for(let crestInd = 0; crestInd < teamCrestUrls.length; crestInd++){
          if(homeTeamId == teamCrestUrls[crestInd].teamId){
            homeTeamCrestUrl = teamCrestUrls[crestInd].teamCrestUrl;
          }
          if(awayTeamId == teamCrestUrls[crestInd].teamId){
            awayTeamCrestUrl = teamCrestUrls[crestInd].teamCrestUrl;
          }
        }

        scheduledMatches.push(new LeagueMatch(matchId, date, time, status,
          ftHomeScore, ftAwayScore, homeTeamId, awayTeamId,
          homeTeamName, awayTeamName, homeTeamCrestUrl, awayTeamCrestUrl));
      }
    });
    return scheduledMatches;
  }

  fetchLiveMatches(leagueId: number){
    const urlTeams = 'https://api.football-data.org/v2/competitions/'+ leagueId +'/teams';
    const urlLiveMatches = 'https://api.football-data.org/v2/competitions/'+ leagueId +'/matches?status=IN_PLAY';
    let obsTeams = this.http.get(urlTeams, {headers: this.tokenService.getHeaders()}).pipe(map(res => res));
    let obsLiveMatches = this.http.get(urlLiveMatches, {headers: this.tokenService.getHeaders()}).pipe(map(res => res));

    var teamCrestUrls: TeamCrestUrl[] = [];
    var liveMatches: LeagueMatch[] = [];
    
    forkJoin([obsTeams, obsLiveMatches]).subscribe(res => {
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

      let resMatches: any[] = res[1]["matches"];
      for(let ind = 0; ind < resMatches.length; ind++){
        let resMatch = resMatches[ind];
        let matchId = resMatch["id"];
        let datetime = new Date(resMatch["utcDate"]);
        let date = datetime.getDate() + "/" + (datetime.getMonth() + 1) + "/" + datetime.getFullYear();
        let hoursStr = (datetime.getHours() < 10) ? ('0' + datetime.getHours()) : ('' + datetime.getHours());
        let minutesStr = (datetime.getMinutes() < 10) ? ('0' + datetime.getMinutes()) : ('' + datetime.getMinutes());
        let time = hoursStr + ":" + minutesStr;
        let status = resMatch["status"];
        let score = resMatch["score"];
        let ftScore = score["fullTime"];
        let ftHomeScore = ftScore["homeTeam"], ftAwayScore = ftScore["awayTeam"];
        let homeTeamRes = resMatch["homeTeam"], awayTeamRes = resMatch["awayTeam"];
        let homeTeamId = homeTeamRes["id"], awayTeamId = awayTeamRes["id"];
        let homeTeamName = homeTeamRes["name"], awayTeamName = awayTeamRes["name"];
        let homeTeamCrestUrl = "", awayTeamCrestUrl = "";

        for(let crestInd = 0; crestInd < teamCrestUrls.length; crestInd++){
          if(homeTeamId == teamCrestUrls[crestInd].teamId){
            homeTeamCrestUrl = teamCrestUrls[crestInd].teamCrestUrl;
          }
          if(awayTeamId == teamCrestUrls[crestInd].teamId){
            awayTeamCrestUrl = teamCrestUrls[crestInd].teamCrestUrl;
          }
        }

        liveMatches.push(new LeagueMatch(matchId, date, time, status,
          ftHomeScore, ftAwayScore, homeTeamId, awayTeamId,
          homeTeamName, awayTeamName, homeTeamCrestUrl, awayTeamCrestUrl));
      }
    });
    return liveMatches;
  }

  fetchTopScorers(leagueId: number) {
    const urlTeams = 'https://api.football-data.org/v2/competitions/'+ leagueId +'/teams';
    const urlScorers = 'https://api.football-data.org/v2/competitions/'+ leagueId +'/scorers';
    let obsTeams = this.http.get(urlTeams, {headers: this.tokenService.getHeaders()}).pipe(map(res => res));
    let obsScorers = this.http.get(urlScorers, {headers: this.tokenService.getHeaders()}).pipe(map(res => res));

    var teamCrestUrls: TeamCrestUrl[] = [];
    var topScorers: LeagueScorer[] = [];

    forkJoin([obsTeams, obsScorers]).subscribe(res => {
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

      let resScorers: any[] = res[1]["scorers"];
      for(let ind = 0; ind < resScorers.length; ind++) {
        let resScorer = resScorers[ind];
        let resPlayer = resScorer["player"];
        let playerName = resPlayer["name"];
        let goals = resScorer["numberOfGoals"];
        let resTeam = resScorer["team"];
        let teamId = resTeam["id"];
        let teamCrestUrl = "";

        for(let crestInd = 0; crestInd < teamCrestUrls.length; crestInd++){
          if(teamId == teamCrestUrls[crestInd].teamId){
            teamCrestUrl = teamCrestUrls[crestInd].teamCrestUrl;
          }
        }

        topScorers.push(new LeagueScorer(playerName, goals, teamCrestUrl));
      }
    });
    return topScorers;
  }
}

export class LeagueInfo {
  constructor(
    public leagueAreaFlagUrl: string,
    public leagueName: string
  ){}
}

export class LeagueGroupTables {
  constructor(
    public groupName: string,
    public table: LeagueTable[]
  ){}
}

class TeamCrestUrl {
  constructor(
    public teamId: number,
    public teamCrestUrl: string
  ){}
}

export class LeagueScorer {
  constructor(
      public playerName: string,
      public goals: number,
      public teamCrestUrl: string
  ){}
}
