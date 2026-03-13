import { useEffect, useRef, useState } from "react";

const NINTENDO_VENDOR_ID = 0x057e;
const UNITY_BRIDGE_OBJECT = "JoyConWebBridge";
const JOYCON_OUTPUT_REPORT_ID = 0x01;
const JOYCON_STANDARD_FULL_MODE = 0x30;
const JOYCON_STANDARD_FULL_MODE_ALT = 0x31;
const JOYCON_SUBCOMMAND_SET_INPUT_REPORT_MODE = 0x03;
const JOYCON_SUBCOMMAND_ENABLE_IMU = 0x40;
const JOYCON_RUMBLE_NEUTRAL = [0x00, 0x01, 0x40, 0x40, 0x00, 0x01, 0x40, 0x40];
const JOYCON_MOTION_SAMPLE_SIZE = 12;
const JOYCON_MOTION_BLOCK_OFFSET = 12;

export interface UnityGameEmbedProps {
  loaderUrl?: string;
  dataUrl?: string;
  frameworkUrl?: string;
  codeUrl?: string;
}

interface MotionPayload {
  gx: number;
  gy: number;
  gz: number;
  ax: number;
  ay: number;
  az: number;
  sx: number;
  sy: number;
}

type InputReportHandler = (event: HIDInputReportEvent) => void;

