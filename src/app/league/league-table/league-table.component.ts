import { Component, OnInit } from '@angular/core';
import { LeagueService, LeagueGroupTables } from '../league.service';
import { LeagueTable } from './league-table';

@Component({
  selector: 'app-league-table',
  templateUrl: './league-table.component.html',
  styleUrls: ['./league-table.component.css']
})
export class LeagueTableComponent implements OnInit {

  leagueId: number;
  table: LeagueTable[];
  groupTables: LeagueGroupTables[];
  leagueIdsWithGroupTables = [2000, 2001, 2018];

  constructor(private leagueService: LeagueService) { }

  ngOnInit() {
    this.leagueId = this.leagueService.getLeagueId();
    if(this.leagueIdsWithGroupTables.includes(this.leagueId)){
      this.groupTables = this.leagueService.fetchGroupTables(this.leagueId);
    } else {
      this.table = this.leagueService.fetchLeagueTable(this.leagueId);
    }
  }

}
