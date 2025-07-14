import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, Package, UserCheck, Tags } from 'lucide-react';

interface Stats {
  pendingVendors: number;
  pendingPartners: number;
  pendingProducts: number;
  pendingApplications: number;
  totalTags: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    pendingVendors: 0,
    pendingPartners: 0,
    pendingProducts: 0,
    pendingApplications: 0,
    totalTags: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: pendingVendors },
          { count: pendingPartners },
          { count: pendingProducts },
          { count: pendingApplications },
          { count: totalTags }
        ] = await Promise.all([
          supabase.from('vendors').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('partners').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('partnership_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('tags').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          pendingVendors: pendingVendors || 0,
          pendingPartners: pendingPartners || 0,
          pendingProducts: pendingProducts || 0,
          pendingApplications: pendingApplications || 0,
          totalTags: totalTags || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Pending Vendors',
      value: stats.pendingVendors,
      description: 'Vendor profiles awaiting approval',
      icon: Users,
      href: '/admin/vendors'
    },
    {
      title: 'Pending Partners',
      value: stats.pendingPartners,
      description: 'Partner accounts awaiting approval',
      icon: UserCheck,
      href: '/admin/partners'
    },
    {
      title: 'Pending Products',
      value: stats.pendingProducts,
      description: 'Products awaiting approval',
      icon: Package,
      href: '/admin/vendors'
    },
    {
      title: 'Pending Applications',
      value: stats.pendingApplications,
      description: 'Partnership requests to review',
      icon: UserCheck,
      href: '/admin/applications'
    },
    {
      title: 'Total Tags',
      value: stats.totalTags,
      description: 'Global tags in the system',
      icon: Tags,
      href: '/admin/tags'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Overview</h1>
        <p className="text-muted-foreground">
          At-a-glance statistics for the Rezollo platform
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.title} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}