function readInt16LE(bytes: Uint8Array, index: number): number {
  if (index + 1 >= bytes.length) {
    return 0;
  }

  const value = bytes[index] | (bytes[index + 1] << 8);
  return value >= 0x8000 ? value - 0x10000 : value;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createSubcommandPacket(
  packetNumber: number,
  subcommand: number,
  data: number[] = [],
): Uint8Array {
  return new Uint8Array([
    packetNumber & 0x0f,
    ...JOYCON_RUMBLE_NEUTRAL,
    subcommand,
    ...data,
  ]);
}

function extractMotionPayload(bytes: Uint8Array): MotionPayload | null {
  if (bytes.length < JOYCON_MOTION_BLOCK_OFFSET + JOYCON_MOTION_SAMPLE_SIZE) {
    return null;
  }

  const accelStart = JOYCON_MOTION_BLOCK_OFFSET;
  const gyroStart = accelStart + 6;

  const axRaw = readInt16LE(bytes, accelStart);
  const ayRaw = readInt16LE(bytes, accelStart + 2);
  const azRaw = readInt16LE(bytes, accelStart + 4);

  const gxRaw = readInt16LE(bytes, gyroStart);
  const gyRaw = readInt16LE(bytes, gyroStart + 2);
  const gzRaw = readInt16LE(bytes, gyroStart + 4);

  return {
    gx: gxRaw / 1024,
    gy: gyRaw / 1024,
    gz: gzRaw / 1024,
    ax: axRaw / 4096,
    ay: ayRaw / 4096,
    az: azRaw / 4096,
    sx: 0,
    sy: 0,
  };
}

function extractZRPressed(bytes: Uint8Array): boolean {
  if (bytes.length < 4) {
    return false;
  }

  return (bytes[2] & 0b10000000) !== 0 || (bytes[3] & 0b10000000) !== 0;
}

function isMotionReport(event: HIDInputReportEvent): boolean {
  return (
    event.reportId === JOYCON_STANDARD_FULL_MODE ||
    event.reportId === JOYCON_STANDARD_FULL_MODE_ALT
  );
}

function UnityGameEmbed({
  loaderUrl = "/Build/BuildPrototipo.loader.js",
  dataUrl = "/Build/BuildPrototipo.data.br",
  frameworkUrl = "/Build/BuildPrototipo.framework.js.br",
  codeUrl = "/Build/BuildPrototipo.wasm.br",
}: UnityGameEmbedProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const unityInstanceRef = useRef<UnityInstance | null>(null);
  const deviceRef = useRef<HIDDevice | null>(null);
  const reportHandlerRef = useRef<InputReportHandler | null>(null);
  const packetNumberRef = useRef(0);
  const isZRPressedRef = useRef(false);
  const mountedRef = useRef(true);
  const isUnityLoadedRef = useRef(false);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isUnityLoaded, setIsUnityLoaded] = useState(false);
  const [unityStatus, setUnityStatus] = useState("Cargando build de Unity...");
  const [unityError, setUnityError] = useState("");
  const [joyConStatus, setJoyConStatus] = useState("Joy-Con no conectado");
  const [bridgeStatus, setBridgeStatus] = useState("Bridge idle");
  const [bridgeError, setBridgeError] = useState("");
  const [reportCount, setReportCount] = useState(0);
  const [zrStateLabel, setZrStateLabel] = useState("ZR: up");
  const [motionStatus, setMotionStatus] = useState("IMU idle");

  const hasWebHid = typeof navigator !== "undefined" && Boolean(navigator.hid);

  function updateState<T>(setter: React.Dispatch<React.SetStateAction<T>>, value: React.SetStateAction<T>) {
    if (mountedRef.current) {
      setter(value);
    }
  }

  function getControlStatusLabel(): string {
    const normalizedStatus = joyConStatus.toLowerCase();

    if (normalizedStatus.includes("conectado")) {
      return "CONTROL IOT CONECTADO";
    }

    if (normalizedStatus.includes("conect")) {
      return "CONTROL IOT CONECTANDO";
    }

    return "CONTROL IOT NO CONECTADO";
  }

  function safeSendToUnity(method: string, payload = ""): boolean {
    const unityInstance = unityInstanceRef.current;

    if (!unityInstance || !isUnityLoadedRef.current) {
      updateState(setBridgeStatus, `Unity no cargado (intentando ${method})`);
      return false;
    }

    try {
      unityInstance.SendMessage(UNITY_BRIDGE_OBJECT, method, payload);
      updateState(setBridgeStatus, `Enviado -> ${UNITY_BRIDGE_OBJECT}.${method}`);
      updateState(setBridgeError, "");
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      updateState(setBridgeStatus, "Bridge error");
      updateState(
        setBridgeError,
        `Error bridge ${UNITY_BRIDGE_OBJECT}.${method}: ${message}`,
      );
      return false;
    }
  }

  async function sendJoyConSubcommand(
    device: HIDDevice,
    subcommand: number,
    data: number[] = [],
  ): Promise<void> {
    const packet = createSubcommandPacket(packetNumberRef.current, subcommand, data);
    packetNumberRef.current = (packetNumberRef.current + 1) % 16;
    await device.sendReport(JOYCON_OUTPUT_REPORT_ID, packet);
  }

  async function initializeJoyConMotion(device: HIDDevice): Promise<void> {
    updateState(setMotionStatus, "Inicializando IMU...");
    await sendJoyConSubcommand(device, JOYCON_SUBCOMMAND_ENABLE_IMU, [0x01]);
    await wait(50);
    await sendJoyConSubcommand(
      device,
      JOYCON_SUBCOMMAND_SET_INPUT_REPORT_MODE,
      [JOYCON_STANDARD_FULL_MODE],
    );
    await wait(50);
    updateState(setMotionStatus, "IMU activo");
  }

  async function disconnectJoyCon(): Promise<void> {
    const device = deviceRef.current;
    const handler = reportHandlerRef.current;

    if (device && handler) {
      device.removeEventListener("inputreport", handler);
    }

    if (device?.opened) {
      await device.close();
    }

    deviceRef.current = null;
    reportHandlerRef.current = null;
    isZRPressedRef.current = false;

    updateState(setJoyConStatus, "Joy-Con desconectado");
    updateState(setReportCount, 0);
    updateState(setZrStateLabel, "ZR: up");
    updateState(setMotionStatus, "IMU idle");
    safeSendToUnity("OnZRUp");
    safeSendToUnity("OnJoyConStatus", "disconnected");
  }

  async function connectJoyCon(): Promise<void> {
    if (!hasWebHid) {
      updateState(setJoyConStatus, "WebHID no soportado en este navegador");
      return;
    }

    try {
      updateState(setJoyConStatus, "Conectando");
      const devices = await navigator.hid.requestDevice({
        filters: [{ vendorId: NINTENDO_VENDOR_ID }],
      });

      if (!devices.length) {
        updateState(setJoyConStatus, "No seleccionaste un Joy-Con");
        return;
      }

      const device = devices[0];
      await device.open();
      packetNumberRef.current = 0;
      await initializeJoyConMotion(device);

      const onInputReport: InputReportHandler = (event) => {
        if (!isMotionReport(event)) {
          return;
        }

        const bytes = new Uint8Array(event.data.buffer);
        const reportId = event.reportId ?? JOYCON_STANDARD_FULL_MODE;

        updateState(setReportCount, (previous) => previous + 1);
        updateState(
          setMotionStatus,
          `Recibiendo reportes 0x${reportId.toString(16)}`,
        );

        const nowZRPressed = extractZRPressed(bytes);
        const wasZRPressed = isZRPressedRef.current;

        if (!wasZRPressed && nowZRPressed) {
          safeSendToUnity("OnZRDown");
          updateState(setZrStateLabel, "ZR: down");
        }

        if (wasZRPressed && !nowZRPressed) {
          safeSendToUnity("OnZRUp");
          updateState(setZrStateLabel, "ZR: up");
        }

        isZRPressedRef.current = nowZRPressed;

        const motion = extractMotionPayload(bytes);
        if (motion) {
          safeSendToUnity("OnMotion", JSON.stringify(motion));
        }
      };

      device.addEventListener("inputreport", onInputReport);

      deviceRef.current = device;
      reportHandlerRef.current = onInputReport;

      updateState(
        setJoyConStatus,
        `Joy-Con conectado: ${device.productName || "Nintendo HID"}`,
      );
      safeSendToUnity("OnJoyConStatus", "connected");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      updateState(setJoyConStatus, `No se pudo conectar Joy-Con: ${message}`);
    }
  }

  useEffect(() => {
    mountedRef.current = true;

    const script = document.createElement("script");
    script.src = loaderUrl;
    script.async = true;

    script.onload = async () => {
      try {
        if (!window.createUnityInstance || !canvasRef.current) {
          throw new Error("No se encontro createUnityInstance en el loader.");
        }

        const unityInstance = await window.createUnityInstance(
          canvasRef.current,
          {
            dataUrl,
            frameworkUrl,
            codeUrl,
            streamingAssetsUrl: "StreamingAssets",
            companyName: "Titans Crew",
            productName: "Prototipo",
            productVersion: "0.1.0",
          },
          (progress) => {
            updateState(setLoadingProgress, progress);
            updateState(
              setUnityStatus,
              `Cargando build de Unity... ${Math.round(progress * 100)}%`,
            );
          },
        );

        unityInstanceRef.current = unityInstance;
        isUnityLoadedRef.current = true;
        updateState(setIsUnityLoaded, true);
        updateState(setUnityStatus, "Unity listo");
        updateState(setUnityError, "");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        updateState(setUnityStatus, "No se pudo cargar Unity");
        updateState(setUnityError, message);
      }
    };

    script.onerror = () => {
      updateState(setUnityStatus, "No se pudo cargar el loader de Unity");
      updateState(
        setUnityError,
        "Verifica que los archivos BuildPrototipo.* existan en apps/web/public/Build.",
      );
    };

    document.body.appendChild(script);

    return () => {
      mountedRef.current = false;
      isUnityLoadedRef.current = false;

      void disconnectJoyCon();

      const unityInstance = unityInstanceRef.current;
      if (unityInstance?.Quit) {
        void unityInstance.Quit();
      }

      unityInstanceRef.current = null;
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [loaderUrl, dataUrl, frameworkUrl, codeUrl]);

  return (
    <div className="unity-embed">
      <div className="unity-toolbar">
        <div>
          <p className="unity-toolbar-title">{getControlStatusLabel()}</p>
        </div>

        <div className="unity-toolbar-actions">
          <button
            type="button"
            className="unity-primary-button"
            onClick={() => void connectJoyCon()}
            disabled={!hasWebHid}
          >
            Conectar Joy-Con
          </button>
          <button
            type="button"
            className="unity-secondary-button"
            onClick={() => void disconnectJoyCon()}
          >
            Desconectar
          </button>
        </div>
      </div>

      <div className="unity-canvas-shell">
        {!isUnityLoaded ? (
          <div className="unity-loading-overlay">
            <div className="unity-loading-box">
              <p>{unityStatus}</p>
              <div className="unity-loading-track">
                <div
                  className="unity-loading-fill"
                  style={{ width: `${Math.round(loadingProgress * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ) : null}

        <canvas
          ref={canvasRef}
          id="unity-canvas"
          className="unity-canvas"
          width="960"
          height="600"
          tabIndex={-1}
        />
      </div>

    </div>
  );
}

export default UnityGameEmbed;
