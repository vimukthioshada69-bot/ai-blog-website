'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck, LogOut } from 'lucide-react';
import { AdminSidebarNav } from './AdminSidebarNav';
import { logoutAdmin } from '@/app/actions/authActions';

export function AdminShell({children}: {children: React.ReactNode}) {
 const pathname = usePathname();
 const [open,setOpen] = useState(false);
 useEffect(()=>setOpen(false),[pathname]);
 if (pathname === '/admin/login') return <main className="min-h-screen w-full bg-slate-100">{children}</main>;
 return <div className="min-h-screen w-full bg-slate-100 text-slate-900 md:flex">
   <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
    <Link href="/admin" className="font-bold text-indigo-700">SYNAPSE Admin</Link>
    <button type="button" aria-label={open?'Close admin menu':'Open admin menu'} aria-expanded={open} onClick={()=>setOpen(!open)} className="rounded-lg border p-2">{open?<X size={20}/>:<Menu size={20}/>}</button>
   </div>
   {open && <button type="button" aria-label="Close navigation" className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={()=>setOpen(false)}/>}
   <aside className={`${open?'translate-x-0':'-translate-x-full'} fixed inset-y-0 left-0 z-40 flex w-[min(85vw,18rem)] flex-col overflow-y-auto border-r border-slate-200 bg-white transition-transform md:sticky md:top-0 md:h-screen md:w-64 md:translate-x-0 md:shrink-0`}>
    <div className="flex items-center justify-between border-b p-5">
     <Link href="/admin" className="flex items-center gap-2 font-extrabold"><ShieldCheck className="text-indigo-600"/> SYNAPSE Admin</Link>
     <button type="button" onClick={()=>setOpen(false)} aria-label="Close menu" className="md:hidden"><X/></button>
    </div>
    <div className="flex-1"><AdminSidebarNav/></div>
    <form action={logoutAdmin} className="border-t p-4"><button className="flex w-full items-center gap-2 rounded-lg p-3 text-sm font-semibold text-rose-600 hover:bg-rose-50"><LogOut size={17}/> Sign Out</button></form>
   </aside>
   <main className="min-w-0 w-full flex-1 overflow-x-auto p-3 sm:p-6 lg:p-8"><div className="mx-auto w-full max-w-7xl min-w-0">{children}</div></main>
 </div>;
}
