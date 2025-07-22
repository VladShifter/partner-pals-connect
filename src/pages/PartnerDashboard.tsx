import React from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User,
  Building,
  MessageSquare,
  TrendingUp,
  Users,
  CheckCircle
} from 'lucide-react';

const PartnerDashboard = () => {
  // Mock partner data for development
  const partner = {
    id: 'partner-1',
    name: 'John Smith',
    company: 'Growth Partners LLC',
    email: 'john@growthpartners.com',
    status: 'approved',
    partner_types: ['reseller', 'affiliate']
  };

  // Mock applications data
  const applications = [
    {
      id: 'app-1',
      product_name: 'CloudCRM Pro',
      vendor_company: 'TechFlow Solutions',
      status: 'approved',
      submitted_date: '2024-01-15',
      commission_rate: '25%'
    },
    {
      id: 'app-2',
      product_name: 'Analytics Dashboard',
      vendor_company: 'DataViz Corp',
      status: 'under_review',
      submitted_date: '2024-01-18',
      commission_rate: 'TBD'
    }
  ];

  // Mock performance data
  const performance = {
    total_sales: 12450,
    total_commission: 3112.50,
    active_deals: 8,
    conversion_rate: 18.5
  };

  const statusColors = {
    approved: 'bg-green-100 text-green-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    approved: 'Approved',
    under_review: 'Under Review',
    rejected: 'Rejected'
  };

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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                {partner.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{partner.name}</h2>
                <p className="text-gray-600 flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  {partner.company}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active Partner
              </Badge>
              <div className="flex space-x-2">
                {partner.partner_types.map(type => (
                  <Badge key={type} variant="outline">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

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
                  <p className="text-sm font-medium text-gray-600">Active Deals</p>
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
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{performance.conversion_rate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications */}
        <Card>
          <CardHeader>
            <CardTitle>My Partnership Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map(app => (
                <div key={app.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{app.product_name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <Building className="w-4 h-4" />
                        <span>{app.vendor_company}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                        <span>Submitted: {new Date(app.submitted_date).toLocaleDateString()}</span>
                        <span>Commission: {app.commission_rate}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={statusColors[app.status as keyof typeof statusColors]}>
                        {statusLabels[app.status as keyof typeof statusLabels]}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerDashboard;