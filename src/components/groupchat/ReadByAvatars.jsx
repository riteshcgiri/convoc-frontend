const ReadByAvatars = ({ readBy, currentUserId, chatUsers }) => {
  const readers = readBy?.filter(
    id => id?.toString() !== currentUserId?.toString()
  ) || [];

  if (readers.length === 0) return null;

  const readerUsers = readers.map(readerId => chatUsers.find(u => u._id?.toString() === readerId?.toString())).filter(Boolean);

  return (
    <div className="flex items-center gap-1">
      {readerUsers.map(u => (
        <div key={u._id} className="relative group/avatar">
          {/* Avatar */}
          {u.avatar ? (
            <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover ring-1 ring-white cursor-pointer" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-primary/40 flex items-center justify-center text-[8px] text-white ring-1 ring-white cursor-pointer">
              {u.name?.[0]}
            </div>
          )}

          {/* ✅ Tooltip — larger hit area, shows above */}
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-50 opacity-0 group-hover/avatar:opacity-100  transition-opacity duration-150 pointer-events-none">
            <div className="bg-zinc-800 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap">{u.name}</div>
            <div className="w-2 h-2 bg-zinc-800 rotate-45 mx-auto -mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReadByAvatars