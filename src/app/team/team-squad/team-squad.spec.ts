import { TeamSquad } from './team-squad';

describe('TeamSquad', () => {
  it('should create an instance', () => {
    expect(new TeamSquad(
      "Staff's name",
      "Player's shirt number",
      "Staff's position"
    )).toBeTruthy();
  });
});
