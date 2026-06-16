import { ChevronLeft, List, Grid2X2, LayoutPanelLeft, Link2, Play, Files, Images, X, Download, ChevronRight, Check, Copy, ExternalLink, FileText, FileSpreadsheet, Presentation, Archive } from 'lucide-react';
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import '@vidstack/react/player/styles/base.css';
import Button from '../../components/Inputs/Button';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import useMediaStore from '../../store/media.store';
import useChatStore from '../../store/chat.store'
// ── Placeholder image generator ──────────────────────────────────────────────
// Uses picsum with a seed from filename so same file always gets same placeholder
const getPlaceholderUrl = (name = '', index = 0) => {
    const seed = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), index)
    return `https://picsum.photos/seed/${seed}/400/400`
}

const formatSize = (bytes) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    if (diff < 24 * 60 * 60 * 1000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    if (diff < 7 * 24 * 60 * 60 * 1000) return date.toLocaleDateString([], { weekday: 'short' })
    return date.toLocaleDateString([], { day: 'numeric', month: 'short' })
}

const getDocIcon = (type = '') => {
    if (type.includes('pdf')) return <FileText className='w-5 h-5' />
    if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) return <FileSpreadsheet className='w-5 h-5' />
    if (type.includes('presentation') || type.includes('powerpoint')) return <Presentation className='w-5 h-5' />
    if (type.includes('zip') || type.includes('rar')) return <Archive className='w-5 h-5' />
    return <Files className='w-5 h-5' />
}

const getDocExt = (name = '') => name.split('.').pop()?.toUpperCase() || 'FILE'

// ── Animation variants ────────────────────────────────────────────────────────
const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.04 } }
}

const itemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } }
}

// ── View style toggle ─────────────────────────────────────────────────────────
const MediaViewToggle = ({ viewStyle, setViewStyle }) => (
    <div className='flex gap-1 items-center px-2 py-1.5 border border-primary/30 text-primary/70 rounded-xl'>
        {[
            { key: 'list', Icon: List },
            { key: 'column', Icon: Grid2X2 },
            { key: 'grid', Icon: LayoutPanelLeft },
        ].map(({ key, Icon }) => (
            <motion.div
                key={key}
                whileTap={{ scale: 0.88 }}
                className={`p-1.5 rounded-lg cursor-pointer transition-colors duration-150
          ${viewStyle === key ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10'}`}
                onClick={() => setViewStyle(key)}
            >
                <Icon className='w-3.5 h-3.5' strokeWidth={2.2} />
            </motion.div>
        ))}
    </div>
)

// ── Empty state ───────────────────────────────────────────────────────────────
const NoMedia = ({ icon, label }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex items-center flex-col py-20'
    >
        <div className='w-fit p-5 bg-primary/10 rounded-full mb-4'>{icon}</div>
        <h2 className='text-primary font-semibold text-lg'>No {label} yet</h2>
        <p className='text-xs mt-1 text-zinc-400'>Shared {label.toLowerCase()} will appear here</p>
    </motion.div>
)

const SPAN_PATTERN = [20, 28, 16, 32, 22, 18, 30, 24, 14, 26, 20, 22]

