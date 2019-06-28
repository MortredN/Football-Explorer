import { Component, OnInit } from '@angular/core';
import { TeamService } from '../team.service';
import { TeamPosition } from './team-position';

@Component({
  selector: 'app-team-position',
  templateUrl: './team-position.component.html',
  styleUrls: ['./team-position.component.css']
})
export class TeamPositionComponent implements OnInit {

  teamId: number;
  table: TeamPosition[];

  constructor(private teamService: TeamService) { }

  ngOnInit() {
    this.teamId = this.teamService.getTeamId();
    this.table = this.teamService.fetchTeamPosition(this.teamId);
  }

}
