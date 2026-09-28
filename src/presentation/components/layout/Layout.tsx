import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';
import { ToastContainer } from '../ui';
import AppErrorBoundary from '../feedback/AppErrorBoundary';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full bg-[#F4F6F8]">
      {/* Sidebar — all roles see it on md+ screens; CSS breakpoint controls visibility, not role */}
      <div className="hidden md:block flex-shrink-0 h-full overflow-hidden">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto siga-main-safe">
          <AppErrorBoundary>{children}</AppErrorBoundary>
        </main>
      </div>

      <MobileNav />
      <ToastContainer />
    </div>
  );
}
