import { Component, OnInit } from '@angular/core';
import { TeamService } from '../team.service';
import { TeamSquad } from '../team-squad';

@Component({
  selector: 'app-team-squad',
  templateUrl: './team-squad.component.html',
  styleUrls: ['./team-squad.component.css']
})
export class TeamSquadComponent implements OnInit {

  teamId: number;
  squad: TeamSquad[];

  constructor(private teamService: TeamService) { }

  ngOnInit() {
    this.teamId = this.teamService.getTeamId();
    this.squad = this.teamService.fetchTeamSquad(this.teamId);
  }

}
