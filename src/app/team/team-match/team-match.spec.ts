import { TeamMatch } from './team-match';

describe('TeamMatch', () => {
  it('should create an instance', () => {
    expect(new TeamMatch(
      0 /*Sample match ID*/,
      "Opponent's team crest URL",
      "Opponent's team name",
      "Competition's name",
      0 /*Home score*/,
      0 /*Away score*/,
      "'Home' or 'Away'",
      "Result - Win, Draw, Lose",
      "dd/mm/yyyy",
      "HH:MM")).toBeTruthy();
  });
});
