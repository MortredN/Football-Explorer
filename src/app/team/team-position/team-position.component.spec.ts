import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPositionComponent } from './team-position.component';

describe('TeamPositionComponent', () => {
  let component: TeamPositionComponent;
  let fixture: ComponentFixture<TeamPositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamPositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
