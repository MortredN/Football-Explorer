import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService, TeamInfo } from './team.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  teamId: number;
  teamInfo: TeamInfo[];
  recentPerformance: string[];

  constructor(private route: ActivatedRoute, private teamService: TeamService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.teamId = +params['id']; // (+) converts string 'id' to a number
    });
    this.teamService.setTeamId(this.teamId);
    this.teamInfo = this.teamService.fetchTeamInfo(this.teamId);
    this.recentPerformance = this.teamService.fetchRecentPerformance(this.teamId);
    this.router.navigate(['/team', this.teamId, 'team-squad']);
    $('#span-team-squad').css(
      {"color": "#FFFFFF",
      "background-color": "#343A40"}
    )
  }

  spanTeamClick(spanName: string){
    $('.team-a').css(
      {"color": "rgba(0,0,0,.9)",
      "background-color": "#FFFFFF"}
    )
    $('#span-team-' + spanName).css(
      {"color": "#FFFFFF",
      "background-color": "#343A40"}
    )
  }
}
