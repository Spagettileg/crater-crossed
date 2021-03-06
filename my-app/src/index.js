import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


function Square(props) {
  return (
    <button className="square" game-id={props.value}onClick={props.onClick}>
    {props.value}
    </button>
    );
}

class Board extends React.Component {
  // Constructor helps control the Squares by a passing a prop to each Square
  // User options = X, O or null (blank)
  
  renderSquare(i) {
    return (<Square value={this.props.squares[i]}
    onClick={() => this.props.onClick(i)}
    />
    );
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
      }],
      stepNumber: 0,
      xIsNext: true,
      isDescending: true
    };
  }
  
  handleClick(i) {
    const locations = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3]
      ];
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
      squares: squares,
      location: locations[i]
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  
  sortHistory() {
    this.setState({
      isDescending: !this.state.isDescending
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const today = new Date();
    
    const moves = history.map((step, move) => {
      const desc = move ?
      'Go to move #' + move + " >> " + history[move].location :
      'Go to game start';
    return (
      <li key={move}>
      <button onClick={() => this.jumpTo(move)}>
      {move === this.state.stepNumber ? <i>{desc}}</i> : desc}
      </button>
      </li>
      );
    });
    
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (!current.squares.includes(null)) {
      status = "draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');
    }
    
    return (
      <div className="logo">Crater-Cr<span className="yellow-crater">o</span>ssed
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="reset">
          <a href="index.html" className="reset-button">Reset</a>
        </div>
        <div className="game-info">
          <div className="game-status">{status}</div>
          <ol>{this.state.isDescending ? moves : moves.reverse()}</ol>
          <button onClick={() => this.sortHistory()}>
            Sort by: {this.state.isDescending ? "Descending" : "Ascending"}
          </button>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row spacer"></div>
      </div>
      <footer id="footer" className="container-fluid">
      <div className="row footer-text">
        <div className="logo-footer">Crater-Cr<span className="yellow-crater">o</span>ssed</div>
        <span className="win-outcome"><small>(Win = 3 in a row)</small></span>
        <p>© Crater-Cross | {today.getFullYear()} | Website design - Paul Friel</p>
        </div>
        </footer>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
  for (let i=0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// To start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
