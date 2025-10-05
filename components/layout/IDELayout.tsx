'use client';

import { ReactNode } from 'react';
import { TopBar } from './TopBar';

interface IDELayoutProps {
  children: ReactNode;
}

export function IDELayout({ children }: IDELayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-black">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>
  );
}
