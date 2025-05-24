"use client";

import { ReactNode } from 'react';
import DashboardSidebar from './DashboardSidebar';
import AIChat from './AIChat';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="md:ml-72">
        <main className="p-6">{children}</main>
      </div>
      
      {/* AI Chat Component */}
      <AIChat />
    </div>
  );
}
