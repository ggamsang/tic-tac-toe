import { useState } from 'react'
import "./App.css"

type SquareContentType = 'X' | 'O' | null
interface SquareProps {
  value: string | null
  onSquareClick: () => void
}
function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  )
}
interface BoardProps {
  xIsNext: boolean
  squares: SquareContentType[]
  onPlay: (squares: SquareContentType[]) => void
}
function Board({ xIsNext, squares, onPlay }: BoardProps) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    const nextSquares: SquareContentType[] = squares.slice()
    if (xIsNext) {
      nextSquares[i] = 'X'
    } else {
      nextSquares[i] = 'O'
    }
    onPlay(nextSquares);
  }

  const winner: SquareContentType = calculateWinner(squares)
  let status: string = ""
  if (winner) {
    status = 'Winner: ' + winner
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O')
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {Array(9).fill(null).map((_, index: number) =>
          <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />)}
      </div>
    </>
  )
}


const Game = () => {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const xIsNext: boolean = currentMove % 2 === 0
  const currentSquares: SquareContentType[] = history[currentMove]

  const handlePlay = (nextSquares: SquareContentType[]) => {
    const nextHistory: SquareContentType[][] = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  const jumpTo = (nextMove: number) => {
    setCurrentMove(nextMove)
  }

  const moves = history.map((_squares: SquareContentType[], move: number) => {
    let description: string = ""
    if (move > 0)
      description = 'Go to move #' + move
    else
      description = 'Go to game start'
    return <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-history">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

const calculateWinner = (squares: SquareContentType[]): SquareContentType => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (const line of lines) {
    const [a, b, c] = line
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null;
}

export default Game