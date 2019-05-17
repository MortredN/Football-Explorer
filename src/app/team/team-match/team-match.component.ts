import { Component, OnInit } from '@angular/core';
import { TeamService } from '../team.service';
import { TeamMatch } from '../team-match';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-match',
  templateUrl: './team-match.component.html',
  styleUrls: ['./team-match.component.css']
})
export class TeamMatchComponent implements OnInit {

  teamId: number;
  finishedMatches: TeamMatch[];
  liveAndScheduledMatches: TeamMatch[];

  constructor(private teamService: TeamService, private router: Router) { }

  ngOnInit() {
    this.teamId = this.teamService.getTeamId();
    this.finishedMatches = this.teamService.fetchFinishedMatches(this.teamId);
    this.liveAndScheduledMatches = this.teamService.fetchLiveAndScheduledMatches(this.teamId);
  }

  navigateToMatch(matchId: number){
    this.router.navigate(['/match', matchId]);
  }

}