const PhotoGallery = ({ data, setCurrentMedia, viewStyle }) => {

    if (viewStyle === 'grid') {
        return (
            <div
                className='px-4 py-3'
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gridAutoRows: '8px', gap: '6px', }}>
                {data.map((item, i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        initial='hidden'
                        animate='show'
                        className='cursor-pointer group overflow-hidden rounded-xl'
                        style={{ gridRowEnd: `span ${SPAN_PATTERN[i % SPAN_PATTERN.length]}` }}
                        onClick={() => setCurrentMedia(i)}
                    >
                        <img
                            src={getPlaceholderUrl(item.fileInfo?.name, i)}
                            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                            loading='lazy'
                            draggable={false}
                        />
                    </motion.div>
                ))}
            </div>
        )
    }

    if (viewStyle === 'column') {
        return (
            <div className='columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2 space-y-2 px-5 py-3'>
                {data.map((item, i) => (
                    <div
                        key={i}
                        className='break-inside-avoid cursor-pointer group'
                        onClick={() => setCurrentMedia(i)}
                    >
                        <img
                            src={getPlaceholderUrl(item.fileInfo?.name, i)}
                            className='w-full h-auto rounded-xl object-cover group-hover:scale-105 transition-all duration-300'  // ← h-auto key fix
                            loading='lazy'
                            draggable={false}
                        />
                    </div>
                ))}
            </div>
        )
    }

    // list view
    return (
        <div className='flex flex-col gap-1 px-3 py-2'>
            {data.map((item, i) => (
                <div
                    key={i}
                    className='flex items-center gap-3 p-2 rounded-xl hover:bg-primary/5 cursor-pointer group'
                    onClick={() => setCurrentMedia(i)}
                >
                    <img
                        src={getPlaceholderUrl(item.fileInfo?.name, i)}
                        className='w-12 h-12 rounded-xl object-cover shrink-0'
                        loading='lazy'
                    />
                    <div className='flex-1 min-w-0'>
                        <p className='text-xs font-medium text-primary truncate'>{item?.fileInfo?.name}</p>
                        <p className='text-[10px] text-zinc-400'>{formatDate(item?.createdAt)}</p>
                    </div>
                    <Download className='w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity' />
                </div>
            ))}
        </div>
    )
}

// ── Video gallery ─────────────────────────────────────────────────────────────
const VideoGallery = ({ data, setCurrentMedia, viewStyle }) => {
    const gridClass = viewStyle === 'grid'
        ? 'grid grid-cols-3 md:grid-cols-4 gap-2'
        : viewStyle === 'column'
            ? 'grid grid-cols-2 md:grid-cols-3 gap-2'
            : 'flex flex-col gap-1'

    return (
        <motion.div variants={containerVariants} initial='hidden' animate='show' className={`${gridClass} px-4 py-3`}>
            {data.map((msg, i) => (
                <motion.div key={msg._id} variants={itemVariants}>
                    {viewStyle === 'list' ? (
                        <div
                            className='flex items-center gap-3 p-2 rounded-xl hover:bg-primary/5 cursor-pointer group'
                            onClick={() => setCurrentMedia(i)}
                        >
                            <div className='w-12 h-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center'>
                                <Play className='w-5 h-5 text-primary' strokeWidth={1.6} />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-sm font-medium text-gray-700 truncate'>{msg.fileInfo?.name || 'Video'}</p>
                                <p className='text-xs text-gray-400'>{msg.sender?.name} • {formatDate(msg.createdAt)} • {formatSize(msg.fileInfo?.size)}</p>
                            </div>
                        </div>
                    ) : (
                        <div
                            className='relative overflow-hidden rounded-xl bg-primary/10 cursor-pointer group'
                            style={{ aspectRatio: '16/10' }}
                            onClick={() => setCurrentMedia(i)}
                        >
                            <img
                                src={getPlaceholderUrl(msg.fileInfo?.name, i + 100)}
                                className='w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity'
                                loading='lazy'
                            />
                            <div className='absolute inset-0 flex items-center justify-center'>
                                <motion.div
                                    whileHover={{ scale: 1.15 }}
                                    className='bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg'
                                >
                                    <Play className='w-5 h-5 text-primary fill-primary' strokeWidth={0} />
                                </motion.div>
                            </div>
                            <div className='absolute bottom-2 left-2 text-white text-xs bg-black/40 px-1.5 py-0.5 rounded-md truncate max-w-[80%]'>
                                {msg.fileInfo?.name}
                            </div>
                        </div>
                    )}
                </motion.div>
            ))}
        </motion.div>
    )
}

