import { useEffect } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Settings, Users, Image, Calendar, BookOpen, Megaphone, FileText,
  LayoutDashboard, LogOut, Navigation, Handshake, MessageSquare, Menu, X, UserPlus,
  FileStack, Layers, FolderOpen, CloudUpload, Shield
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import sbaLogo from '@/assets/logos/sba-logo.png';
import { AdminErrorReport } from '@/components/admin/AdminErrorReport';

type NavItem = { label: string; path: string; icon: any; adminOnly?: boolean };
const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Site Settings', path: '/admin/site-settings', icon: Settings, adminOnly: true },
  { label: 'Team Access', path: '/admin/users', icon: Shield, adminOnly: true },
  { label: 'Navigation', path: '/admin/navigation', icon: Navigation },
  { label: 'Pages', path: '/admin/pages', icon: FileStack },
  { label: 'Sections', path: '/admin/sections', icon: Layers },
  { label: 'Media Library', path: '/admin/media', icon: FolderOpen },
  { label: 'Cloudinary Migration', path: '/admin/cloudinary', icon: CloudUpload, adminOnly: true },
  { label: 'Partners', path: '/admin/partners', icon: Handshake },
  { label: 'Team Members', path: '/admin/team', icon: Users },
  { label: 'Gallery', path: '/admin/gallery', icon: Image },
  { label: 'Events', path: '/admin/events', icon: Calendar },
  { label: 'Programs', path: '/admin/programs', icon: BookOpen },
  { label: 'Promotions', path: '/admin/promotions', icon: Megaphone },
  { label: 'Resources', path: '/admin/resources', icon: FileText },
  { label: 'Stories', path: '/admin/stories', icon: MessageSquare },
  { label: 'Communities', path: '/admin/communities', icon: Users },
  { label: 'Members', path: '/admin/members', icon: UserPlus, adminOnly: true },
  { label: 'Contact Submissions', path: '/admin/contacts', icon: MessageSquare, adminOnly: true },
];

const AdminLayout = () => {
  const { user, isAdmin, isStaff, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isStaff)) {
      navigate('/admin/login');
    }
  }, [user, isStaff, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }

  if (!user || !isStaff) return null;

  const visibleNav = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border transform transition-transform lg:translate-x-0 lg:static lg:inset-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2">
              <img src={sbaLogo} alt="SBA" className="h-8 w-auto" />
              <span className="font-bold text-sm">CMS</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X size={20} /></button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {visibleNav.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-3 border-t border-border space-y-2">
            <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground px-3 py-2">
              ← View Website
            </Link>
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={signOut}>
              <LogOut size={18} className="mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-background border-b border-border px-4 py-3 flex items-center gap-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu size={24} />
          </button>
          <div className="flex-1" />
          <AdminErrorReport />
          <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
