import Link from 'next/link';
import { 
  LogOut, 
  ShieldCheck
} from 'lucide-react';
import { logoutAdmin } from '@/app/actions/authActions';
import { AdminSidebarNav } from '@/components/admin/AdminSidebarNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-900 block leading-tight font-heading">
                  SYNAPSE
                </span>
                <span className="text-[10px] uppercase font-mono font-bold text-indigo-600 tracking-wider">
                  2026 Admin Suite
                </span>
              </div>
            </Link>
          </div>

          {/* Dynamic Navigation Links */}
          <AdminSidebarNav />
        </div>

        {/* User & Logout Footer */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/70 text-xs font-mono">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Admin Session Active
            </span>
          </div>

          <form action={logoutAdmin}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-mono"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl overflow-x-hidden">
        {children}
      </main>

    </div>
  );
}
