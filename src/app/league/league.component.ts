import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeagueService, LeagueInfo } from './league.service';
import { LeagueScorer } from './league-scorer';

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
  }
}