// ── Documents gallery ─────────────────────────────────────────────────────────
const DocumentsGallery = ({ data, viewStyle }) => {
    const gridClass = viewStyle === 'grid'
        ? 'grid grid-cols-3 md:grid-cols-5 gap-2'
        : viewStyle === 'column'
            ? 'grid grid-cols-1 md:grid-cols-3 gap-2'
            : 'flex flex-col gap-1'

    return (
        <motion.div variants={containerVariants} initial='hidden' animate='show' className={`${gridClass} px-4 py-3`}>
            {data.map((msg, i) => (
                <motion.div key={msg._id} variants={itemVariants}>
                    {viewStyle === 'list' ? (
                        <div className='flex items-center gap-3 p-2 rounded-xl hover:bg-primary/5 cursor-pointer group'>
                            <div className='w-10 h-10 flex-shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary'>
                                {getDocIcon(msg.fileInfo?.type)}
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-sm font-medium text-gray-700 truncate'>{msg.fileInfo?.name}</p>
                                <p className='text-xs text-gray-400'>
                                    {getDocExt(msg.fileInfo?.name)} • {formatSize(msg.fileInfo?.size)} • {msg.sender?.name} • {formatDate(msg.createdAt)}
                                </p>
                            </div>
                            <div className='text-primary opacity-0 group-hover:opacity-100 transition-opacity'>
                                <Download className='w-4 h-4' />
                            </div>
                        </div>
                    ) : (
                        <div className='relative bg-primary/10 hover:bg-primary/20 transition-colors rounded-xl p-4 cursor-pointer group flex flex-col items-center justify-center gap-2 aspect-square'>
                            <div className='text-primary'>{getDocIcon(msg.fileInfo?.type)}</div>
                            <p className='text-xs text-center text-gray-600 truncate w-full px-1'>{msg.fileInfo?.name}</p>
                            <span className='text-[10px] text-primary/60 font-medium'>{getDocExt(msg.fileInfo?.name)}</span>
                            <div className='absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                                <Download className='w-3.5 h-3.5 text-primary' />
                            </div>
                        </div>
                    )}
                </motion.div>
            ))}
        </motion.div>
    )
}

