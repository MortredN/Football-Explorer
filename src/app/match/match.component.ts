import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatchService, MatchInfo } from './match.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {

  matchId: number;
  matchInfo: MatchInfo[];

  constructor(private route: ActivatedRoute, private matchService: MatchService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.matchId = +params['id']; // (+) converts string 'id' to a number
    });
    this.matchService.fetchMatchInfo(this.matchId);
    this.matchInfo = this.matchService.fetchMatchInfo(this.matchId);
  }

}
