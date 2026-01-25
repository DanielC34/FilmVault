
import React from 'react';

export const MovieCardSkeleton = () => (
  <div className="flex flex-col gap-2 animate-pulse">
    <div className="aspect-[2/3] w-full rounded-lg bg-[#2c343c]" />
    <div className="px-0.5 space-y-1.5">
      <div className="h-3 bg-[#2c343c] rounded w-3/4" />
      <div className="h-2 bg-[#2c343c] rounded w-1/4" />
    </div>
  </div>
);

export const VaultCardSkeleton = () => (
  <div className="w-full flex items-center justify-between p-6 rounded-[24px] bg-[#1a2128] border border-white/5 animate-pulse">
    <div className="flex items-center gap-5">
      <div className="w-14 h-14 bg-[#14181c] rounded-2xl" />
      <div className="space-y-2">
        <div className="h-4 bg-[#2c343c] rounded w-32" />
        <div className="h-2 bg-[#2c343c] rounded w-20" />
      </div>
    </div>
    <div className="w-5 h-5 bg-[#2c343c] rounded-full" />
  </div>
);

export const MovieDetailSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="flex gap-6 items-end">
      <div className="w-32 aspect-[2/3] rounded-xl bg-[#2c343c] flex-shrink-0" />
      <div className="flex-1 space-y-3 pb-2">
        <div className="h-8 bg-[#2c343c] rounded w-3/4" />
        <div className="h-3 bg-[#2c343c] rounded w-1/2" />
      </div>
    </div>
    <div className="bg-[#1a2128] border border-white/5 rounded-2xl p-5 space-y-3">
      <div className="h-2 bg-[#2c343c] rounded w-24" />
      <div className="h-4 bg-[#2c343c] rounded w-full" />
      <div className="h-4 bg-[#2c343c] rounded w-5/6" />
    </div>
    <div className="space-y-4">
      <div className="h-2 bg-[#2c343c] rounded w-20" />
      <div className="space-y-2">
        <div className="h-3 bg-[#2c343c] rounded w-full" />
        <div className="h-3 bg-[#2c343c] rounded w-full" />
        <div className="h-3 bg-[#2c343c] rounded w-2/3" />
      </div>
    </div>
  </div>
);
