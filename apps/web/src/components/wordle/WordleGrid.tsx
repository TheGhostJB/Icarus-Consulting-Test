import type { WordleBoard, WordleTileStatus } from "../../hooks/useWordle";

const statusStyles: Record<WordleTileStatus, string> = {
  correct: "wordle-tile-correct",
  present: "wordle-tile-present",
  absent: "wordle-tile-absent",
  empty: "wordle-tile-empty",
};

interface WordleGridProps {
  board: WordleBoard;
}

function WordleGrid({ board }: WordleGridProps) {
  return (
    <div className="wordle-grid">
      {board.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="wordle-grid-row">
          {row.map((tile, tileIndex) => (
            <div
              key={`tile-${rowIndex}-${tileIndex}`}
              className={`wordle-tile ${statusStyles[tile.status]}`}
            >
              {tile.letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default WordleGrid;
