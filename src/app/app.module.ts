import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopnavComponent } from './topnav/topnav.component';
import { LeaguenavComponent } from './leaguenav/leaguenav.component';
import { HomeComponent } from './home/home.component';
import { CompetitionService } from './competition.service';
import { LeagueComponent } from './league/league.component';
import { LeagueService } from './league/league.service';
import { TeamComponent } from './team/team.component';
import { TeamService } from './team/team.service';
import { LeagueTableComponent } from './league/league-table/league-table.component';
import { LeagueMatchComponent } from './league/league-match/league-match.component';
import { TeamMatchComponent } from './team/team-match/team-match.component';
import { TeamPositionComponent } from './team/team-position/team-position.component';
import { TeamSquadComponent } from './team/team-squad/team-squad.component';
import { MatchComponent } from './match/match.component';
import { MatchService } from './match/match.service';
import { HomeService } from './home/home.service';
import { TokenService } from './token.service';

@NgModule({
  declarations: [
    AppComponent,
    TopnavComponent,
    LeaguenavComponent,
    HomeComponent,
    LeagueComponent,
    TeamComponent,
    LeagueTableComponent,
    LeagueMatchComponent,
    TeamMatchComponent,
    TeamPositionComponent,
    TeamSquadComponent,
    MatchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    TokenService,
    CompetitionService,
    HomeService,
    LeagueService,
    TeamService,
    MatchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
