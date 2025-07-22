
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApplicationProfile from '@/components/partner/ApplicationProfile';
import { 
  User,
  Building,
  MessageSquare,
  TrendingUp,
  Users,
  CheckCircle,
  FileText,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PartnerDashboard = () => {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  // Fetch partner applications
  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ['partner-applications', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return [];
      
      const { data, error } = await supabase
        .from('partner_applications')
        .select(`
          *,
          products!inner(
            id,
            name,
            vendor_id,
            vendors!inner(
              company_name
            )
          )
        `)
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!currentUser?.id,
  });

  // Get the most recent completed application for profile display
  const profileApplication = applications?.find(app => 
    app.status === 'submitted' || app.status === 'approved' || app.status === 'under_review'
  );

  // Mock performance data (in real app, this would come from actual sales data)
  const performance = {
    total_sales: 0,
    total_commission: 0,
    active_deals: applications?.filter(app => app.status === 'approved').length || 0,
    conversion_rate: 0
  };

  const statusColors = {
    approved: 'bg-green-100 text-green-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    submitted: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    approved: 'Approved',
    under_review: 'Under Review',
    submitted: 'Submitted',
    rejected: 'Rejected'
  };

  const handleEditProfile = () => {
    // Navigate to edit profile (could be implemented later)
    toast({
      title: "Edit Profile",
      description: "Profile editing feature will be available soon.",
    });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">Please log in to view your partner dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Partner Dashboard</h1>
          <p className="text-gray-600">Manage your partnerships and track performance</p>
        </div>

        {/* Partner Info Card */}
        {profileApplication && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                  {profileApplication.name?.charAt(0) || currentUser.email?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {profileApplication.name || currentUser.email}
                  </h2>
                  {profileApplication.company_name && (
                    <p className="text-gray-600 flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      {profileApplication.company_name}
                    </p>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active Partner
                </Badge>
                {profileApplication.partner_roles && (
                  <div className="flex space-x-2">
                    {profileApplication.partner_roles.slice(0, 2).map((type: string) => (
                      <Badge key={type} variant="outline">
                        {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">${performance.total_sales.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Commission Earned</p>
                  <p className="text-2xl font-bold text-gray-900">${performance.total_commission}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Partnerships</p>
                  <p className="text-2xl font-bold text-gray-900">{performance.active_deals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{applications?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="applications" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              My Applications
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              My Profile
            </TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Partnership Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {applicationsLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Loading applications...</p>
                  </div>
                ) : applications && applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((app: any) => (
                      <div key={app.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {app.products?.name || 'Product Application'}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                              <Building className="w-4 h-4" />
                              <span>{app.products?.vendors?.company_name || 'Vendor'}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                              <span>Submitted: {new Date(app.created_at).toLocaleDateString()}</span>
                              <span>Status: {statusLabels[app.status as keyof typeof statusLabels] || app.status}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={statusColors[app.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
                              {statusLabels[app.status as keyof typeof statusLabels] || app.status}
                            </Badge>
                            {app.status === 'approved' && (
                              <Button size="sm">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Chat
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No applications yet</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Start by applying to partner with products in our marketplace
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            {profileApplication ? (
              <ApplicationProfile 
                application={profileApplication} 
                onEdit={handleEditProfile}
              />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No profile information available</p>
                    <p className="text-sm text-gray-500 mt-2 mb-4">
                      Complete your partnership profile to unlock more opportunities
                    </p>
                    <Button onClick={() => window.location.href = '/onboard/partner'}>
                      Fill Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PartnerDashboard;
