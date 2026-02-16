import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, Image, Calendar, BookOpen, Handshake, FileText, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatCard {
  label: string;
  count: number;
  icon: any;
  path: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<StatCard[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const tables = [
        { table: 'partners', label: 'Partners', icon: Handshake, path: '/admin/partners' },
        { table: 'team_members', label: 'Team Members', icon: Users, path: '/admin/team' },
        { table: 'gallery_items', label: 'Gallery Items', icon: Image, path: '/admin/gallery' },
        { table: 'events', label: 'Events', icon: Calendar, path: '/admin/events' },
        { table: 'programs', label: 'Programs', icon: BookOpen, path: '/admin/programs' },
        { table: 'resources', label: 'Resources', icon: FileText, path: '/admin/resources' },
        { table: 'contact_submissions', label: 'Contact Submissions', icon: MessageSquare, path: '/admin/contacts' },
      ] as const;

      const results = await Promise.all(
        tables.map(async (t) => {
          const { count } = await supabase.from(t.table).select('*', { count: 'exact', head: true });
          return { label: t.label, count: count || 0, icon: t.icon, path: t.path };
        })
      );
      setStats(results);
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Link to={stat.path} key={stat.label}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.count}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
