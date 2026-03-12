import { useEffect, useMemo, useRef, useState } from 'react'
import { Gamepad2, Play, Unplug } from 'lucide-react'
import { Unity, useUnityContext } from 'react-unity-webgl'
import type { CSSProperties } from 'react'

type UnityGameEmbedProps = {
  useRealBuild?: boolean
  loaderUrl?: string
  dataUrl?: string
  frameworkUrl?: string
  codeUrl?: string
}

type RealUnityEmbedProps = {
  loaderUrl: string
  dataUrl: string
  frameworkUrl: string
  codeUrl: string
}

type JoyConMotionPayload = {
  gx: number
  gy: number
  gz: number
  ax: number
  ay: number
  az: number
  sx: number
  sy: number
}

type HidInputReportEventLike = Event & {
  data: DataView
  reportId?: number
}

type HidDeviceLike = {
  opened: boolean
  productName?: string
  open: () => Promise<void>
  close: () => Promise<void>
  sendReport: (reportId: number, data: BufferSource) => Promise<void>
  addEventListener: (type: 'inputreport', listener: (event: HidInputReportEventLike) => void) => void
  removeEventListener: (type: 'inputreport', listener: (event: HidInputReportEventLike) => void) => void
}

type HidNavigatorLike = Navigator & {
  hid?: {
    requestDevice: (options: { filters: Array<{ vendorId: number }> }) => Promise<HidDeviceLike[]>
  }
}

const NINTENDO_VENDOR_ID = 0x057e
const UNITY_BRIDGE_OBJECT = 'JoyConWebBridge'
const RUMBLE_NEUTRAL = [0x00, 0x01, 0x40, 0x40, 0x00, 0x01, 0x40, 0x40]

const readInt16LE = (bytes: Uint8Array, index: number) => {
  if (index + 1 >= bytes.length) return 0

  const value = bytes[index] | (bytes[index + 1] << 8)
  return value >= 0x8000 ? value - 0x10000 : value
}

const extractMotionPayload = (bytes: Uint8Array): JoyConMotionPayload | null => {
  if (bytes.length < 24) return null

  const accelStart = bytes.length >= 24 ? 12 : 13
  const gyroStart = accelStart + 6

  const axRaw = readInt16LE(bytes, accelStart)
  const ayRaw = readInt16LE(bytes, accelStart + 2)
  const azRaw = readInt16LE(bytes, accelStart + 4)

  const gxRaw = readInt16LE(bytes, gyroStart)
  const gyRaw = readInt16LE(bytes, gyroStart + 2)
  const gzRaw = readInt16LE(bytes, gyroStart + 4)

  return {
    gx: gxRaw / 1024,
    gy: gyRaw / 1024,
    gz: gzRaw / 1024,
    ax: axRaw / 4096,
    ay: ayRaw / 4096,
    az: azRaw / 4096,
    sx: 0,
    sy: 0,
  }
}

const extractZRPressed = (bytes: Uint8Array) => {
  // Depending on report layout/adapter, ZR can land on byte 1/2/3 (bit 7).
  if (bytes.length < 2) return false
  const candidates = [1, 2, 3].filter((i) => i < bytes.length)
  return candidates.some((i) => (bytes[i] & 0b10000000) !== 0)
}

