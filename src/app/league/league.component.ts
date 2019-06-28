import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeagueService, LeagueInfo, LeagueScorer } from './league.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.css']
})
export class LeagueComponent implements OnInit {

  leagueId: number;
  leagueInfo: LeagueInfo[];
  topScorers: LeagueScorer[];

  constructor(private route: ActivatedRoute, private leagueService: LeagueService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.leagueId = +params['id']; // (+) converts string 'id' to a number
    });
    this.leagueService.setLeagueId(this.leagueId);
    this.leagueInfo = this.leagueService.fetchLeagueInfo(this.leagueId);
    this.topScorers = this.leagueService.fetchTopScorers(this.leagueId);
    this.router.navigate(['/league', this.leagueId, 'league-table']);
    $('#span-league-table').css(
      {"color": "#FFFFFF",
      "background-color": "#343A40"}
    )
  }

  spanLeagueClick(spanName: string){
    $('.league-a').css(
      {"color": "rgba(0,0,0,.9)",
      "background-color": "#FFFFFF"}
    )
    $('#span-league-' + spanName).css(
      {"color": "#FFFFFF",
      "background-color": "#343A40"}
    )
  }
}
