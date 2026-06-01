import { ChevronLeft, List, Grid2X2, LayoutPanelLeft, ImageOff, Link2, Play, Files, VideoOff, Link2Off, Images, X, Download, Share, Share2, ChevronRight, Check,  } from 'lucide-react';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/Inputs/Button';
import '@vidstack/react/player/styles/base.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
const items = {
    photos: {
        label: 'Photos',
        icon: <Images className='w-10 h-10 text-primary' strokeWidth={1.6} />
    },
    videos: {
        label: 'Videos',
        icon: <Play className='w-10 h-10 text-primary' strokeWidth={1.6} />
    },
    documents: {
        label: 'Documents',
        icon: <Files className='w-10 h-10 text-primary' strokeWidth={1.6} />
    },
    links: {
        label: 'Links',
        icon: <Link2 className='w-10 h-10 text-primary' strokeWidth={1.6} />
    },
}



const MediaView = ({viewStyle, setViewStyle}) => {

    return (
        <div className='flex gap-1 items-center justify-between px-2 py-1 border text-primary/70 border-primary rounded-xl relative'>
            <div className={`${viewStyle === 'list' && 'bg-primary/30 text-primary'} transition-all duration-200 cursor-pointer p-2 rounded-lg`} onClick={() => setViewStyle('list')}>
                <List className={`w-3.5 h-3.5`} strokeWidth={2.2} />
            </div>
            <div className={`${viewStyle === 'column' && 'bg-primary/30 text-primary'} transition-all duration-200 cursor-pointer p-2 rounded-lg`} onClick={() => setViewStyle('column')}>
                <Grid2X2 className={`w-3.5 h-3.5`} strokeWidth={2.2} />
            </div>
            <div className={`${viewStyle === 'grid' && 'bg-primary/30 text-primary'} transition-all duration-200 cursor-pointer p-2 rounded-lg`} onClick={() => setViewStyle('grid')}>
                <LayoutPanelLeft className={`w-3.5 h-3.5`} strokeWidth={2.2} />
            </div>
        </div>
    )

}
const NoMedia = ({ item }) => {
    return (
        <div className='flex items-center flex-col '>
            <div className='w-fit p-5 bg-primary/20 rounded-full mb-5'>
                {item?.icon}
            </div>
            <h2 className='text-primary font-semibold text-xl'>No {item?.label} Found</h2>
            <h3 className='text-xs mt-1 text-zinc-400'>Your shared {item?.label} will appear here.</h3>
        </div>
    )
}
const Gallery = ({ data, mediaType, setCurrentMedia, viewStyle, setViewStyle }) => {

    if (mediaType === 'photos') return <PhotoGallery data={data} setCurrentMedia={setCurrentMedia} viewStyle={viewStyle}/>
    else if (mediaType === 'videos') return <VideoGallery data={data} setCurrentMedia={setCurrentMedia} viewStyle={viewStyle} />
    else if (mediaType === 'documents') return <DocumentsGallery data={data}  viewStyle={viewStyle} />
    else if (mediaType === 'links') return <LinksGallery data={data} viewStyle={viewStyle} />
    else return <NoMedia />

}
const PhotoGallery = ({ data, setCurrentMedia, viewStyle }) => {
    return (
        <div className={`${viewStyle === 'grid' ? 'columns-2 sm:columns-3 md:columns-4 lg:columns-5 space-y-2' : viewStyle === 'column' ? 'grid grid-cols-1 md:grid-cols-3' : 'grid grid-cols-1' }  gap-2  px-5 py-3 relative`}>
            {data.map((src, i) => (
                <div key={i} className={`break-inside-avoid ${viewStyle === 'list' ?  'flex items-start gap-2 hover:bg-primary/10 p-2 rounded-md cursor-pointer': ''} group`} onClick={() => setCurrentMedia(i)}>
                    <img src={src} className={`w-full ${viewStyle === 'grid' ?  '':' h-40'} ${viewStyle === 'list' && '!w-10 !h-10'} rounded-xl object-cover cursor-pointer group-hover:scale-105 transition-all duration-300`} loading='lazy' draggable={false} />
                    {
                    viewStyle === 'list' && 
                        <div className='flex items-center w-full'>
                            <div className='flex-1 text-primary leading-1.5'>
                                <h2 className='text-xs'>File Name will be here</h2>
                                <span className='text-[10px]'>Today, 2:11 PM</span>
                            </div>
                            <div className='text-primary mt-2'>
                                <Download className='w-4 h-4'/>
                            </div>
                        </div>
                    }
                </div>

            ))}
        </div>
    )
}
const VideoGallery = ({ data, setCurrentMedia }) => {
    return (
        <div className="grid grid-cols-4 gap-2 flex-wrap px-5 py-3">
            {data.map((src, i) => (
                <div key={i} className="w-full h-32 bg-primary/20 p-5 rounded-md flex items-center justify-center cursor-pointer group" onClick={() => setCurrentMedia(src)}>
                    <div className='bg-primary/30 p-2 rounded-full group-hover:scale-125 transition-all' >
                        <Play className='w-7 h-7 text-primary' strokeWidth={1.6} />

                    </div>
                </div>
            ))}


        </div>
    )
}
const DocumentsGallery = ({ data, viewStyle }) => {
    return (
        <div className={`gap-2 px-5 py-3 grid ${viewStyle === 'grid' ? 'grid-cols-2 md:grid-cols-8' : viewStyle === 'column' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'} overflow-y-auto`}>
            {data.map((src, i) => (
                <div key={i} className={`w-full ${viewStyle === 'grid' ? 'h-32 justify-center items-center' : viewStyle === 'column' ? 'h-46 justify-center items-center' : 'h-fit justify-start items-center gap-2'} bg-primary/20 hover:bg-primary/30 text-primary  p-5 rounded-md  cursor-pointer group relative`} onClick={() => setCurrentMedia(src)}>
                    <div className={` flex ${viewStyle === 'list' ? 'items-center' : ' w-full flex-col items-center'} gap-2`} >
                        <Files />
                        <div className='text-xs flex justify-between' >
                            <h2 >File Name</h2>

                        </div>

                    </div>
                    <h2 className={` absolute ${viewStyle === 'list' ? 'right-2 top-2' : 'left-2 bottom-2'} z-10 text-xs`}>
                        Pdf
                    </h2>
                    <div className={`group-hover:inline-block absolute right-2 bottom-2 z-10 p-2 rounded-full  ${viewStyle === 'list' ? '' : 'md:hidden bg-white'}`}>
                        <Download className='w-4 h-4' />
                    </div>
                </div>
            ))}


        </div>
    )
}
const LinksGallery = ({ data, viewStyle }) => {

    return (
        <div className={`gap-2 px-5 py-3 grid ${viewStyle === 'grid' ? 'grid-cols-2 md:grid-cols-8' : viewStyle === 'column' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'}`}>
            {data.map((src, i) => {
                const [showLink, setShowLink] = useState(false)
                const [linkCopied, setLinkCopied] = useState(false)

                return (
                    <div key={i} className={`w-full flex  ${viewStyle === 'grid' ? 'h-32 justify-center items-center' : viewStyle === 'column' ? 'h-46 justify-center items-center' : 'h-fit justify-start gap-2'} ${linkCopied ? 'bg-green-500/20' : 'bg-primary/20 hover:bg-primary/30'} transition-all duration-300 text-primary  p-5 rounded-md  cursor-pointer group relative`} onClick={() =>{ window.navigator.clipboard.writeText(src); setLinkCopied(true); setTimeout(() => {setLinkCopied(false)}, 2000);}}>
                        <div className={` flex ${viewStyle === 'list' ? '' : ' w-full flex-col items-center'} gap-2`} >
                            {linkCopied ? <Check className='text-green-500' /> : <Link2 />}
                        </div>
                        <input value={src} className={`text-xs flex justify-between  text-wrap  px-1 py-0.5 outline-none overflow-hidden ${viewStyle === 'list' ? 'flex-1 w-fit' : 'absolute bottom-2 mx-auto'} ${viewStyle === 'grid' && 'w-5/6' } rounded-sm`} readOnly />
                    </div>
                )
            })}


        </div>
    )
}


