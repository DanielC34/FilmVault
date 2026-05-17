
import React from 'react';

const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
);

export const MovieCardSkeleton = () => (
  <div className="flex flex-col gap-3 group">
    <div className="aspect-[2/3] w-full rounded-2xl bg-[#1a2128] border border-white/5 relative overflow-hidden">
      <Shimmer />
    </div>
    <div className="px-1 space-y-2">
      <div className="h-3 bg-[#1a2128] rounded-full w-4/5 relative overflow-hidden">
        <Shimmer />
      </div>
      <div className="h-2 bg-[#1a2128] rounded-full w-2/5 relative overflow-hidden">
        <Shimmer />
      </div>
    </div>
  </div>
);

export const VaultCardSkeleton = () => (
  <div className="w-full flex items-center justify-between p-6 rounded-[24px] bg-[#1a2128] border border-white/5 relative overflow-hidden">
    <Shimmer />
    <div className="flex items-center gap-5 relative z-10">
      <div className="w-14 h-14 bg-[#14181c] rounded-2xl relative overflow-hidden">
        <Shimmer />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-[#2c343c]/50 rounded-full w-32 relative overflow-hidden">
          <Shimmer />
        </div>
        <div className="h-2 bg-[#2c343c]/50 rounded-full w-20 relative overflow-hidden">
          <Shimmer />
        </div>
      </div>
    </div>
    <div className="w-5 h-5 bg-[#2c343c]/50 rounded-full relative overflow-hidden">
      <Shimmer />
    </div>
  </div>
);

export const MovieDetailSkeleton = () => (
  <div className="space-y-8">
    <div className="flex gap-6 items-end">
      <div className="w-32 aspect-[2/3] rounded-xl bg-[#1a2128] border border-white/5 flex-shrink-0 relative overflow-hidden">
        <Shimmer />
      </div>
      <div className="flex-1 space-y-4 pb-2">
        <div className="h-10 bg-[#1a2128] rounded-xl w-3/4 relative overflow-hidden">
          <Shimmer />
        </div>
        <div className="h-3 bg-[#1a2128] rounded-full w-1/2 relative overflow-hidden">
          <Shimmer />
        </div>
      </div>
    </div>
    
    <div className="bg-[#1a2128] border border-white/5 rounded-3xl p-6 space-y-4 relative overflow-hidden">
      <Shimmer />
      <div className="h-2 bg-[#2c343c]/50 rounded-full w-24" />
      <div className="space-y-2">
        <div className="h-4 bg-[#2c343c]/50 rounded-full w-full" />
        <div className="h-4 bg-[#2c343c]/50 rounded-full w-11/12" />
        <div className="h-4 bg-[#2c343c]/50 rounded-full w-4/5" />
      </div>
    </div>

    <div className="space-y-4">
      <div className="h-2 bg-[#1a2128] rounded-full w-20 relative overflow-hidden">
        <Shimmer />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-14 bg-[#1a2128] rounded-2xl border border-white/5 relative overflow-hidden">
            <Shimmer />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <div className="pt-12 flex flex-col items-center space-y-6">
      <div className="w-32 h-32 rounded-full bg-[#1a2128] border-4 border-white/5 relative overflow-hidden">
        <Shimmer />
      </div>
      <div className="space-y-3 flex flex-col items-center">
        <div className="h-8 bg-[#1a2128] rounded-xl w-48 relative overflow-hidden">
          <Shimmer />
        </div>
        <div className="h-3 bg-[#1a2128] rounded-full w-32 relative overflow-hidden">
          <Shimmer />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="h-24 bg-[#1a2128] rounded-3xl border border-white/5 relative overflow-hidden">
        <Shimmer />
      </div>
      <div className="h-24 bg-[#1a2128] rounded-3xl border border-white/5 relative overflow-hidden">
        <Shimmer />
      </div>
    </div>

    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-16 bg-[#1a2128] rounded-2xl border border-white/5 relative overflow-hidden">
          <Shimmer />
        </div>
      ))}
    </div>
  </div>
);
