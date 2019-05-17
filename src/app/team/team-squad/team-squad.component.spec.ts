import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamSquadComponent } from './team-squad.component';

describe('TeamSquadComponent', () => {
  let component: TeamSquadComponent;
  let fixture: ComponentFixture<TeamSquadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamSquadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamSquadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
