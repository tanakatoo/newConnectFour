/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Player{
  constructor() {
    this.colorName;
    this.playerNumber;
  }
  setColorName(playerNumber) {
    const playerColor = document.querySelector("#player" + playerNumber).value
    this.colorName = playerColor
    this.playerNumber = playerNumber
  }
}


class Game{
  constructor(width, height) {
    this.WIDTH = width;
    this.HEIGHT = height;
    this.board = [];
    this.p1 = new Player()
    this.p2 = new Player()

    //have to do bind the clicking function to THIS instance because the clicking happens outside of the class
    //so the THIS when it is clicked is actually the html element instead
    this.startGameClick=this.startGame.bind(this)
    document.querySelector("#startGame").addEventListener("click",this.startGameClick)
    //document.querySelector("#startGame").addEventListener("click",this.startGame)
    
  }

  startGame(e) {
    e.preventDefault()
    this.p1.setColorName(1)
    this.p2.setColorName(2)
    this.currPlayer = this.p1
    
    if (this.board) {

      //that means it is the end of the game so we need to reset it
      this.board = [];
      const board = document.getElementById('board');
      while (board.firstChild) {
        board.firstChild.remove()
      }
    }
    this.makeBoard();
    this.makeHtmlBoard();
  }

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    this.handleClickBind = this.handleClick.bind(this)
    top.addEventListener('click', this.handleClickBind);
    //top.addEventListener('click', this.handleClick);
  
    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor=this.currPlayer.colorName
    //piece.classList.add(`p${this.currPlayer.playerNumber}`);
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  
  endGame(msg) {
    alert(msg);
    //remove the click function
    const topColumn = document.getElementById("column-top")

    topColumn.removeEventListener("click",this.handleClickBind)
  }
  
  /** handleClick: handle click of column top to play piece */
  
   handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.playerNumber;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.playerNumber} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;
  }
  
  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  
  checkForWin() {
   
    const _win=cells=> cells.every(
        ([y, x]) => {
         return y >= 0 &&
            y < this.HEIGHT &&
            x >= 0 &&
            x < this.WIDTH&&
            this.board[y][x] === this.currPlayer.playerNumber
        }
      );
    
  
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

new Player()
new Player()
new Game(6,7)