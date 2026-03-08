import { Shield, MicOff, MessageSquare, Activity, User, UserMinus, ShieldOff, } from 'lucide-react'
import useChatStore from '../../store/chat.store';


const MemberPopup = ({ member, currentUser, isCurrentUserAdmin, selectedChat, onClose }) => {
    const isMemberAdmin = selectedChat?.userSettings?.find(
        s => s.user?._id === member._id || s.user === member._id
    )?.isAdmin;

    // Build options based on roles
    const adminOnMemberOptions = [
        { title: "Make Admin", icon: <Shield className='w-5 h-5' />, fnc: () => handleMakeAdmin() },
        { title: "Mute Member", icon: <MicOff className='w-5 h-5' />, fnc: () => handleMute() },
        { title: "Send Message", icon: <MessageSquare className='w-5 h-5' />, fnc: () => handleDM() },
        { title: "User Activity", icon: <Activity className='w-5 h-5' />, fnc: () => { } }, // frontend only for now
        { title: "View Profile", icon: <User className='w-5 h-5' />, fnc: () => { } },
        { title: "Remove from Group", icon: <UserMinus className='w-5 h-5' />, fnc: () => handleRemove(), danger: true },
    ];

    const adminOnAdminOptions = [
        { title: "Remove Admin", icon: <ShieldOff className='w-5 h-5' />, fnc: () => handleDismissAdmin() },
        { title: "Send Message", icon: <MessageSquare className='w-5 h-5' />, fnc: () => handleDM() },
        { title: "User Activity", icon: <Activity className='w-5 h-5' />, fnc: () => { } },
        { title: "View Profile", icon: <User className='w-5 h-5' />, fnc: () => { } },
        { title: "Remove from Group", icon: <UserMinus className='w-5 h-5' />, fnc: () => handleRemove(), danger: true },
    ];

    const memberOptions = [
        { title: "View Profile", icon: <User className='w-5 h-5' />, fnc: () => { } },
        { title: "Send Message", icon: <MessageSquare className='w-5 h-5' />, fnc: () => handleDM() },
    ];

    const options = !isCurrentUserAdmin ? memberOptions : isMemberAdmin ? adminOnAdminOptions : adminOnMemberOptions;

    const handleMakeAdmin = async () => {
        await useChatStore.getState().makeAdmin(selectedChat._id, member._id);
        onClose();
    };

    const handleDismissAdmin = async () => {
        await useChatStore.getState().dismissAdmin(selectedChat._id, member._id);
        onClose();
    };

    const handleRemove = async () => {
        await useChatStore.getState().removeGroupMember(selectedChat._id, member._id);
        onClose();
    };

    const handleDM = async () => {
        const chat = await useChatStore.getState().startChat(member._id);
        useChatStore.getState().selectChat(chat);
        onClose();
    };

    const handleMute = async () => {
        // call muteMember store action
        onClose();
    };

    return (
        <div className="absolute right-0 z-100 bg-white shadow-xl rounded-xl border border-zinc-100 w-52 overflow-hidden">
            {/* Member info header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100">
                <div className='w-8 h-8'>
                    {member.avatar.trim() ?
                        <img src={member.avatar || "/avatar.png"}  draggable={false} className="w-full h-full rounded-full object-cover" />
                        :
                        <div className='w-full h-full flex items-center justify-center bg-blue-100 rounded-full p-1'>
                            <User className='text-blue-400' />
                        </div>
                    }
                </div>
                <div>
                    <h2 className="text-sm text-primary font-medium">{member.name}</h2>
                    <p className="text-[10px] text-zinc-400">{isMemberAdmin ? "👑 Admin" : "Member"}</p>
                </div>
            </div>
            {/* Options */}
            {options.map(opt => (
                <div key={opt.title} onClick={opt.fnc}
                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer text-xs transition-all
            ${opt.danger ? "text-red-500 hover:bg-red-50" : "text-primary hover:bg-primary/10"}`}>
                    {opt.icon}
                    {opt.title}
                </div>
            ))}
        </div>
    );
};

export default MemberPopup;