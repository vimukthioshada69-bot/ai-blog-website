import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
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
  return <AdminShell>{children}</AdminShell>;
}
