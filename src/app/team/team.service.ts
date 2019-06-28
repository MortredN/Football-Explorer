import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TeamMatch } from './team-match/team-match';
import { TeamPosition } from './team-position/team-position';
import { TeamSquad } from './team-squad/team-squad';

import { TokenService } from '../token.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private tokenService: TokenService, private http: HttpClient) { }

  teamId: number;
  setTeamId(teamId){this.teamId = teamId;}
  getTeamId(){return this.teamId;}
  competitionIds: number[];
  primaryCompetitionId: number;

  fetchTeamInfo(teamId: number) {
    const url = 'https://api.football-data.org/v2/teams/'+ teamId;
    var teamInfo: TeamInfo[] = [];
    this.http.get(url, {headers: this.tokenService.getHeaders()}).pipe(map(res => res)).subscribe(res => {
      let teamCrestUrl = res["crestUrl"];
      if(teamCrestUrl == null || teamCrestUrl == ""){
        teamCrestUrl = 'assets/img/unknown-team-crest.png';
      }
      let teamName = res["name"];
      let resArea = res["area"];
      let teamArea = resArea["name"];
      let teamAreaFlagUrl = 'assets/img/area-flag/' + teamArea + '.jpg';
      let resCompetitions: any[] = res["activeCompetitions"];
      let competitionIds: number[] = [];
      for(let ind = 0; ind < resCompetitions.length; ind++){
        let resCompetition = resCompetitions[ind];
        if(resCompetition["plan"] == "TIER_ONE"){
          competitionIds.push(resCompetition["id"]);
        }
      }
      this.competitionIds = competitionIds;
      let resPrimaryCompetition;
      if(resCompetitions[0]["id"] != 2001){
        resPrimaryCompetition = resCompetitions[0];
      } else {
        resPrimaryCompetition = resCompetitions[1];
      }
      let primaryCompetitionId = resPrimaryCompetition["id"];
      this.primaryCompetitionId = primaryCompetitionId;
      let primaryCompetitionName = resPrimaryCompetition["name"];
      teamInfo.push(new TeamInfo(teamCrestUrl, teamName, teamAreaFlagUrl,
        primaryCompetitionId, primaryCompetitionName));
    });
    return teamInfo;
  }

  fetchRecentPerformance(teamId: number) {
    const url = 'https://api.football-data.org/v2/teams/'+ teamId + '/matches?status=FINISHED';
    var recentPerformance: string[] = [];
    this.http.get(url, {headers: this.tokenService.getHeaders()}).pipe(map(res => res)).subscribe(res => {
      let resMatches: any[] = res["matches"];
      resMatches = resMatches.slice(-5);
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
    });
    return recentPerformance;
  }

  fetchFinishedMatches(teamId: number){
    let urlTeamsInCompetitionArray: string[] = [];
    for(let urlInd = 0; urlInd < this.competitionIds.length; urlInd++){
      let urlTeamsInCompetition = 'https://api.football-data.org/v2/competitions/'+ this.competitionIds[urlInd] +'/teams';
      urlTeamsInCompetitionArray.push(urlTeamsInCompetition);
    }
    let urlFinishedMatches = 'https://api.football-data.org/v2/teams/'+ teamId +'/matches?status=FINISHED';

    let obsTeamsInCompetitionArray: Observable<Object>[] = [];
    for(let obsInd = 0; obsInd < urlTeamsInCompetitionArray.length; obsInd++){
      let obsTeamsInCompetition = this.http.get(urlTeamsInCompetitionArray[obsInd], {headers: this.tokenService.getHeaders()}).pipe(map(res => res));
      obsTeamsInCompetitionArray.push(obsTeamsInCompetition);
    }
    let obsFinishedMatches = this.http.get(urlFinishedMatches, {headers: this.tokenService.getHeaders()}).pipe(map(res => res));

    let obsForkJoinsArray = obsTeamsInCompetitionArray;
    obsForkJoinsArray.push(obsFinishedMatches);

    var teamsInCompetitionInfo: TeamInCompetitionInfo[] = [];
    var finishedMatches: TeamMatch[] = [];
    
    forkJoin(obsForkJoinsArray).subscribe(res => {
      for(let resInd = 0; resInd < obsForkJoinsArray.length - 1; resInd++) {
        let resTeams: any[] = res[resInd]["teams"];
        for(let ind = 0; ind < resTeams.length; ind++) {
          let resTeam = resTeams[ind];
          let teamId = resTeam["id"];
          let teamName = resTeam["name"];
          let teamCrestUrl = resTeam["crestUrl"];
          if(teamCrestUrl == null || teamCrestUrl == ""){
            teamCrestUrl = 'assets/img/unknown-team-crest.png';
          }
          teamsInCompetitionInfo.push(new TeamInCompetitionInfo(teamId, teamName, teamCrestUrl));
        }
      }

      let resMatches: any[] = res[obsForkJoinsArray.length - 1]["matches"];
      for(let ind = 0; ind < resMatches.length; ind++){
        let resMatch = resMatches[ind];
        let matchId = resMatch["id"];
        let isHomeTeam: boolean;
        let opponentTeamId: number;
        let homeTeamRes = resMatch["homeTeam"], awayTeamRes = resMatch["awayTeam"];
        let homeTeamId = homeTeamRes["id"];
        if(teamId == homeTeamId){
          isHomeTeam = true;
          opponentTeamId = awayTeamRes["id"]; //awayTeamId
        } else {
          isHomeTeam = false;
          opponentTeamId = homeTeamId;
        }
        let opponentCrestUrl: string;
        let opponentName: string;
        for(let infoInd = 0; infoInd < teamsInCompetitionInfo.length; infoInd++){
          if(opponentTeamId == teamsInCompetitionInfo[infoInd].teamId){
            opponentCrestUrl = teamsInCompetitionInfo[infoInd].teamCrestUrl;
            opponentName = teamsInCompetitionInfo[infoInd].teamName;
          }
        }
        let resCompetition = resMatch["competition"];
        let competitionName = resCompetition["name"];
        let resScore = resMatch["score"];
        let ftScore = resScore["fullTime"];
        let ftHomeScore = ftScore["homeTeam"], ftAwayScore = ftScore["awayTeam"];
        let homeOrAway = isHomeTeam ? "Home" : "Away";
        let winner = resScore["winner"];
        let result: string;
        if(winner == "HOME_TEAM"){
          result = (isHomeTeam) ? 'Win' : 'Lose';
        } else if(winner == "AWAY_TEAM"){
          result = (isHomeTeam) ? 'Lose' : 'Win';
        } else {
          result = 'Draw';
        }
        let datetime = new Date(resMatch["utcDate"]);
        let date = datetime.getDate() + "/" + (datetime.getMonth() + 1) + "/" + datetime.getFullYear();
        let hoursStr = (datetime.getHours() < 10) ? ('0' + datetime.getHours()) : ('' + datetime.getHours());
        let minutesStr = (datetime.getMinutes() < 10) ? ('0' + datetime.getMinutes()) : ('' + datetime.getMinutes());
        let time = hoursStr + ":" + minutesStr;
        finishedMatches.unshift(new TeamMatch(matchId, opponentCrestUrl, opponentName,
          competitionName, ftHomeScore, ftAwayScore, homeOrAway, result, date, time));
      }
    });
    return finishedMatches;
  }

  fetchLiveAndScheduledMatches(teamId: number){
    let urlTeamsInCompetitionArray: string[] = [];
    for(let urlInd = 0; urlInd < this.competitionIds.length; urlInd++){
      let urlTeamsInCompetition = 'https://api.football-data.org/v2/competitions/'+ this.competitionIds[urlInd] +'/teams';
      urlTeamsInCompetitionArray.push(urlTeamsInCompetition);
    }
    let urlLiveMatches = 'https://api.football-data.org/v2/teams/'+ teamId +'/matches?status=IN_PLAY';
    let urlScheduledMatches = 'https://api.football-data.org/v2/teams/'+ teamId +'/matches?status=SCHEDULED';

    let obsTeamsInCompetitionArray: Observable<Object>[] = [];
    for(let obsInd = 0; obsInd < urlTeamsInCompetitionArray.length; obsInd++){
      let obsTeamsInCompetition = this.http.get(urlTeamsInCompetitionArray[obsInd], {headers: this.tokenService.getHeaders()}).pipe(map(res => res));
      obsTeamsInCompetitionArray.push(obsTeamsInCompetition);
    }
    let obsLiveMatches = this.http.get(urlLiveMatches, {headers: this.tokenService.getHeaders()}).pipe(map(res => res));
    let obsScheduledMatches = this.http.get(urlScheduledMatches, {headers: this.tokenService.getHeaders()}).pipe(map(res => res));

    let obsForkJoinsArray: Observable<Object>[] = obsTeamsInCompetitionArray;
    obsForkJoinsArray.push(obsLiveMatches);
    obsForkJoinsArray.push(obsScheduledMatches);

    var teamsInCompetitionInfo: TeamInCompetitionInfo[] = [];
    var liveAndScheduledMatches: TeamMatch[] = [];
    
    forkJoin(obsForkJoinsArray).subscribe(res => {
      for(let resInd = 0; resInd < obsForkJoinsArray.length - 2; resInd++) {
        let resTeams: any[] = res[resInd]["teams"];
        for(let ind = 0; ind < resTeams.length; ind++) {
          let resTeam = resTeams[ind];
          let teamId = resTeam["id"];
          let teamName = resTeam["name"];
          let teamCrestUrl = resTeam["crestUrl"];
          if(teamCrestUrl == null || teamCrestUrl == ""){
            teamCrestUrl = 'assets/img/unknown-team-crest.png';
          }
          teamsInCompetitionInfo.push(new TeamInCompetitionInfo(teamId, teamName, teamCrestUrl));
        }
      }

      for(let matchesInd = 2; matchesInd > 0; matchesInd--) {
        let resMatches: any[] = res[obsForkJoinsArray.length - matchesInd]["matches"];
        for(let ind = 0; ind < resMatches.length; ind++){
          let resMatch = resMatches[ind];
          let matchId = resMatch["id"];
          let isHomeTeam: boolean;
          let opponentTeamId: number;
          let homeTeamRes = resMatch["homeTeam"], awayTeamRes = resMatch["awayTeam"];
          let homeTeamId = homeTeamRes["id"];
          if(teamId == homeTeamId){
            isHomeTeam = true;
            opponentTeamId = awayTeamRes["id"]; //awayTeamId
          } else {
            isHomeTeam = false;
            opponentTeamId = homeTeamId;
          }
          let opponentCrestUrl: string;
          let opponentName: string;
          for(let infoInd = 0; infoInd < teamsInCompetitionInfo.length; infoInd++){
            if(opponentTeamId == teamsInCompetitionInfo[infoInd].teamId){
              opponentCrestUrl = teamsInCompetitionInfo[infoInd].teamCrestUrl;
              opponentName = teamsInCompetitionInfo[infoInd].teamName;
            }
          }
          let resCompetition = resMatch["competition"];
          let competitionName = resCompetition["name"];
          let resScore = resMatch["score"];
          let ftScore = resScore["fullTime"];
          let ftHomeScore = ftScore["homeTeam"], ftAwayScore = ftScore["awayTeam"];
          let homeOrAway = isHomeTeam ? "Home" : "Away";
          let winner = resScore["winner"];
          let result: string;
          if(winner == "HOME_TEAM"){
            result = (isHomeTeam) ? 'Win' : 'Lose';
          } else if(winner == "AWAY_TEAM"){
            result = (isHomeTeam) ? 'Lose' : 'Win';
          } else {
            result = 'Draw';
          }
          let datetime = new Date(resMatch["utcDate"]);
          let date = datetime.getDate() + "/" + (datetime.getMonth() + 1) + "/" + datetime.getFullYear();
          let hoursStr = (datetime.getHours() < 10) ? ('0' + datetime.getHours()) : ('' + datetime.getHours());
          let minutesStr = (datetime.getMinutes() < 10) ? ('0' + datetime.getMinutes()) : ('' + datetime.getMinutes());
          let time = (matchesInd == 2) ? 'LIVE' : (hoursStr + ":" + minutesStr);
          liveAndScheduledMatches.push(new TeamMatch(matchId, opponentCrestUrl, opponentName,
            competitionName, ftHomeScore, ftAwayScore, homeOrAway, result, date, time));
        }
      }
    });
    return liveAndScheduledMatches;
  }

  fetchTeamPosition(thisTeamId: number) {
    const url = 'https://api.football-data.org/v2/competitions/'+ this.primaryCompetitionId +'/standings?standingType=TOTAL';
    var table: TeamPosition[] = [];
    this.http.get(url, {headers: this.tokenService.getHeaders()}).pipe(map(res => res)).subscribe(res => {
      let resTable: any[] = res["standings"][0]["table"];
      for (let ind = 0; ind < resTable.length; ind++){
        let resTeam = resTable[ind];
        let position = resTeam["position"];
        let teamDetails = resTeam["team"];
        let teamId = teamDetails["id"];
        let sameTeam = (thisTeamId == teamId) ? "same" : "different"
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
        table.push(new TeamPosition(position, teamId, sameTeam, teamCrestUrl,
          teamName, matchPlayed, wins, draws, loses,
          goalsFor, goalsAgainst, goalsDifference, points));
      }
    });
    return table;
  }

  fetchTeamSquad(teamId: number) {
    const url = 'https://api.football-data.org/v2/teams/'+ teamId;
    var teamSquad: TeamSquad[] = [];
    this.http.get(url, {headers: this.tokenService.getHeaders()}).pipe(map(res => res)).subscribe(res => {
      let squad = res["squad"];
      for(let ind = 0; ind < squad.length; ind++){
        let staff = squad[ind];
        let name = staff["name"];
        let role: string = staff["role"];
        let shirtNumber: string;
        let position: string;
        if(role == "PLAYER"){
          shirtNumber = (staff["shirtNumber"] == null) ? "-" : "" + staff["shirtNumber"];
          position = staff["position"];
        } else {
          shirtNumber = "-";
          position = role.charAt(0).toUpperCase() + role.replace("_", " ").slice(1).toLowerCase();
        }
        teamSquad.push(new TeamSquad(name, shirtNumber, position));
      }
    });
    return teamSquad;
  }
}

export class TeamInfo {
  constructor(
    public teamCrestUrl: string,
    public teamName: string,
    public teamAreaFlagUrl: string,
    public primaryCompetitionId: number,
    public primaryCompetitionName: string
  ){}
}

class TeamInCompetitionInfo {
  constructor(
    public teamId: number,
    public teamName: string,
    public teamCrestUrl: string
  ){}
}