const RealUnityEmbed = ({ loaderUrl, dataUrl, frameworkUrl, codeUrl }: RealUnityEmbedProps) => {
  const { unityProvider, loadingProgression, isLoaded, sendMessage } = useUnityContext({
    loaderUrl,
    dataUrl,
    frameworkUrl,
    codeUrl,
  })

  const [joyConStatus, setJoyConStatus] = useState('Joy-Con no conectado')
  const [isJoyConConnected, setIsJoyConConnected] = useState(false)
  const [bridgeStatus, setBridgeStatus] = useState('Bridge idle')
  const [bridgeError, setBridgeError] = useState<string | null>(null)
  const [reportCount, setReportCount] = useState(0)
  const [zrStateLabel, setZrStateLabel] = useState('ZR: up')

  const deviceRef = useRef<HidDeviceLike | null>(null)
  const isZRPressedRef = useRef(false)
  const reportHandlerRef = useRef<((event: HidInputReportEventLike) => void) | null>(null)
  const packetCounterRef = useRef(0)

  const hasWebHid = useMemo(() => {
    if (typeof navigator === 'undefined') return false
    return Boolean((navigator as HidNavigatorLike).hid)
  }, [])

  const safeSendToUnity = (method: string, payload = '') => {
    if (!isLoaded) {
      setBridgeStatus(`Unity no cargado (intentando ${method})`)
      return false
    }

    try {
      sendMessage(UNITY_BRIDGE_OBJECT, method, payload)
      setBridgeStatus(`Enviado -> ${UNITY_BRIDGE_OBJECT}.${method}`)
      setBridgeError(null)
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const fullMessage = `Error bridge ${UNITY_BRIDGE_OBJECT}.${method}: ${message}`
      setBridgeError(fullMessage)
      setBridgeStatus('Bridge error')
      console.error(fullMessage)
      return false
    }
  }

  const disconnectJoyCon = async () => {
    const device = deviceRef.current
    const currentHandler = reportHandlerRef.current

    if (device && currentHandler) {
      device.removeEventListener('inputreport', currentHandler)
    }

    if (device?.opened) {
      await device.close()
    }

    deviceRef.current = null
    reportHandlerRef.current = null
    isZRPressedRef.current = false

    setIsJoyConConnected(false)
    setJoyConStatus('Joy-Con desconectado')
    safeSendToUnity('OnZRUp', '')
    safeSendToUnity('OnJoyConStatus', 'disconnected')
    setReportCount(0)
    setZrStateLabel('ZR: up')
  }

  const connectJoyCon = async () => {
    if (!hasWebHid) {
      setJoyConStatus('WebHID no soportado en este navegador')
      return
    }

    try {
      const hidNavigator = navigator as HidNavigatorLike
      if (!hidNavigator.hid) {
        setJoyConStatus('WebHID no soportado en este navegador')
        return
      }

      const devices = await hidNavigator.hid.requestDevice({
        filters: [{ vendorId: NINTENDO_VENDOR_ID }],
      })

      if (!devices.length) {
        setJoyConStatus('No seleccionaste un Joy-Con')
        return
      }

      const device = devices[0]
      await device.open()
      const sendSubcommand = async (subcommand: number, data: number[]) => {
        const packet = packetCounterRef.current & 0x0f
        packetCounterRef.current = (packetCounterRef.current + 1) & 0x0f
        const payload = Uint8Array.from([packet, ...RUMBLE_NEUTRAL, subcommand, ...data])
        await device.sendReport(0x01, payload)
      }

      // Enable IMU + input report mode (buttons + motion)
      await sendSubcommand(0x40, [0x01])
      await sendSubcommand(0x03, [0x30])

      const onInputReport = (event: HidInputReportEventLike) => {
        // Respect DataView slice; buffer can contain unrelated bytes around it.
        const bytes = new Uint8Array(event.data.buffer, event.data.byteOffset, event.data.byteLength)
        setReportCount((prev) => prev + 1)

        const nowZRPressed = extractZRPressed(bytes)
        const wasZRPressed = isZRPressedRef.current

        if (!wasZRPressed && nowZRPressed) {
          safeSendToUnity('OnZRDown', '')
          setZrStateLabel('ZR: down')
        }

        if (wasZRPressed && !nowZRPressed) {
          safeSendToUnity('OnZRUp', '')
          setZrStateLabel('ZR: up')
        }

        isZRPressedRef.current = nowZRPressed

        const motion = extractMotionPayload(bytes)
        if (motion) {
          safeSendToUnity('OnMotion', JSON.stringify(motion))
        }
      }

      device.addEventListener('inputreport', onInputReport)

      deviceRef.current = device
      reportHandlerRef.current = onInputReport

      setIsJoyConConnected(true)
      setJoyConStatus(`Joy-Con conectado: ${device.productName ?? 'Nintendo HID'}`)
      safeSendToUnity('OnJoyConStatus', 'connected')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      setJoyConStatus(`No se pudo conectar Joy-Con: ${message}`)
    }
  }

  useEffect(() => {
    return () => {
      void disconnectJoyCon()
    }
  }, [])

  return (
    <div style={styles.wrapper}>
      <div style={styles.statusBar}>
        <div style={styles.statusTextGroup}>
          <p style={styles.statusMain}>{joyConStatus}</p>
          {bridgeError && <p style={styles.errorText}>{bridgeError}</p>}
        </div>
        <div style={styles.buttonRow}>
          <button
            type="button"
            onClick={connectJoyCon}
            disabled={isJoyConConnected || !hasWebHid}
            className="inline-flex items-center gap-1 rounded-full border border-[#0f3d78] bg-[#0f3d78] px-3 py-1.5 font-semibold text-white transition hover:bg-[#0b305f] disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              ...styles.primaryButton,
              ...(isJoyConConnected || !hasWebHid ? styles.disabledButton : {}),
            }}
          >
            <Gamepad2 size={14} />
            Conectar Joy-Con
          </button>

          <button
            type="button"
            onClick={() => void disconnectJoyCon()}
            disabled={!isJoyConConnected}
            className="inline-flex items-center gap-1 rounded-full border border-[#b7c4d1] bg-white px-3 py-1.5 font-semibold text-[#28415a] transition hover:bg-[#f3f7fb] disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              ...styles.secondaryButton,
              ...(!isJoyConConnected ? styles.disabledButton : {}),
            }}
          >
            <Unplug size={14} />
            Desconectar
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-black" style={styles.canvasWrap}>
        {!isLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 text-sm font-medium text-white" style={styles.loaderOverlay}>
            Cargando build de Unity... {Math.round(loadingProgression * 100)}%
          </div>
        )}
        <Unity
          unityProvider={unityProvider}
          className="h-[320px] w-full sm:h-[360px]"
          style={{
            ...styles.canvas,
            visibility: isLoaded ? 'visible' : 'hidden',
          }}
        />
      </div>
    </div>
  )
}

