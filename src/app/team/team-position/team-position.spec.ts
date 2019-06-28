import { TeamPosition } from './team-position';

describe('TeamPosition', () => {
  it('should create an instance', () => {
    expect(new TeamPosition(
      0 /*Team's position in the table*/,
      0 /*Team's ID*/,
      "The same team",
      "Team's crest URL",
      "Team's name",
      0 /*Number of matches played*/,
      0 /*Number of matches won*/,
      0 /*Number of matches tied*/,
      0 /*Number of matches lost*/,
      0 /*Goals scored*/,
      0 /*Goals got scored*/,
      0 /*GoalsFor - GoalsAgainst*/,
      0 /*Points*/
    )).toBeTruthy();
  });
});
