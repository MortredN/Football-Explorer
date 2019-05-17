import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaguenavComponent } from './leaguenav.component';

describe('LeaguenavComponent', () => {
  let component: LeaguenavComponent;
  let fixture: ComponentFixture<LeaguenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaguenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaguenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
