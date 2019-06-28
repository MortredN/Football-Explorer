import { Component, OnInit } from '@angular/core';
import { LeagueService} from '../league.service';
import { LeagueMatch } from './league-match';
import { Router } from '@angular/router';


@Component({
  selector: 'app-league-match',
  templateUrl: './league-match.component.html',
  styleUrls: ['./league-match.component.css']
})
export class LeagueMatchComponent implements OnInit {

  leagueId: number;
  liveMatches: LeagueMatch[];
  scheduledMatches: LeagueMatch[];
  finishedMatches: LeagueMatch[];
  
  constructor(private leagueService: LeagueService, private router: Router) {
  }

  ngOnInit() {
    this.leagueId = this.leagueService.getLeagueId();
    this.liveMatches = this.leagueService.fetchLiveMatches(this.leagueId);
    this.scheduledMatches = this.leagueService.fetchScheduledMatches(this.leagueId);
    this.finishedMatches = this.leagueService.fetchFinishedMatches(this.leagueId);
  }

  navigateToMatch(matchId: number){
    this.router.navigate(['/match', matchId]);
  }

}