// ── Links gallery ─────────────────────────────────────────────────────────────
const LinksGalleryItem = ({ src, viewStyle }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = (e) => {
        e.stopPropagation()
        navigator.clipboard.writeText(src)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const domain = (() => {
        try { return new URL(src).hostname.replace('www.', '') }
        catch { return src }
    })()

    if (viewStyle === 'list') {
        return (
            <div className='flex items-center gap-3 p-2 rounded-xl hover:bg-primary/5 group'>
                <div className='w-8 h-8 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center'>
                    <Link2 className='w-3.5 h-3.5 text-primary' />
                </div>
                <div className='flex-1 min-w-0'>
                    <p className='text-xs font-medium text-primary truncate'>{domain}</p>
                    <p className='text-[10px] text-gray-400 truncate'>{src}</p>
                </div>
                <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <motion.button whileTap={{ scale: 0.85 }} onClick={handleCopy}
                        className='p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary'>
                        {copied ? <Check className='w-3.5 h-3.5 text-green-500' /> : <Copy className='w-3.5 h-3.5' />}
                    </motion.button>
                    <motion.a whileTap={{ scale: 0.85 }} href={src} target='_blank' rel='noreferrer'
                        className='p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary'>
                        <ExternalLink className='w-3.5 h-3.5' />
                    </motion.a>
                </div>
            </div>
        )
    }

    return (
        <motion.div whileHover={{ y: -2 }} className={`relative rounded-xl p-3 cursor-pointer transition-colors duration-200 flex flex-col gap-2 ${copied ? 'bg-green-500/15' : 'bg-primary/10 hover:bg-primary/15'} ${viewStyle === 'grid' ? 'aspect-square items-center justify-center' : 'h-36 items-start justify-between'}
      `}
            onClick={handleCopy}
        >
            <div className={`${viewStyle === 'grid' ? 'flex flex-col items-center gap-2' : 'flex gap-2 items-center w-full'}`}>
                {copied
                    ? <Check className='w-4 h-4 text-green-500' />
                    : <Link2 className='w-4 h-4 text-primary' />
                }
                <div className='flex w-full items-center'>
                    <p className={`text-xs flex-1 font-medium text-primary truncate ${viewStyle === 'grid' ? 'text-center w-full' : ''}`}>
                        {domain}
                    </p>
                    <motion.a
                        whileTap={{ scale: 0.85 }}
                        href={src} target='_blank' rel='noreferrer'
                        onClick={e => e.stopPropagation()}
                        className={`p-1 rounded-md w-fit h-fit text-primary hover:bg-white transition-colors ${viewStyle === 'grid' ? 'absolute top-2 right-2' : ''}`}
                    >
                        <ExternalLink className='w-3 h-3' />
                    </motion.a>
                </div>
            </div>
            {viewStyle !== 'grid' && (
                <p className='text-[10px] text-gray-400 truncate w-full'>{src}</p>
            )}

        </motion.div>
    )
}

const LinksGallery = ({ data, viewStyle }) => {
    const gridClass = viewStyle === 'grid'
        ? 'grid grid-cols-2 md:grid-cols-4 gap-2'
        : viewStyle === 'column'
            ? 'grid grid-cols-1 md:grid-cols-3 gap-2'
            : 'flex flex-col gap-1'

    return (
        <motion.div variants={containerVariants} initial='hidden' animate='show' className={`${gridClass} px-4 py-3`}>
            {data.map((src, i) => (
                <motion.div key={i} variants={itemVariants}>
                    <LinksGalleryItem src={src} viewStyle={viewStyle} />
                </motion.div>
            ))}
        </motion.div>
    )
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
const Lightbox = ({ data, currentIndex, onClose, onPrev, onNext, mediaType }) => {
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowLeft') onPrev()
            if (e.key === 'ArrowRight') onNext()
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [])

    const msg = data[currentIndex]
    if (!msg) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center'
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.92, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className='relative max-w-4xl w-full mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl'
                    onClick={e => e.stopPropagation()}
                >
                    {/* header */}
                    <div className='flex items-center justify-between px-4 py-3 border-b border-gray-100'>
                        <div>
                            <p className='text-sm font-medium text-gray-700 truncate max-w-xs'>{msg.fileInfo?.name}</p>
                            <p className='text-xs text-gray-400'>{msg.sender?.name} • {formatDate(msg.createdAt)}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <motion.button whileTap={{ scale: 0.9 }}
                                className='p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20'>
                                <Download className='w-4 h-4' />
                            </motion.button>
                            <motion.button whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className='p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200'>
                                <X className='w-4 h-4' />
                            </motion.button>
                        </div>
                    </div>

                    {/* media */}
                    <div className='h-[500px] bg-gray-50 flex items-center justify-center'>
                        {mediaType === 'photos' && (
                            <img
                                src={getPlaceholderUrl(msg.fileInfo?.name, currentIndex)}
                                className='max-w-full max-h-full object-contain'
                            />
                        )}
                        {mediaType === 'videos' && (
                            <div className='flex flex-col items-center gap-4 text-primary/40'>
                                <Play className='w-16 h-16' strokeWidth={1} />
                                <p className='text-sm'>Video preview not available yet</p>
                                <p className='text-xs text-gray-400'>{msg.fileInfo?.name}</p>
                            </div>
                        )}
                    </div>

                    {/* nav arrows */}
                    {data.length > 1 && (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                onClick={onPrev}
                                className='absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-primary hover:bg-white'
                            >
                                <ChevronLeft className='w-5 h-5' />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                onClick={onNext}
                                className='absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-primary hover:bg-white'
                            >
                                <ChevronRight className='w-5 h-5' />
                            </motion.button>
                        </>
                    )}

                    {/* counter */}
                    <div className='absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 text-white text-xs px-3 py-1 rounded-full'>
                        {currentIndex + 1} / {data.length}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// ── Tab config ────────────────────────────────────────────────────────────────
const tabs = [
    { key: 'photos', label: 'Photos', Icon: Images },
    { key: 'videos', label: 'Videos', Icon: Play },
    { key: 'documents', label: 'Docs', Icon: Files },
    { key: 'links', label: 'Links', Icon: Link2 },
]

const emptyIcons = {
    photos: <Images className='w-10 h-10 text-primary/40' strokeWidth={1.4} />,
    videos: <Play className='w-10 h-10 text-primary/40' strokeWidth={1.4} />,
    documents: <Files className='w-10 h-10 text-primary/40' strokeWidth={1.4} />,
    links: <Link2 className='w-10 h-10 text-primary/40' strokeWidth={1.4} />,
}

// ── Main component ────────────────────────────────────────────────────────────
const Media = () => {
    const { files, docs, links, loading, fetchMedia } = useMediaStore()
    const [mediaType, setMediaType] = useState('photos')
    const [viewStyle, setViewStyle] = useState('column')
    const [currentMedia, setCurrentMedia] = useState(null)

    useEffect(() => { fetchMedia() }, [])

    const photos = Array.isArray(files) ? files.filter(m => m.fileInfo?.category === 'image') : []
    const videos = Array.isArray(files) ? files.filter(m => m.fileInfo?.category === 'video') : []
    const docsList = Array.isArray(docs) ? docs : []
    const linksList = Array.isArray(links) ? links.flatMap(m => m.links || []) : []

    const mediaMap = { photos, videos, documents: docsList, links: linksList }
    const current = mediaMap[mediaType] || []
    const totalLen = photos.length + videos.length + docsList.length + linksList.length

    const canLightbox = mediaType === 'photos' || mediaType === 'videos'

    return (
        <div className='w-full h-full bg-white flex flex-col'>

            {/* Header */}
            <div className='flex justify-between items-center px-4 pt-5 pb-3 flex-shrink-0'>
                <div>
                    <Link to='/' className='flex text-primary gap-1.5 items-center group'>
                        <ChevronLeft className='w-4 h-4 group-hover:-translate-x-0.5 transition-transform' />
                        <h2 className='text-xl font-bold'>Media</h2>
                    </Link>
                    <p className='text-xs text-gray-400 mt-0.5 ml-5'>
                        {loading ? 'Loading...' : `${totalLen} files`}
                    </p>
                </div>
                <MediaViewToggle viewStyle={viewStyle} setViewStyle={setViewStyle} />
            </div>

            {/* Tabs */}
            <div className='flex gap-1 px-4 pb-0 border-b border-zinc-100 flex-shrink-0'>
                {tabs.map(({ key, label, Icon }) => {
                    const count = mediaMap[key]?.length || 0
                    const active = mediaType === key
                    return (
                        <motion.button
                            key={key}
                            onClick={() => setMediaType(key)}
                            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium rounded-t-lg transition-colors relative
                ${active ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Icon className='w-3.5 h-3.5' strokeWidth={active ? 2.2 : 1.8} />
                            {label}
                            {count > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold
                  ${active ? 'bg-primary/15 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                                    {count}
                                </span>
                            )}
                            {active && (
                                <motion.div
                                    layoutId='activeTab'
                                    className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full'
                                />
                            )}
                        </motion.button>
                    )
                })}
            </div>

            {/* Content */}
            <div className='flex-1 overflow-y-auto min-h-0'>
                {loading ? (
                    <div className='flex items-center justify-center h-40'>
                        <div className='w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin' />
                    </div>
                ) : current.length === 0 ? (
                    <NoMedia icon={emptyIcons[mediaType]} label={tabs.find(t => t.key === mediaType)?.label || ''} />
                ) : (
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={mediaType}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {mediaType === 'photos' && <PhotoGallery data={current} setCurrentMedia={setCurrentMedia} viewStyle={viewStyle} />}
                            {mediaType === 'videos' && <VideoGallery data={current} setCurrentMedia={setCurrentMedia} viewStyle={viewStyle} />}
                            {mediaType === 'documents' && <DocumentsGallery data={current} viewStyle={viewStyle} />}
                            {mediaType === 'links' && <LinksGallery data={linksList} viewStyle={viewStyle} />}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            {/* Lightbox */}
            {currentMedia !== null && canLightbox && (
                <Lightbox
                    data={current}
                    currentIndex={currentMedia}
                    mediaType={mediaType}
                    onClose={() => setCurrentMedia(null)}
                    onPrev={() => setCurrentMedia(i => (i === 0 ? current.length - 1 : i - 1))}
                    onNext={() => setCurrentMedia(i => (i === current.length - 1 ? 0 : i + 1))}
                />
            )}
        </div>
    )
}

export default Media
