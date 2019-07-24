import React from 'react';
import './App.css';


function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      { props.value }
    </button>
  )
}


class Board extends React.Component{
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        xCoordinate: null,
        yCoordinate: null,
      }],
      xIsNext: true,
      stepNumber: 0,
      sortReverse: false
    }
  }

  toggleSortMode() {
    this.setState({
      sortReverse: !this.state.sortReverse,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{
        squares: squares,
        xCoordinate: getCoordinates(i)[0],
        yCoordinate: getCoordinates(i)[1],
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  isActiveHistoryButton(i) {
    if ( i === this.state.stepNumber ) {
      return "active-btn"
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const contentLI = move
        ? <div>
          <button onClick={() => this.jumpTo(move)} className={this.isActiveHistoryButton(move)}>Go to move # {move}</button>
          <span>x: {step.xCoordinate} y: {step.yCoordinate}</span>
        </div>
        :
        <div>
          <button onClick={() => this.jumpTo(move)}>Go to game start</button>
        </div>
      ;
      return (
        <li key={move}>
          {contentLI}
        </li>
      )
    });

    if (this.state.sortReverse) {
      moves.reverse()
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <span>{status}</span>
          <button onClick={() => this.toggleSortMode()}>Change sort mode</button>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getCoordinates(i) {
  return [i % 3, Math.floor(i / 3)]
}

export default Game;
