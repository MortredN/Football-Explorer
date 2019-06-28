import { LeagueMatch } from './league-match';

describe('LeagueMatch', () => {
  it('should create an instance', () => {
    expect(new LeagueMatch(
      0 /*Match's ID*/,
      "dd/mm/yyyy",
      "HH:MM",
      "finished, live, or scheduled",
      0 /*Home score*/,
      0 /*Away score*/,
      0 /*Home team's ID*/,
      0 /*Away team's ID*/,
      "Home team's name",
      "Away team's name",
      "Home team's crest URL",
      "Away team's crest URL"
    )).toBeTruthy();
  });
});
