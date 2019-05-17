import { Component, OnInit } from '@angular/core';
import { CompetitionService } from '../competition.service';
import { Competition } from '../competition';

@Component({
  selector: 'app-leaguenav',
  templateUrl: './leaguenav.component.html',
  styleUrls: ['./leaguenav.component.css']
})
export class LeaguenavComponent implements OnInit {

  competitions: Competition[];

  constructor(private competitionService: CompetitionService) { }

  ngOnInit() {
    this.competitions = this.competitionService.fetchCompetitionNav();
  }
}
