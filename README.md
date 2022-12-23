# chess stats tracker

Web Page, gives your chess stats from Chess.com.

elo : win / draw / loss

It can be uses to display your statistics on Twitch stream.

Updates each 30 seconds.

## Usage

### Using the form

format :

- global ( shows your overall elo with overall win/draw/loss)
- session ( shows your elo (+variation) and win/draw/loss )

type :

- bullet
- blitz
- rapid

### With URL parameters:

?format=global&type=blitz&name=LyonBeast

### Results

The link is :

    https://deuzwood.github.io/chess-stats-tracker/?name=LyonBeast&type=blitz&format=global

The result :

    3177 : 915 / 257 / 334

Using the session format :

    3181 (+4) : 1 / 0 / 0

Which mean you won 4 elo points in 1 game (1 win, 0 draw, 0 loss).
