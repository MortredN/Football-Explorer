import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LeagueComponent } from './league/league.component';
import { LeagueTableComponent } from './league/league-table/league-table.component';
import { LeagueMatchComponent } from './league/league-match/league-match.component';
import { TeamComponent } from './team/team.component';
import { TeamMatchComponent } from './team/team-match/team-match.component';
import { TeamPositionComponent } from './team/team-position/team-position.component';
import { TeamSquadComponent } from './team/team-squad/team-squad.component';
import { MatchComponent } from './match/match.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'league/:id',
    component: LeagueComponent,
    children: [
      {path: 'league-table', component: LeagueTableComponent},
      {path: 'league-match', component: LeagueMatchComponent}
    ] },
  { 
    path: 'team/:id',
    component: TeamComponent,
    children: [
      {path: 'team-match', component: TeamMatchComponent},
      {path: 'team-position', component: TeamPositionComponent},
      {path: 'team-squad', component: TeamSquadComponent}
    ] },
  { path: 'match/:id', component: MatchComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
