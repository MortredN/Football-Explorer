import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Competition } from './competition';

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {

  headers = new HttpHeaders({'X-Auth-Token': '0ef416bf73bc46d8825686b09433a0bd'});

  constructor(private http: HttpClient) { }

  fetchCompetitionNav() {
    const url = 'https://api.football-data.org/v2/competitions?plan=TIER_ONE';
    let competitions: Competition[] = [];
    this.http.get(url, {headers: this.headers}).pipe(
      map(res => res)
    ).subscribe(
      res => {
        let resComps: any[] = res["competitions"];
        let ind;
        for (ind = 0; ind < resComps.length; ind++){
          let resComp = resComps[ind];
          let id = resComp["id"];
          let name = resComp["name"];
          let area = resComp["area"];
          let areaName = area["name"];
          let areaFlagUrl = 'assets/img/area-flag/' + areaName + '.jpg';
          competitions.push(new Competition(id, name, areaFlagUrl));
        }
        competitions.sort((comp1, comp2) => (comp1.name > comp2.name) ? 1 : -1);
      }
    );
    return competitions;
  }
  
}
