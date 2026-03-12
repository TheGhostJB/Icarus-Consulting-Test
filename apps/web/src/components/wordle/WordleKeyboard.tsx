import type { WordleKeyboardStatus, WordleTileStatus } from "../../hooks/useWordle";

const rows = ["QWERTYUIOP", "ASDFGHJKL", "ENTERZXCVBNMDEL"];

const keyStatusStyles: Record<WordleTileStatus, string> = {
  correct: "wordle-key-correct",
  present: "wordle-key-present",
  absent: "wordle-key-absent",
  empty: "wordle-key-empty",
};

function normalizeKey(key: string): string {
  if (key === "DEL") {
    return "DEL";
  }

  if (key === "ENTER") {
    return "ENTER";
  }

  return key;
}

function splitRow(row: string): string[] {
  if (row.includes("ENTER")) {
    return ["ENTER", ..."ZXCVBNM".split(""), "DEL"];
  }

  return row.split("");
}

interface WordleKeyboardProps {
  keyboardStatus: WordleKeyboardStatus;
  onKeyPress: (key: string) => void;
}

function WordleKeyboard({ keyboardStatus, onKeyPress }: WordleKeyboardProps) {
  return (
    <div className="wordle-keyboard">
      {rows.map((row) => (
        <div key={row} className="wordle-keyboard-row">
          {splitRow(row).map((key) => {
            const status = keyboardStatus[normalizeKey(key)] ?? "empty";
            const isWide = key === "ENTER" || key === "DEL";

            return (
              <button
                key={key}
                type="button"
                onClick={() => onKeyPress(key)}
                className={`wordle-key ${keyStatusStyles[status]} ${
                  isWide ? "wordle-key-wide" : ""
                }`}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default WordleKeyboard;
