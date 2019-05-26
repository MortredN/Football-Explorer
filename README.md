# FootballExplorer

This is an Angular 7 school assignment which allows users to browse football leagues, teams, and matches from [football-data.org](https://www.football-data.org/)'s free tier API. This assignment was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.


## About the details of the assignment

Every single component has a top navigation bar with a logo which allows the users to navigate back to the home component, and a side navigation bar which allows the users to navigate to a particular league which is available within the free API.

The home component (`/`) shows all of the matches from the last 2 days to the upcoming 2 days.

The league component (`/league/:league_id`) shows this season's league table (`league-table`) and all of the matches(`league-match`), with the top scorers of a specific league which is identified using a league ID.

The team component (`/team/:team_id`) shows this season's team squad (`team-squad`), team's position in its main league (`team-position`), and all of the matches (`team-match`), with the team's main information and the last 5 matches performance of a specific team which is identified using a team ID.

The match component (`/match/:match_id`) shows the match's information, with the head-to-head stats and head-to-head matches this season between the two teams of that match, which is identified using a match ID.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
Run `ng serve -o` to immediately open the homepage after the compiler finishes.


## Built files to upload

The built artifacts is stored in the `dist/` directory, which is ready to be uploaded to a cloud service / web hosting server.


## Heroku

The website built using this Angular application can be accessed through this Heroku-developed URL: `https://football-explorer.herokuapp.com/`
