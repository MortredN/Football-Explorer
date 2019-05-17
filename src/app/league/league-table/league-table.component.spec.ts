import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueTableComponent } from './league-table.component';

describe('LeagueTableComponent', () => {
  let component: LeagueTableComponent;
  let fixture: ComponentFixture<LeagueTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeagueTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
