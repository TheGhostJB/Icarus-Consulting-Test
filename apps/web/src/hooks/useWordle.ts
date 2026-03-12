import { useCallback, useMemo, useState } from "react";
import { wordleWords } from "../data/wordleWords";

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

export type WordleTileStatus = "empty" | "absent" | "present" | "correct";
export type WordleGameStatus = "playing" | "won" | "lost";

export interface WordleTile {
  letter: string;
  status: WordleTileStatus;
}

export type WordleBoard = WordleTile[][];
export type WordleKeyboardStatus = Record<string, WordleTileStatus>;

function emptyTile(): WordleTile {
  return { letter: "", status: "empty" };
}

function buildEmptyBoard(): WordleBoard {
  return Array.from({ length: MAX_ATTEMPTS }, () =>
    Array.from({ length: WORD_LENGTH }, () => emptyTile()),
  );
}

function pickRandomWord(): string {
  const index = Math.floor(Math.random() * wordleWords.length);
  return wordleWords[index];
}

const statusPriority: Record<WordleTileStatus, number> = {
  empty: 0,
  absent: 1,
  present: 2,
  correct: 3,
};

function evaluateGuess(guess: string, targetWord: string): WordleTile[] {
  const row = guess.split("").map((letter) => ({ letter, status: "absent" as const }));
  const remainingLetters: Record<string, number> = {};

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    const targetLetter = targetWord[index];
    const guessLetter = guess[index];

    if (guessLetter === targetLetter) {
      row[index].status = "correct";
    } else {
      remainingLetters[targetLetter] = (remainingLetters[targetLetter] ?? 0) + 1;
    }
  }

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    if (row[index].status === "correct") {
      continue;
    }

    const guessLetter = guess[index];
    const count = remainingLetters[guessLetter] ?? 0;

    if (count > 0) {
      row[index].status = "present";
      remainingLetters[guessLetter] = count - 1;
    }
  }

  return row;
}

export function useWordle() {
  const [targetWord, setTargetWord] = useState<string>(() => pickRandomWord());
  const [currentGuess, setCurrentGuess] = useState("");
  const [board, setBoard] = useState<WordleBoard>(() => buildEmptyBoard());
  const [attempt, setAttempt] = useState(0);
  const [gameStatus, setGameStatus] = useState<WordleGameStatus>("playing");
  const [message, setMessage] = useState("Adivina la palabra de 5 letras");

  const keyboardStatus = useMemo<WordleKeyboardStatus>(() => {
    const map: WordleKeyboardStatus = {};

    for (const row of board) {
      for (const tile of row) {
        if (!tile.letter || tile.status === "empty") {
          continue;
        }

        const previous = map[tile.letter];
        if (!previous || statusPriority[tile.status] > statusPriority[previous]) {
          map[tile.letter] = tile.status;
        }
      }
    }

    return map;
  }, [board]);

  const handleInput = useCallback(
    (key: string) => {
      if (gameStatus !== "playing") {
        return;
      }

      if (key === "BACKSPACE" || key === "DEL") {
        setCurrentGuess((previous) => previous.slice(0, -1));
        return;
      }

      if (key === "ENTER") {
        if (currentGuess.length !== WORD_LENGTH) {
          setMessage("Necesitas 5 letras para enviar");
          return;
        }

        if (!wordleWords.includes(currentGuess)) {
          setMessage("Palabra no permitida en este prototipo");
          return;
        }

        const evaluatedRow = evaluateGuess(currentGuess, targetWord);

        setBoard((previous) => {
          const next = [...previous];
          next[attempt] = evaluatedRow;
          return next;
        });

        if (currentGuess === targetWord) {
          setGameStatus("won");
          setMessage("Ganaste. Excelente jugada.");
          return;
        }

        if (attempt + 1 >= MAX_ATTEMPTS) {
          setGameStatus("lost");
          setMessage(`Perdiste. La palabra era ${targetWord}.`);
          return;
        }

        setAttempt((previous) => previous + 1);
        setCurrentGuess("");
        setMessage("Sigue intentando");
        return;
      }

      if (!/^[A-Z]$/.test(key)) {
        return;
      }

      setCurrentGuess((previous) => {
        if (previous.length >= WORD_LENGTH) {
          return previous;
        }

        return `${previous}${key}`;
      });
      setMessage("");
    },
    [attempt, currentGuess, gameStatus, targetWord],
  );

  const resetGame = useCallback(() => {
    setTargetWord(pickRandomWord());
    setCurrentGuess("");
    setBoard(buildEmptyBoard());
    setAttempt(0);
    setGameStatus("playing");
    setMessage("Nueva partida iniciada");
  }, []);

  const visibleBoard = useMemo(() => {
    return board.map((row, rowIndex) => {
      if (rowIndex !== attempt || gameStatus !== "playing") {
        return row;
      }

      return row.map((tile, tileIndex) => {
        if (tileIndex < currentGuess.length) {
          return { letter: currentGuess[tileIndex], status: "empty" as const };
        }

        return tile;
      });
    });
  }, [attempt, board, currentGuess, gameStatus]);

  return {
    attempt,
    board: visibleBoard,
    gameStatus,
    handleInput,
    keyboardStatus,
    maxAttempts: MAX_ATTEMPTS,
    message,
    resetGame,
    targetWord,
  };
}
