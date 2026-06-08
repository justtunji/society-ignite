import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Users, Image, Calendar, BookOpen, Handshake, FileText, MessageSquare, UserPlus, Mail, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatCard {
  label: string;
  count: number;
  icon: any;
  path: string;
}

interface MembershipStats {
  total: number;
  verified: number;
  mailchimpSynced: number;
  byCategory: Record<string, number>;
  recentMembers: { name: string; email: string; category: string | null; joined_at: string | null }[];
}

const Dashboard = () => {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [membershipStats, setMembershipStats] = useState<MembershipStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const tables = [
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

    const fetchMembershipStats = async () => {
      const [
        { count: total },
        { count: verified },
        { count: mailchimpSynced },
        { data: allMembers },
        { data: recentMembers },
      ] = await Promise.all([
        supabase.from('members').select('*', { count: 'exact', head: true }),
        supabase.from('members').select('*', { count: 'exact', head: true }).eq('is_verified', true),
        supabase.from('members').select('*', { count: 'exact', head: true }).eq('mailerlite_subscribed', true),
        supabase.from('members').select('category'),
        supabase.from('members').select('name, email, category, joined_at').order('joined_at', { ascending: false }).limit(5),
      ]);

      const byCategory: Record<string, number> = {};
      allMembers?.forEach((m) => {
        const cat = m.category || 'Uncategorized';
        byCategory[cat] = (byCategory[cat] || 0) + 1;
      });

      setMembershipStats({
        total: total || 0,
        verified: verified || 0,
        mailchimpSynced: mailchimpSynced || 0,
        byCategory,
        recentMembers: recentMembers || [],
      });
    };

    fetchStats();
    fetchMembershipStats();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* General Stats */}
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

      {/* Membership & Mailchimp Section */}
      {membershipStats && (
        <>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Membership & Mailchimp Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Members</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{membershipStats.total}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Verified Members</CardTitle>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{membershipStats.verified}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {membershipStats.total > 0 ? Math.round((membershipStats.verified / membershipStats.total) * 100) : 0}% verified
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Mailchimp Synced</CardTitle>
                <Mail className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{membershipStats.mailchimpSynced}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {membershipStats.total > 0 ? Math.round((membershipStats.mailchimpSynced / membershipStats.total) * 100) : 0}% synced
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* By Category */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Members by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(membershipStats.byCategory).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No members yet</p>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(membershipStats.byCategory)
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, count]) => (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm">{category}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Members */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Recent Members</CardTitle>
              </CardHeader>
              <CardContent>
                {membershipStats.recentMembers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No members yet</p>
                ) : (
                  <div className="space-y-3">
                    {membershipStats.recentMembers.map((member, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-muted-foreground text-xs">{member.email}</p>
                        </div>
                        {member.category && (
                          <Badge variant="outline" className="text-xs">{member.category}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
