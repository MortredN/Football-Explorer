import { Component, OnInit } from '@angular/core';
import { HomeService, HomePageDate } from './home.service';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  strEreyesterday: string;
  strYesterday: string;
  strToday: string;
  strTomorrow: string;
  strOvermorrow: string;
  homePageDates: HomePageDate[];
  

  constructor(private homeService: HomeService, private router: Router) { }

  ngOnInit() {
    this.strEreyesterday = this.getStrDate(-2);
    this.strYesterday = this.getStrDate(-1);
    this.strToday = this.getStrDate(0);
    this.strTomorrow = this.getStrDate(1);
    this.strOvermorrow = this.getStrDate(2);

    this.homePageDates = this.homeService.fetchMatches();
  }

  getStrDate(days: number){
    let date = new Date();
    date.setDate(date.getDate() + days);
    return date.getDate() + "/" + (date.getMonth() + 1)
  }

  spanNavigate(spanName: string){
    $('.matches-div').hide();
    $('#div-' + spanName).show();
  }

  navigateToMatch(matchId: number){
    this.router.navigate(['/match', matchId]);
  }

}
