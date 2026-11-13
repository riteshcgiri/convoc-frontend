import { useRef, useEffect, useState } from 'react'


const MIN = 1, MAX = 4;

const usePanZoom = () => {
    const [t, setT] = useState({ scale: 1, x: 0, y: 0 })
    const box = useRef(null)
    const lastDist = useRef(null)
    const pointers = useRef(new Map())

    const clamp = (scale, x, y) => {
        const element = box.current;
        if (!element) return { scale, x, y }
        const maxX = (element.clientWidth * (scale - 1)) / 2
        const maxY = (element.clientHeight * (scale - 1)) / 2

        return { scale, x: Math.min(maxX, Math.max(-maxX, x)), y: Math.min(maxY, Math.max(-maxY, y)) }
    }

    const setScale = (fn) => setT(p => clamp(Math.min(MAX, Math.max(MIN, fn(p.scale))), p.x, p.y))
    const zoomBy = (d) => setScale(s => s + d)
    const reset = () => setT({ scale: 1, x: 0, y: 0 })

    const handlers = {
        onWheel: (e) => zoomBy(e.deltaY < 0 ? 0.25 : -0.25),
        onPointerDown: (e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
        },

        onPointerMove: (e) => {
            const prev = pointers.current.get(e.pointerId)
            if (!prev) return;
            pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

            if (pointers.current.size === 2) {
                const [a, b] = [...pointers.current.values()]
                const dist = Math.hypot(a.x - b.x, a.y - b.y)

                if (lastDist.current) setScale(s => s * (dist / lastDist.current))
                lastDist.current = dist
            } else {
                setT(p => p.scale > 1 ? clamp(p.scale, p.x + e.clientX - prev.x, p.y + e.clientY - prev.y) : p)
            }
        },

        onPointerUp : (e) => { 
            pointers.current.delete(e.pointerId)
            lastDist.current = 0
        },

        onPointerCancel : (e) => {
            pointers.current.delete(e.pointerId)
            lastDist.current = 0
        }
    }
    return { t, box, zoomBy, reset, handlers }

}

export default usePanZoom