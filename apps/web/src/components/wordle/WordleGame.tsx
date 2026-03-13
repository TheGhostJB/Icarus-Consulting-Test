import { useEffect } from "react";
import { useWordle } from "../../hooks/useWordle";
import WordleGrid from "./WordleGrid";
import WordleKeyboard from "./WordleKeyboard";
import WordleStats from "./WordleStats";

function WordleGame() {
  const {
    attempt,
    board,
    gameStatus,
    handleInput,
    keyboardStatus,
    maxAttempts,
    message,
    resetGame,
    targetWord,
  } = useWordle();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Backspace") {
        handleInput("BACKSPACE");
        return;
      }

      if (event.key === "Enter") {
        handleInput("ENTER");
        return;
      }

      if (/^[a-zA-Z]$/.test(event.key)) {
        handleInput(event.key.toUpperCase());
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleInput]);

  return (
    <section className="wordle-card">
      <header className="wordle-card-header">
        <p className="wordle-card-kicker">WORDLE</p>
        <h2 className="wordle-card-title">Off-Season Word Challenge</h2>
        <p className="wordle-card-copy">
          Un minijuego de 5 letras dentro del mismo apartado de Offseason.
        </p>
      </header>

      <div className="wordle-layout">
        <div className="wordle-main">
          <WordleGrid board={board} />
          <p className="wordle-message">{message}</p>

          <div className="wordle-keyboard-shell">
            <WordleKeyboard keyboardStatus={keyboardStatus} onKeyPress={handleInput} />
          </div>

          <div className="wordle-actions">
            <button type="button" onClick={resetGame} className="wordle-reset-button">
              Reiniciar
            </button>
          </div>

          {gameStatus !== "playing" ? (
            <p className="wordle-answer">Palabra: {targetWord}</p>
          ) : null}
        </div>

        <aside className="wordle-sidebar">
          <WordleStats />
        </aside>
      </div>
    </section>
  );
}

export default WordleGame;
