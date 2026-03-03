'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/design-system');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0a1a]">
      <p className="text-white/60 text-sm">Loading Design System...</p>
    </div>
  );
}
