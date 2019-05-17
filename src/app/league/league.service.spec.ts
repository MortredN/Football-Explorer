import { TestBed } from '@angular/core/testing';

import { LeagueService } from './league.service';

describe('LeagueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeagueService = TestBed.get(LeagueService);
    expect(service).toBeTruthy();
  });
});
