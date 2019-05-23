import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  tokens = [
    {token: '73db4763234e4741aeb5e65834e4e811', isAvailable: true},
    {token: 'a1a0689a90464eb884d5e8b48782c5d7', isAvailable: true},
    {token: 'cd53b999fa594fa48f979ead7e309456', isAvailable: true},
    {token: '347dcdd698c54c878f832856c8d524f0', isAvailable: true},
    {token: '697644213ee94d909086c723fdaab0fb', isAvailable: true}
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

  fetchMatches(){
    let obsTeamsInAllCompetitions: Observable<[]> = this.http.get('https://api.football-data.org/v2/competitions?plan=TIER_ONE',
    {headers: this.getHeaders()}).pipe(
      mergeMap((resCompetitions) => {
        let competitionsArray = resCompetitions["competitions"];
        let resCompetitionsArray = [];
        let obsCompetitionsArray;
        for(let i = 0; i < competitionsArray.length; i++){
          let resCom = this.http.get('https://api.football-data.org/v2/competitions/' +
          competitionsArray[i]["id"] + '/teams', {headers: this.getHeaders()}).pipe(
            map(resCompetition => resCompetition)
          );
          resCompetitionsArray.push(resCom)
          obsCompetitionsArray = forkJoin(resCompetitionsArray)
        }
        return obsCompetitionsArray;
      })
    );

    let strEreyesterday = this.getStrObsDate(-2);
    let strOvermorrow = this.getStrObsDate(2);
    let obsMatches = this.http.get('https://api.football-data.org/v2/matches?dateFrom='+ strEreyesterday + '&dateTo=' + strOvermorrow,
    {headers: this.getHeaders()}).pipe(
      map(res => res)
    )

    let teamCrestUrls: TeamCrestUrl[] = [];
    let homePageDates: HomePageDate[] = [
      /* 0 */ {name: "ereyesterday", matches: []},
      /* 1 */ {name: "yesterday", matches:[]},
      /* 2 */ {name: "today", matches:[]},
      /* 3 */ {name: "tomorrow", matches:[]},
      /* 4 */ {name: "overmorrow", matches:[]}
    ];

    forkJoin([obsTeamsInAllCompetitions, obsMatches]).subscribe(
      res => {
        let competitionsArray = res[0];
        for(let compInd = 0; compInd < competitionsArray.length; compInd++){
          let resTeams: any[] = competitionsArray[compInd]["teams"];
          for(let ind = 0; ind < resTeams.length; ind++) {
            let resTeam = resTeams[ind];
            let teamId = resTeam["id"];
            let teamCrestUrl = resTeam["crestUrl"];
            if(teamCrestUrl == null || teamCrestUrl == ""){
              teamCrestUrl = 'assets/img/unknown-team-crest.png';
            }
            teamCrestUrls.push(new TeamCrestUrl(teamId, teamCrestUrl));
          }
        }
        teamCrestUrls.sort((team1, team2) => (team1.teamId > team2.teamId) ? 1 : -1);
        let sortIndex = 0;
        while(sortIndex < (teamCrestUrls.length - 1)){
          if(teamCrestUrls[sortIndex]["teamId"] == teamCrestUrls[sortIndex + 1]["teamId"]){
            teamCrestUrls.splice((sortIndex + 1), 1);
          } else {
            sortIndex++;
          }
        }

        let matchesArray = res[1]["matches"];
        for(let matchInd = 0; matchInd < matchesArray.length; matchInd++){
          let resMatch = matchesArray[matchInd];
          let matchId = resMatch["id"];
          let resHomeTeam = resMatch["homeTeam"];
          let homeTeamId = resHomeTeam["id"];
          let homeTeamName = resHomeTeam["name"];
          let resAwayTeam = resMatch["awayTeam"];
          let awayTeamId = resAwayTeam["id"];
          let awayTeamName = resAwayTeam["name"];
          let resFtScore = resMatch["score"]["fullTime"];
          let ftHomeScore = resFtScore["homeTeam"];
          let ftAwayScore = resFtScore["awayTeam"];
          let datetime = new Date(resMatch["utcDate"]);
          let date = datetime.getDate() + "/" + (datetime.getMonth() + 1) + "/" + datetime.getFullYear();
          let hoursStr = (datetime.getHours() < 10) ? ('0' + datetime.getHours()) : ('' + datetime.getHours());
          let minutesStr = (datetime.getMinutes() < 10) ? ('0' + datetime.getMinutes()) : ('' + datetime.getMinutes());
          let time: string;
          let status = resMatch["status"];
          if(status == "FINISHED"){
            time = "FT"
          } else if(status == "IN_PLAY"){
            time = "LIVE"
          } else {
            time = hoursStr + ":" + minutesStr;
          }
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
          
          let insertMatch = new HomePageMatch(matchId, homeTeamName, awayTeamName,
            homeTeamCrestUrl, awayTeamCrestUrl, ftHomeScore, ftAwayScore, date, time, status);
          let currentDate = new Date();
          if(datetime.getDate() == currentDate.getDate() - 2){
            homePageDates[0].matches.push(insertMatch);
          } else if(datetime.getDate() == currentDate.getDate() - 1){
            homePageDates[1].matches.push(insertMatch);
          } else if(datetime.getDate() == currentDate.getDate()){
            homePageDates[2].matches.push(insertMatch);
          } else if(datetime.getDate() == currentDate.getDate() + 1){
            homePageDates[3].matches.push(insertMatch);
          } else {
            homePageDates[4].matches.push(insertMatch);
          }          
        }
      }
    )
    return homePageDates;
  }

  getStrObsDate(days: number){
    let date = new Date();
    date.setUTCDate(date.getUTCDate() + days);
    let strDay = (date.getUTCDate() < 10) ? "0" + date.getUTCDate() : "" + date.getUTCDate();
    let strMonth = (date.getUTCMonth() + 1 < 10) ? "0" + (date.getUTCMonth() + 1) : "" + (date.getUTCMonth() + 1);
    return date.getUTCFullYear() + "-" + strMonth + "-" + strDay;
  }
}

export class HomePageDate {
  constructor(
    public name: string,
    public matches: HomePageMatch[]
  ){}
}

class HomePageMatch {
  constructor(
    public matchId: number,
    public homeTeamName: string,
    public awayTeamName: string,
    public homeTeamCrestUrl: string,
    public awayTeamCrestUrl: string,
    public ftHomeScore: number,
    public ftAwayScore: number,
    public date: string,
    public time: string,
    public status: string
  ){}
}

class TeamCrestUrl {
  constructor(
    public teamId: number,
    public teamCrestUrl: string
  ){}
}