const Media = () => {

    const [mediaType, setMediaType] = useState('photos'); //image, video, document, links
    const [activeTab, setActiveTab] = useState('all'); //sent, received, all
    const [viewStyle, setViewStyle] = useState('grid'); //grid, columns, list
    const [currentMedia, setCurrentMedia] = useState(null)
    
    const media = {
        photos: [
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&h=900&fit=crop",
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1200&fit=crop",
            "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&h=1600&fit=crop",
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&h=700&fit=crop",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=700&h=1000&fit=crop",
            "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200&h=1200&fit=crop",
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1000&h=1400&fit=crop",
            "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1500&h=1000&fit=crop",
            "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=1080&h=1350&fit=crop",

            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&h=900&fit=crop",
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1200&fit=crop",
            "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&h=1600&fit=crop",
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&h=700&fit=crop",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=700&h=1000&fit=crop",
            "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200&h=1200&fit=crop",
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1000&h=1400&fit=crop",
            "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1500&h=1000&fit=crop",
            "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=1080&h=1350&fit=crop"
        ],
        videos: [
            "https://media.w3.org/2010/05/bunny/trailer.mp4",
            "https://media.w3.org/2010/05/sintel/trailer.mp4",
            "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
            "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
            "https://www.w3schools.com/html/mov_bbb.mp4",
            "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
            "https://samplelib.com/lib/preview/mp4/sample-30s.mp4",
            "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        ],
        documents: [
            "https://sample-videos.com/zip/10mb.zip",
            "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            "https://file-examples.com/storage/feff9b7b3c1f6d3e7f/sample-xls-file.xls",
            "https://file-examples.com/storage/feff9b7b3c1f6d3e7f/sample-ppt-file.ppt",
            "https://file-examples.com/storage/feff9b7b3c1f6d3e7f/sample-doc-file.doc",
            "https://file-examples.com/storage/feff9b7b3c1f6d3e7f/sample-pptx-file.pptx",
            "https://file-examples.com/storage/feff9b7b3c1f6d3e7f/sample-xlsx-file.xlsx",
            "https://file-examples.com/storage/feff9b7b3c1f6d3e7f/sample-docx-file.docx",
            "https://file-examples.com/wp-content/uploads/2017/02/file-sample_100kB.docx",
            "https://www.learningcontainer.com/wp-content/uploads/2020/04/sample-text-file.txt",
        ],
        links: [
            "https://twitter.com/riteshcgiri",
            "https://www.snapchat.com/ryancgiri",
            "https://www.reddit.com/riteshcgiri",
            "https://www.facebook.com/riteshcgiri",
            "https://www.tiktok.com/not_available",
            "https://www.instagram.com/riteshcgiri",
            "https://www.linkedin.com/in/riteshcgiri",
            "https://discord.com/lost.child.for.a.reason",
            "https://www.youtube.com/channel/codefromcodes",
           
        ]
    }

    const mediaLen = media.documents.length + media.photos.length + media.videos.length + media.links.length;

    const handleDownload = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();

            const blobUrl = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = "image.jpg";

            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error("Download failed:", err);
        }
    }

    return (
        <div className='w-full h-full bg-white mb-20'>
            <div className='flex justify-between items-center pe-10'>
                <div className="px-4 pt-5 pb-3 ">
                    <Link to='/' className='flex text-primary gap-2 items-center'>
                        <ChevronLeft className='' />
                        <h2 className="text-xl font-bold ">Media</h2>
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5 ml-8">{mediaLen} Files</p>
                </div>
                <MediaView viewStyle={viewStyle} setViewStyle={setViewStyle} />

            </div>
            <div className='w-full border-b border-zinc-100  px-5'>
                <div className='flex gap-1'>
                    {['photos', 'videos', 'documents', 'links'].map((item) =>
                        <div key={item} className={`flex ${mediaType === item ? 'bg-primary text-white' : 'bg-primary/20 hover:bg-primary/30 text-primary'} text-xs px-5 py-2 rounded-t-md cursor-pointer`} onClick={() => setMediaType(item)}>
                            <h2>{item.charAt(0).toUpperCase() + item.slice(1)}</h2>
                        </div>
                    )}
                </div>
            </div>

            <div className='w-full min-h-0 h-[85%] overflow-hidden flex items-center justify-center '>
                {media[mediaType]?.length <= 0
                    ? <NoMedia item={items[mediaType]} />
                    : <div className='w-full h-full relative'>
                        <div className='w-full h-full overflow-y-auto  scroll-smooth'>
                            <Gallery data={media[mediaType]} mediaType={mediaType} setCurrentMedia={setCurrentMedia} viewStyle={viewStyle} setViewStyle={setViewStyle} />
                        </div>
                        <div className={`w-full absolute inset-0 z-100 backdrop-blur-sm overflow-hidden grid place-items-center select-none ${currentMedia ? '' : 'hidden'}`}>
                            <div className='w-5/6 bg-white rounded-xl flex justify-start items-center flex-col p-5 relative'>
                                <div className='flex justify-end items-center w-full text-primary'>
                                    <X className='w-10 h-10 p-2 cursor-pointer bg-primary/20 hover:bg-primary/30 rounded-md z-10 relative' onClick={() => setCurrentMedia(null)} />
                                </div>
                                <div className='w-fit h-[500px] rounded-md overflow-hidden'>
                                    {
                                        mediaType === 'photos' &&
                                        <img src={media[mediaType][currentMedia]} alt="img" className='w-full h-full object-contain rounded-md' loading='lazy' />
                                    }
                                    {mediaType === 'videos' &&
                                        <video controls className='w-full h-[90%] rouded-md' loading='lazy'>
                                            <source src={currentMedia} />
                                        </video>
                                    }
                                </div>
                                <div className='flex items-center absolute bottom-5 right-5 gap-3 text-primary bg-white rounded-md'>
                                    <div className='p-2 bg-primary/20 hover:bg-primary/30 rounded-md cursor-pointer'>
                                        <Share2 />
                                    </div>
                                    <div className='p-2 bg-primary/20 hover:bg-primary/30 rounded-md cursor-pointer' onClick={() => handleDownload(media[mediaType][currentMedia])}>
                                        <Download />
                                    </div>
                                </div>
                                <div className='w-full h-full absolute inset-0 flex items-center justify-between px-10 text-primary z-10'>
                                    <div className='bg-primary/20 p-2 rounded-full flex items-center justify-center hover:bg-primary/30 hover:scale-110 transition-all cursor-pointer' onClick={() => setCurrentMedia(prev => prev === 0 ? media.photos.length - 1 : prev - 1)}>
                                        <ChevronLeft />
                                    </div>
                                    <div className='bg-primary/20 p-2 rounded-full flex items-center justify-center hover:bg-primary/30 hover:scale-110 transition-all cursor-pointer' onClick={() => setCurrentMedia(prev => prev === media.photos.length - 1 ? 0 : prev + 1)}>
                                        <ChevronRight />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                }


            </div>
        </div>
    )
}
export default Media



