/* -------------------------------------------------------------------------- */
/* Initializes variables and event listeners for board and scoring cell       */
/* -------------------------------------------------------------------------- */

/* ------------------------------------- */
/*           Shared Variables            */
/* ------------------------------------- */
var first_move = true;     // if true then user goes first
var board_size             // board size
var difficulty = "hard";   // AI difficulty
var score = [0, 0];        // your score and AI's score
var diff = 0;              // your score minus AI's score
var n_rounds = 0;          // number of rounds per game

/* Create a game log (for easier undos and for score visualization)*/
var game_log = {
  log: [],
  addToLog: function(ind0, plyr, score) {
    game_log.log.push(
      {
        move: ind0,
        player: plyr,
        score: score
      }
    );
  }
};


/* ------------------------------------- */
/*            Event Listeners            */
/* ------------------------------------- */

/* resize listener   */
window.onresize = function() {
  makeScoringCell.resizeCanvas();
  resizeBoard();
}

/* Get user input */
document.querySelector("body").onload = function() {
  // initialze board
  var el = document.querySelector("#board_size");
  board_size = el.options[el.selectedIndex].value;
  switch (board_size) {
    case "small":  makeBoard(4,4); n_rounds=16; break;
    case "medium": makeBoard(5,5); n_rounds=25; break;
    case "large":  makeBoard(6,6); n_rounds=36; break;
    default:       makeBoard(5,5); n_rounds=25;
  }

  // initialize scoring cell
  requestId = makeScoringCell.animateCell();
};

/* Update difficulty */
document.querySelector("#difficulty").oninput = function() {
  var new_difficulty = this.options[this.selectedIndex].value;
  if (new_difficulty == difficulty) {return;}
  difficulty = new_difficulty;
  makeScoringCell.setAIColor();
  resetBoard();
};

/* Update first move */
(function() {
  var radios = document.getElementsByName("first_move");
  for (var i=0; i<radios.length; i++) {
    radios[i].addEventListener("click", function() {
      first_move = !first_move;
      resetBoard();
    });
  }
})();

/* Update board dimensions */
document.querySelector("#board_size").oninput = function() {
  var new_size = this.options[this.selectedIndex].value;
  if (new_size == board_size) {return;}
  board_size = new_size;
  resetBoard();
};

/* Update board size */
function resizeBoard() {

  // get window and header size
  var window_height = window.innerHeight;
  var window_width = window.innerWidth;

  // check orientation
  if (window_height>window_width) {
    // if portrait then 3-row format (subtract header and footer)
    var header_height = document.querySelector("#header").clientHeight;
    var main_width = window_width;
    var main_height = window_height - header_height - 65;
  } else {
    // if landscape then 2-col format (no header and footer)
    var header_width = document.querySelector("#header").clientWidth;
    var main_width = window_width - header_width;
    var main_height = window_height;
  }
  // resize main display
  document.querySelector("#main").style.height = main_height + "px";
  
  // resize board
  var board = document.querySelector("#board");
  var board_size = Math.min(main_width-75, main_height-140)
  board.style.maxWidth =  board_size + "px";
  board.style.maxHeight = board_size + "px";


}



/* Button Listeners */

// reset button
document.querySelector("#reset-button").onclick = resetBoard;

// tutorial button

// play button
document.querySelector("#play-button").onclick = function() {
  document.querySelector("#introduction").style.display = "none";
}


/* Game Over Overlay */
function showGameOverMessage() {
  // update display
  document.querySelector("#overlay").style.display = "flex";

  // update message
  var game_message = "The game is a draw.";
  if (score[0] > score[1]) { game_message = "Congratulation you won!" }
  else if (score[0] < score[1]) { game_message = "Sorry, you lost." }
  document.querySelector("#game-over-message").innerHTML = game_message;

  // create graphics
  var scores = game_log.log.map(function(x) {return x.score;} );
  console.log(scores);
  makeDifferenceGraph(scores, first_move, makeScoringCell.player_colors);
  makeIndividualGraph(scores, first_move, makeScoringCell.player_colors);
}



/* ------------------------------------- */
/*            Helper Functions           */
/* ------------------------------------- */
function resetBoard() {
  // reset scores
  score = [0, 0];   diff = 0;
  document.querySelector("#score0").innerHTML = "You: 0";
  document.querySelector("#score1").innerHTML = "AI: 0";

  // delete board
  var parent = document.querySelector("#board-container");
  var child =  document.querySelector("#board")
  parent.removeChild(child);

  // ser board dimensions
  switch (board_size) {
    case "small":  makeBoard(4,4); n_rounds=16; break;
    case "medium": makeBoard(5,5); n_rounds=25; break;
    case "large":  makeBoard(6,6); n_rounds=36; break;
    default:       makeBoard(5,5); n_rounds=25;
  }
}


/* ------------------------------------- */
/*               Animation               */
/* ------------------------------------- */


/* Gradually update score difference (for scoring cell color) */
function updateDiff(plyr) {
  var new_diff = score[0] - score[1];
  var total_change = (new_diff - diff);
  var dx = total_change/30;
  var player_score = document.querySelector("#score" + plyr);
  var requestIncDiffId = requestAnimationFrame(incrementDiff);

  // increment diff by dx and repeat 60 times a second
  function incrementDiff() {
    diff += dx;
    // check to see if calculation is over
    if (Math.abs(diff - new_diff)> Math.abs(dx)) {
      requestIncDiffId = requestAnimationFrame(incrementDiff);
    } else {
      diff = new_diff; // make sure everything is correct (no round off error)
      cancelAnimationFrame(requestIncDiffId);
    }

    // update score display
    player_score.innerHTML = ( plyr==0 ?
      "You: " + Math.round(score[plyr] + diff-new_diff) :
      "AI: " + Math.round(score[plyr] + new_diff-diff)
    ) ;
  }
}

function toggleMenu() {
  document.getElementById("options-menu").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('#menu-link')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (!event.target.matches('.dropdown *') && openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
