# A Biology-Inspired Board Game with an AI Opponent

Play the game at https://mattmotoki.github.io/

## How to Play
Player take turns placing their cells. A player’s cells divide when they connect with each other; vertical, horizontal and diagonal connections are allowed. Your score is equal to the total number of cells that you have on the board. The game ends when the board is full. The winner is the player with the most cells.

## Implementation

The game is written primarily in plain JavaScript, HTML5, and CSS3.  

The only external library used is [howler.js](https://howlerjs.com/),
which is used to add retro soundeffects.

The scoring cell annimation and statistics graphics were done using HTML canvases.  

The cell design was done using base R graphics. 

The AI opponent is greedy with respect to some scoring metric. 

TODO:
Create a Deep Reinforcement Learning Agent
