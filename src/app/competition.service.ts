import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {

  constructor(private tokenService: TokenService, private http: HttpClient) { }

  fetchCompetitionNav() {
    const url = 'https://api.football-data.org/v2/competitions?plan=TIER_ONE';
    let competitions: Competition[] = [];
    this.http.get(url, {headers: this.tokenService.getHeaders()}).pipe(
      map(res => res)
    ).subscribe(res => {
      let resComps: any[] = res["competitions"];
      for (let ind = 0; ind < resComps.length; ind++){
        let resComp = resComps[ind];
        let id = resComp["id"];
        let name = resComp["name"];
        let area = resComp["area"];
        let areaName = area["name"];
        let areaFlagUrl = 'assets/img/area-flag/' + areaName + '.jpg';
        competitions.push(new Competition(id, name, areaFlagUrl));
      }
      competitions.sort((comp1, comp2) => (comp1.name > comp2.name) ? 1 : -1);
    });
    return competitions;
  }
}

export class Competition {
  constructor(
    public id: number,
    public name: string,
    public areaFlagUrl: string){}
}
