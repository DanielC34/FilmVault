import React from 'react';
import { useStore } from '../../store/useStore';
import { ProfileSkeleton } from '../Skeletons';
import { ICONS, TMDB_IMAGE_BASE, POSTER_SIZE } from '../../constants';

const ProfileTab: React.FC = () => {
  const { user, watchlists, watchlistCache, fetchWatchlistItems, isInitialLoading, signOut } = useStore();

  // Compute stats dynamically from the loaded watchlists in state
  const totalCount = watchlists.reduce((acc, w) => acc + (w.item_count || 0), 0);
  const watchedList = watchlists.find(w => w.title === 'Watched' || w.title === 'Already Watched');
  const watchedCount = watchedList?.item_count || 0;
  const pendingCount = Math.max(0, totalCount - watchedCount);

  // Dynamically prioritize a watchlist that contains items to show in the preview section
  const previewList = watchlists.find(w => w.title === 'Favorites' && (w.item_count || 0) > 0) ||
                      watchlists.find(w => w.title === 'Watched' && (w.item_count || 0) > 0) ||
                      watchlists.find(w => (w.item_count || 0) > 0);

  // Trigger background fetch if the preview list items aren't cached yet
  React.useEffect(() => {
    if (previewList && !watchlistCache[previewList.id]) {
      fetchWatchlistItems(previewList.id);
    }
  }, [previewList, watchlistCache, fetchWatchlistItems]);

  const previewItems = previewList ? (watchlistCache[previewList.id] || []).slice(0, 4) : [];

  if (!user || isInitialLoading) {
    return (
      <div className="px-6 pb-32">
        <ProfileSkeleton />
      </div>
    );
  }

  const joinedDate = user.createdAt 
    ? `Member since ${new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}` 
    : 'FilmVault Member';

  return (
    <div className="px-6 pb-32 animate-in fade-in duration-500">
      
      {/* 1. Profile Header Section */}
      <div className="pt-8 mb-6">
        <div className="bg-[#1a2128] border border-white/5 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left relative overflow-hidden">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#00e054] to-[#ff8000] shadow-2xl flex-shrink-0">
            <img
              src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
              className="w-full h-full rounded-full object-cover border-4 border-[#1a2128]"
              alt={user.username}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black text-white truncate">@{user.username}</h2>
            <p className="text-white/40 text-sm mt-1 truncate">{user.email}</p>
            <span className="inline-block mt-3 px-3 py-1 bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-[0.15em] rounded-full">
              {joinedDate}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Stats Section */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#1a2128] p-4 rounded-2xl border border-white/5 text-center flex flex-col justify-center shadow-lg">
          <span className="text-2xl font-black text-white">{totalCount}</span>
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1.5">
            Total Saved
          </p>
        </div>
        <div className="bg-[#1a2128] p-4 rounded-2xl border border-[#00e054]/20 text-center flex flex-col justify-center shadow-lg">
          <span className="text-2xl font-black text-[#00e054]">{watchedCount}</span>
          <p className="text-[9px] font-bold text-[#00e054]/40 uppercase tracking-widest mt-1.5">
            Watched
          </p>
        </div>
        <div className="bg-[#1a2128] p-4 rounded-2xl border border-white/5 text-center flex flex-col justify-center shadow-lg">
          <span className="text-2xl font-black text-[#ff8000]">{pendingCount}</span>
          <p className="text-[9px] font-bold text-[#ff8000]/40 uppercase tracking-widest mt-1.5">
            Pending
          </p>
        </div>
      </div>

      {/* 3. Watchlist Preview Section */}
      <div className="bg-[#1a2128] border border-white/5 p-6 rounded-3xl mb-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-white/40">
            {previewList ? `Vault Preview: ${previewList.title}` : 'Watchlist Preview'}
          </h3>
          {previewList && (
            <span className="text-[10px] font-bold text-[#00e054] bg-[#00e054]/10 px-2.5 py-0.5 rounded-full">
              {previewList.item_count} Items
            </span>
          )}
        </div>

        <div className="space-y-3">
          {previewItems.length > 0 ? (
            previewItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-[#14181c]/50 p-2.5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="w-10 h-14 rounded-lg overflow-hidden bg-[#2c343c] flex-shrink-0 shadow-md">
                  <img
                    src={
                      item.poster_path
                        ? `${TMDB_IMAGE_BASE}${POSTER_SIZE}${item.poster_path}`
                        : "https://via.placeholder.com/500x750?text=No+Poster"
                    }
                    className="w-full h-full object-cover"
                    alt={item.title}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] uppercase font-bold text-white/30 tracking-wider bg-white/5 px-1.5 py-0.5 rounded">
                      {item.media_type}
                    </span>
                    {item.is_watched ? (
                      <span className="text-[9px] font-bold text-[#00e054] uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00e054] inline-block animate-pulse"></span>
                        Watched
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-[#ff8000] uppercase tracking-widest">
                        Queue
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-white/30 text-xs italic">
              Your vaults are currently empty. Explore movies and construct list collections to preview them here.
            </div>
          )}
        </div>
      </div>

      {/* 4. Account Actions Section */}
      <div className="space-y-3">
        <button
          onClick={() => signOut()}
          className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 text-sm font-black uppercase tracking-wider active:scale-[0.98] hover:bg-red-500/20 transition-all border border-red-500/10"
        >
          Sign Out
        </button>
      </div>

    </div>
  );
};

export default ProfileTab;