export const UnityGameEmbed = ({
  useRealBuild = false,
  loaderUrl,
  dataUrl,
  frameworkUrl,
  codeUrl,
}: UnityGameEmbedProps) => {
  const hasBuildConfig = Boolean(loaderUrl && dataUrl && frameworkUrl && codeUrl)

  if (useRealBuild && hasBuildConfig) {
    return (
      <RealUnityEmbed
        loaderUrl={loaderUrl ?? ''}
        dataUrl={dataUrl ?? ''}
        frameworkUrl={frameworkUrl ?? ''}
        codeUrl={codeUrl ?? ''}
      />
    )
  }

  return (
    <div className="flex h-[320px] items-center justify-center rounded-xl bg-black sm:h-[360px]" style={styles.canvasWrap}>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-bold text-[#002244]"
        style={styles.primaryButton}
      >
        <Play size={14} />
        PLAY NOW
      </button>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  statusBar: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    borderRadius: '10px',
    border: '1px solid #d8dee5',
    background: 'rgba(255,255,255,0.92)',
    padding: '8px 12px',
    fontSize: '12px',
    color: '#2c4258',
  },
  statusTextGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statusMain: {
    margin: 0,
    fontWeight: 600,
  },
  statusSub: {
    margin: 0,
    fontSize: '11px',
    color: '#4f6173',
  },
  errorText: {
    margin: 0,
    fontSize: '11px',
    fontWeight: 700,
    color: '#c1121f',
  },
  buttonRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    borderRadius: '999px',
    border: '1px solid #0f3d78',
    backgroundColor: '#0f3d78',
    padding: '6px 12px',
    fontWeight: 700,
    color: '#fff',
    cursor: 'pointer',
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    borderRadius: '999px',
    border: '1px solid #b7c4d1',
    backgroundColor: '#fff',
    padding: '6px 12px',
    fontWeight: 700,
    color: '#28415a',
    cursor: 'pointer',
  },
  disabledButton: {
    opacity: 0.55,
    cursor: 'not-allowed',
  },
  canvasWrap: {
    width: 'min(980px, 100%)',
    height: 'min(56vw, 520px)',
    margin: '0 auto',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '12px',
    backgroundColor: '#000',
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.8)',
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff',
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
}
