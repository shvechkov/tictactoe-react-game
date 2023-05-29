import { useState } from 'react';
import { useEffect } from 'react';

import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';


import Stack from '@mui/material/Stack';


const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);


function Square({ value, onSquareClick , pos,line}) {

  let style="white";
  if (line.filter(s => s == pos).length != 0 )
    style="#eaeaea"

  return (
    <button className="square" onClick={onSquareClick} style={{background:style}}>
      {value}
    </button>
  );
}




// human
const huPlayer = "O";
// ai
const aiPlayer = "X";

// returns list of the indexes of empty spots on the board
function emptyIndexies(board) {
  return board.filter(s => s != "O" && s != "X");
}

function calculateWinner(squares, player) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a]
      && squares[a] === squares[b] && squares[a] === squares[c]
      && player === squares[a]) {
      return squares[a];
    }
  }
  return null;
}

function getWinnerLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a]
      && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}



function minimax(newBoard, player) {

  //available spots
  var availSpots = emptyIndexies(newBoard);


  // checks for the terminal states such as win, lose, and tie 
  //and returning a value accordingly
  if (calculateWinner(newBoard, huPlayer)) {
    return { score: -10 };
  }
  else if (calculateWinner(newBoard, aiPlayer)) {
    return { score: 10 };
  }
  else if (availSpots.length === 0) {
    return { score: 0 };
  }


  // an array to collect all the objects
  var moves = [];

  // loop through available spots
  for (var i = 0; i < availSpots.length; i++) {
    //create an object for each and store the index of that spot 
    var move = {};
    move.index = newBoard[availSpots[i]];

    // set the empty spot to the current player
    newBoard[availSpots[i]] = player;

    /*collect the score resulted from calling minimax 
      on the opponent of the current player*/
    if (player == aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    }
    else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    // reset the spot to empty
    newBoard[availSpots[i]] = move.index;

    // push the object to the array
    moves.push(move);
  }



  // if it is the computer's turn loop over the moves and choose the move with the highest score
  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {

    // else loop over the moves and choose the move with the lowest score
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  // return the chosen move (object) from the moves array
  return moves[bestMove];
}






export default class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      xIsNext: true,
      squares: Array(9).fill(null),
      isAi: true,
      line: Array(3).fill(null),
    };
  }

  handleAiMove = (t,squares, disableClicks)=>{


    setTimeout(() => {      
      this.setState({
        xIsNext: this.state.xIsNext,
        squares: squares,
        isAi: this.state.isAi,
        pause: false
      });
      this.disableClicks =disableClicks;
  
      }, t);
    }

  disableClicks = false;

  handleClick(i) {


    if (this.disableClicks){
      console.log("Ignoring click")
      return;
    }
    console.log("Processing click")

  

    if (calculateWinner(this.state.squares, huPlayer) ||
      calculateWinner(this.state.squares, aiPlayer) || this.state.squares[i]) {
      return;
    }
    const nextSquares = this.state.squares.slice();
  
  
    if (this.state.isAi) {
      nextSquares[i] = huPlayer;
      this.handleAiMove(0, nextSquares, true);

  


      // now AI makes move 
      // call minmax for ai and get index for next move 
      var newBoard = nextSquares.slice();
      for (let i = 0; i < newBoard.length; i++)
        if (null == newBoard[i])
          newBoard[i] = i;
  
  
  
      var bestMove = minimax(newBoard, aiPlayer);
      const nextSquares2 = nextSquares.slice();
      nextSquares2[bestMove.index] = aiPlayer;


      this.handleAiMove(500, nextSquares2,false);

      return;
  
  
    }
    else {
  
      if (this.state.xIsNext)
        nextSquares[i] = "X";
      else
        nextSquares[i] = "O";
  
  
        this.setState({
        xIsNext: !this.state.xIsNext,
        squares: nextSquares,
        isAi: this.state.isAi
      });
  
  
    }
  
  
    this.setState({
      xIsNext: !this.state.xIsNext,
      squares: nextSquares,
      board: this.state.isAi
    });
  }
  

  handleSetAi = ()=>{
    
    this.setState(
      {
        xIsNext: true,
        squares: Array(9).fill(null),
        isAi: true,
        line: Array(3).fill(null),
      }
    );
  
    console.log(this.state.isAi)
  }
  
  handleSetHuman = ()=>{
    this.setState({
      xIsNext: true,
      squares: Array(9).fill(null),
      isAi: false,
      line: Array(3).fill(null),
    });
    console.log(this.state.isAi)
  }
  

  handleRestart = ()=>{

    this.setState({
      xIsNext: this.state.xIsNext,
      squares: Array(9).fill(null),
      isAi: this.state.isAi,
      line: Array(3).fill(null),
    });

    
  }
  
  

  render() {

    
    let status = "???";
    let ret ="";

    let winner = calculateWinner(this.state.squares, huPlayer) || calculateWinner(this.state.squares, aiPlayer); 


    if (null != winner ) { 
      let line = getWinnerLine(this.state.squares);
      this.state.line = line;
  
      if (this.state.isAi && winner == aiPlayer)
        status = "Computer wins!"
      else      
        status =  winner +" wins!";
    }
    else if (emptyIndexies(this.state.squares).length == 0) {
      status = "Draw";
    }
    else if (null == winner) {
      if (!this.state.isAi) {
        status = "Game in progress (Human vs Human)";
      } else {
        status = "Game in progress (Human vs computer)";
      }

    }





    return (
      <div className="myBoard">
        <div className="status">{status}</div>
        <div className="board-row">
          <Square pos={0} value={this.state.squares[0]} onSquareClick={() => this.handleClick(0)} line={this.state.line}/>
          <Square pos={1} value={this.state.squares[1]} onSquareClick={() => this.handleClick(1)} line={this.state.line}/>
          <Square pos={2} value={this.state.squares[2]} onSquareClick={() => this.handleClick(2)} line={this.state.line}/>
        </div>
        <div className="board-row">
          <Square pos={3} value={this.state.squares[3]} onSquareClick={() => this.handleClick(3)} line={this.state.line}/>
          <Square pos={4} value={this.state.squares[4]} onSquareClick={() => this.handleClick(4)} line={this.state.line}/>
          <Square pos={5} value={this.state.squares[5]} onSquareClick={() => this.handleClick(5)} line={this.state.line}/>
        </div>
        <div className="board-row">
          <Square pos={6} value={this.state.squares[6]} onSquareClick={() => this.handleClick(6)} line={this.state.line}/>
          <Square pos={7} value={this.state.squares[7]} onSquareClick={() => this.handleClick(7)} line={this.state.line}/>
          <Square pos={8} value={this.state.squares[8]} onSquareClick={() => this.handleClick(8)} line={this.state.line}/>
        </div>

        <p>
          <div>
            Players:   <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <Button onClick={this.handleSetAi}>AI</Button>
              <Button onClick={this.handleSetHuman}>HUMAN</Button>
              <Button onClick={this.handleRestart}>restart</Button>

            </ButtonGroup>

          </div>
        </p>




      </div>
    );



  }


}
