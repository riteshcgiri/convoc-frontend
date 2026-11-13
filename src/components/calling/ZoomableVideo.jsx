import { useState } from 'react'
import { ZoomIn, ZoomOut, RotateCw, Maximize2 } from 'lucide-react'
import StreamView from './StreamView'
import usePanZoom from '../../hooks/usePanZoom'


const ZBtn = ({ onClick, label, children }) => (
    <button onClick={onClick} aria-label={label}
        className='w-10 h-10 grid place-items-center rounded-full text-white hover:bg-white/15 active:scale-90 transition'>
        {children}
    </button>
)


const ZoomableVideo = (props) => {
    const { t, box, zoomBy, reset, handlers } = usePanZoom()
    const [rotated, setRotated] = useState(false)

    const cw = box.current?.clientWidth ?? 0
    const ch = box.current?.clientHeight ?? 0

    const toggleRotate = () => { reset(); setRotated(prev => !prev) }
    return (
        <div className='relative w-full h-full bg-black'>
            <div ref={box} {...handlers} onDoubleClick={reset}
                className="absolute inset-0 overflow-hidden touch-none flex items-center justify-center">
                <div className="shrink-0 will-change-transform"
                    style={{
                        width: rotated ? ch : '100%',
                        height: rotated ? cw : '100%',
                        transform: `translate(${t.x}px, ${t.y}px) scale(${t.scale}) rotate(${rotated ? 90 : 0}deg)`,
                    }}>
                    <StreamView {...props} fit="contain" />
                </div>
            </div>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center rounded-full bg-black/30 backdrop-blur-xl border border-white/10 py-1">
                <ZBtn onClick={() => zoomBy(0.5)} label="Zoom in"><ZoomIn className="w-5 h-5" /></ZBtn>
                <span className="text-[10px] font-mono text-white/70">{Math.round(t.scale * 100)}%</span>
                <ZBtn onClick={() => zoomBy(-0.5)} label="Zoom out"><ZoomOut className="w-5 h-5" /></ZBtn>
                <ZBtn onClick={reset} label="Reset"><Maximize2 className="w-4 h-4" /></ZBtn>
                <ZBtn onClick={toggleRotate} label="Rotate"><RotateCw className="w-5 h-5" /></ZBtn>
            </div>
        </div>
    )
}

export default ZoomableVideo