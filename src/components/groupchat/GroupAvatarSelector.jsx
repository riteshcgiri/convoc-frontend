import React, { useState, useRef, useEffect } from 'react'
import { LoaderCircle, X, Upload, Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import useNotificationStore from '../../store/notification.store'
import { wordPrettier } from '../../utils/wordPrettier'
import { fetchUnsplashImages } from '../../utils/getRandomAvatar'



const GroupAvatarSelector = ({ setSelectedAvatar, setShowAvatarPopup, cardClass='' }) => {

    const { register, watch } = useForm()
    const [loading, setLoading] = useState(false)
    const [avatarResults, setAvatarResults] = useState([])
    const searchTimeout = useRef(null);
    const { addNotification } = useNotificationStore()
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (searchQuery?.trim().length <= 2 || !searchQuery) {
            setAvatarResults([]);
            // addNotification('info', 'Please Enter atleat 1 word')
            return;
        }
        setLoading(true)
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(async () => {
            try {
                const res = await fetchUnsplashImages(searchQuery, 8);
                setAvatarResults(res ?? []);
                console.log(avatarResults)

            } catch (error) {
                setLoading(false)
                addNotification('error', error || 'Failed to fetch imgs')
                setAvatarResults([]);
            } finally {
                setLoading(false)

            }
        }, 500)
        // setLoading(true);



    }, [searchQuery])

    const handleSelectImg = (img) => {
        setSelectedAvatar(img)
        addNotification('sucess', 'Avatar Selected')
        setTimeout(() => {
            setShowAvatarPopup(false);
            
        }, 2000);
    }

    return (
        <div className='w-full h-full backdrop-blur-md absolute z-10 top-1/2 left-1/2 -translate-1/2'>
            <div className={`w-2/4 shadow-2xl rounded-lg bg-white absolute top-1/2 left-1/2 -translate-1/2 p-5 ${cardClass}`}>
                <div className='flex justify-end'>
                    <X className='w-5 h-5 text-zinc-400 cursor-pointer' strokeWidth={1.1} onClick={() => setShowAvatarPopup(false)} />
                </div>
                <div className='flex items-center justify-center text-lg font-medium text-primary'>
                    <h2>Upload Group Avatar</h2>
                </div>
                <div className='mt-5 flex flex-col gap-5'>
                    <div className='w-3/5 mx-auto ' >
                        <label htmlFor="groupAvatar" className='w-full py-4 flex items-center  gap-3 ring-[1.5px] text-zinc-300 justify-center rounded-md cursor-not-allowed' title='currently Unavailable'>
                            <Upload className='w-10 h-10' strokeWidth={1.1} />
                            <div>
                                <h2 className='tex-sm'>Upload Avatar</h2>
                                <h3 className='text-xs font-extralight'>Supported Files : JPG, PNG, GIF</h3>
                            </div>
                        </label>
                        <input type="file" className='hidden' {...register} id='groupAvatar' accept="image/jpeg,image/png,image/webp,image/gif,.jpeg,.png,.webp,.gif" disabled />
                    </div>
                    <div className='w-4/5 mx-auto flex items-center justify-center gap-5 text-zinc-400 my-2'>
                        <span className='w-full border-b border-zinc-300'></span>
                        <span>OR</span>
                        <span className='w-full border-b border-zinc-300'></span>
                    </div>
                    <div className='w-3/5 mx-auto flex flex-col gap-2 justify-center mb-5'>
                        <div className="relative w-full">
                            <label htmlFor="groupAvatar" className="select-none rounded-md absolute -top-2 font-semibold tracking-wide left-4 bg-white px-2 text-sm text-primary z-10">
                                {wordPrettier("Search Avatar")}
                            </label>
                            <div className="w-full flex items-center px-4 border-2 rounded-xl border-primary bg-white focus-within:bg-primary/15 transition-colors duration-200">
                                <div className="mr-2 text-primary/50">
                                    <Search size={16} />
                                </div>
                                <input type="text" id="groupAvatar" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} name="members" className="w-full py-4 outline-none transition text-primary font-semibold bg-transparent" placeholder="Search Users..." autoComplete="off" autoCapitalize="off" />

                                {searchQuery && (
                                    <button key="clear" onClick={() => setSearchQuery("")} className="ml-2 text-primary/40 hover:text-primary transition-colors" type="button">
                                        <X size={16} />
                                    </button>
                                )}

                            </div>
                        </div>
                        {avatarResults.length > 0 && <div>
                            <h2 className='text-xs text-zinc-400 '>Select Image</h2>
                            <div className='flex flex-wrap justify-evenly gap-2' >
                                {avatarResults?.map(img => (
                                    <div key={img?.id} className='flex w-16 h-16 cursor-pointer hover:scale-200 transition-all duration-100' onClick={() => handleSelectImg(img?.urls?.small)}>
                                        <img src={img?.urls?.small} alt="" className='w-full h-full object-cover rounded-md' />
                                    </div>
                                ))}
                            </div>

                        </div>}
                        {
                            loading && <div className='flex items-center justify-center p-2'>
                                <LoaderCircle className='animate-spin text-primary' />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupAvatarSelector