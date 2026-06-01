import { useEffect, useRef, useState } from "react"
import useCallStore from "../../store/call.store"

const AudioWave = ({ stream, isMuted }) => {
  const [levels, setLevels] = useState(Array(7).fill(4))
  const animFrameRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceRef = useRef(null)
  const ctxRef = useRef(null)

  useEffect(() => {
    if (!stream || isMuted) {
      setLevels(Array(7).fill(4))
      return
    }

    const audioCtx = new AudioContext()
    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 32
    const source = audioCtx.createMediaStreamSource(stream)
    source.connect(analyser)

    ctxRef.current = audioCtx
    analyserRef.current = analyser
    sourceRef.current = source

    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    const tick = () => {
      analyser.getByteFrequencyData(dataArray)
      const bars = Array.from({ length: 7 }, (_, i) => {
        const val = dataArray[i] || 0
        return Math.max(4, (val / 255) * 48)
      })
      setLevels(bars)
      animFrameRef.current = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      source.disconnect()
      audioCtx.close()
    }
  }, [stream, isMuted])

  return (
    <div className="flex items-center gap-1 h-16">
      {levels.map((h, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full bg-primary/50 transition-all duration-75"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  )
}


export default AudioWave