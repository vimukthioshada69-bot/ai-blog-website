'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  FolderTree, 
  Tag as TagIcon, 
  Users, 
  Image as ImageIcon, 
  Settings, 
  Compass,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  isAction?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Articles', href: '/admin/articles', icon: FileText },
  { label: 'Create Article', href: '/admin/articles/new', icon: PlusCircle, isAction: true },
  { label: 'Comments', href: '/admin/comments', icon: MessageSquare },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Tags', href: '/admin/tags', icon: TagIcon },
  { label: 'Authors', href: '/admin/authors', icon: Users },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { label: 'Site Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="p-4 space-y-1">
      <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
        Editorial Management
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isItemActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
              active
                ? 'font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 shadow-2xs'
                : 'font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Icon
                className={`w-4 h-4 transition-colors ${
                  active ? 'text-indigo-600' : 'text-slate-400'
                }`}
              />
              <span>{item.label}</span>
            </div>

            {active && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            )}
          </Link>
        );
      })}

      <div className="pt-4 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
        Live Publication
      </div>

      <Link
        href="/"
        target="_blank"
        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
      >
        <span className="flex items-center gap-2.5">
          <Compass className="w-4 h-4 text-slate-400" />
          <span>View Live Blog</span>
        </span>
        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
      </Link>
    </nav>
  );
}
