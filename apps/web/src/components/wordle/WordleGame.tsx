import { useCallback, useEffect, useRef, useState } from "react";
import { Auth } from "../../context/AuthContext";
import { useWordle } from "../../hooks/useWordle";
import {
  getWordleConfig,
  getWordleLeaderboard,
  saveWordleSession,
} from "../../services/wordleService";
import type {
  WordleConfig,
  WordleLeaderboardResponse,
} from "../../types/wordle";
import WordleGrid from "./WordleGrid";
import WordleKeyboard from "./WordleKeyboard";
import WordleStats from "./WordleStats";

const MESSAGE_CLASS = "m-0 min-h-6 text-center font-semibold text-[#4f6173]";

function WordleGame() {
  const { session } = Auth();
  const [config, setConfig] = useState<WordleConfig | null>(null);
  const [leaderboard, setLeaderboard] = useState<WordleLeaderboardResponse | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const sessionStartedAtRef = useRef<number>(Date.now());

  const loadWordleData = useCallback(async () => {
    setLoadingData(true);
    setLoadingMessage(null);

    try {
      const wordleConfig = await getWordleConfig();
      const wordleLeaderboard = await getWordleLeaderboard(wordleConfig.puzzleDate);

      setConfig(wordleConfig);
      setLeaderboard(wordleLeaderboard);
    } catch (error) {
      console.error("Error loading Wordle data:", error);
      setLoadingMessage(error instanceof Error ? error.message : "No se pudo cargar Wordle.");
    } finally {
      setLoadingData(false);
    }
  }, []);

  const handleGameFinished = useCallback(async ({
    attemptCount,
    puzzleDate,
  }: {
    attemptCount: number;
    gameStatus: "won" | "lost";
    puzzleDate: string;
    targetWord: string;
  }) => {
    if (!config) {
      return;
    }

    if (!session?.user?.id) {
      setIsSaving(false);
      setSaveError("Juega como invitado o inicia sesion para guardar tu resultado en el leaderboard.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const playtimeSeconds = Math.max(
        1,
        Math.round((Date.now() - sessionStartedAtRef.current) / 1000),
      );
      const response = await saveWordleSession({
        attempt_count: attemptCount,
        playtime_seconds: playtimeSeconds,
        puzzle_date: puzzleDate,
      }, session.user.id);

      setLeaderboard(response.leaderboard);
    } catch (error) {
      console.error("Error saving Wordle session:", error);
      setSaveError(error instanceof Error ? error.message : "No se pudo guardar la sesion.");
    } finally {
      setIsSaving(false);
    }
  }, [config, session]);

  const {
    attempt,
    board,
    gameStatus,
    handleInput,
    keyboardStatus,
    maxAttempts,
    message,
    puzzleDate,
    targetWord,
  } = useWordle({
    onGameFinished: handleGameFinished,
    puzzleDate: config?.puzzleDate,
  });

  useEffect(() => {
    loadWordleData();
  }, [loadWordleData]);

  useEffect(() => {
    const intervalId = window.setInterval(async () => {
      try {
        const latestConfig = await getWordleConfig();

        setConfig((currentConfig) => {
          if (currentConfig?.puzzleDate === latestConfig.puzzleDate) {
            return currentConfig;
          }

          sessionStartedAtRef.current = Date.now();
          setLeaderboard(null);
          setSaveError(null);
          setLoadingMessage(null);
          getWordleLeaderboard(latestConfig.puzzleDate)
            .then((nextLeaderboard) => {
              setLeaderboard(nextLeaderboard);
            })
            .catch((error) => {
              console.error("Error refreshing daily Wordle leaderboard:", error);
              setLoadingMessage(
                error instanceof Error ? error.message : "No se pudo actualizar el puzzle diario.",
              );
            });

          return latestConfig;
        });
      } catch (error) {
        console.error("Error checking daily Wordle config:", error);
      }
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

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
    <section className="rounded-2xl border border-[#d8dee5] bg-white p-6">
      <header className="mb-5">
        <p className="mb-2 text-[12px] font-extrabold tracking-[0.18em] text-[#d62839]">WORDLE</p>
        <h2 className="mb-2 text-[32px] font-bold text-[#0b2a55] max-[900px]:text-[26px]">
          Off-Season Word Challenge
        </h2>
        <p className="m-0 leading-[1.6] text-[#516173]">
          Un minijuego de 5 letras dentro del mismo apartado de Offseason.
        </p>
        <p className={MESSAGE_CLASS}>
          {session?.user?.id
            ? "Tu primer intento del dia se guarda en el leaderboard con tu nickname."
            : "Modo invitado: puedes jugar, pero tu resultado no se guarda hasta iniciar sesion."}
        </p>
        {loadingMessage ? <p className={MESSAGE_CLASS}>{loadingMessage}</p> : null}
        {saveError ? <p className={MESSAGE_CLASS}>{saveError}</p> : null}
        {isSaving ? <p className={MESSAGE_CLASS}>Guardando resultado...</p> : null}
      </header>

      <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)] items-start gap-5 max-[900px]:grid-cols-1">
        <div className="grid gap-4 rounded-[14px] border border-[#d8dee5] bg-[#f8fafc] p-5">
          <WordleGrid board={board} />
          <p className={MESSAGE_CLASS}>{message}</p>
          <p className={MESSAGE_CLASS}>
            Puzzle diario: {puzzleDate} · Intento {Math.min(attempt + 1, maxAttempts)} de {maxAttempts}
          </p>

          <div className="rounded-xl border border-[#d8dee5] bg-[#f5f8fb] p-4 shadow-none">
            <WordleKeyboard keyboardStatus={keyboardStatus} onKeyPress={handleInput} />
          </div>

          {gameStatus !== "playing" ? (
            <p className="m-0 text-center font-bold text-[#0b2a55]">Palabra: {targetWord}</p>
          ) : null}
        </div>

        <aside className="grid gap-4">
          <WordleStats
            entries={leaderboard?.entries ?? []}
            errorMessage={loadingMessage}
            isLoading={loadingData}
            puzzleDate={leaderboard?.puzzleDate ?? config?.puzzleDate ?? null}
          />
        </aside>
      </div>
    </section>
  );
}

export default WordleGame;
