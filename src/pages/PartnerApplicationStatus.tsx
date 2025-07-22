import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Calendar,
  ArrowLeft,
  Eye,
  User,
  Building
} from "lucide-react";

interface PartnerApplication {
  id: string;
  status: string;
  status_updated_at: string;
  created_at: string;
  current_step: number;
  vendor_notes?: string;
  scheduled_call_date?: string;
  products?: {
    name: string;
    vendors?: {
      company_name: string;
    };
  };
}

const statusIcons = {
  submitted: Clock,
  under_review: Eye,
  approved: CheckCircle,
  rejected: XCircle,
  in_discussion: MessageSquare
};

const statusColors = {
  submitted: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  in_discussion: 'bg-purple-100 text-purple-800'
};

const statusLabels = {
  submitted: 'Application Submitted',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Application Rejected',
  in_discussion: 'In Discussion'
};

const PartnerApplicationStatus = () => {
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Fetch applications for current user
      const { data: applicationsData, error } = await supabase
        .from('partner_applications')
        .select(`
          *,
          products(
            name,
            vendors(company_name)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApplications(applicationsData || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load your applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'submitted': return 25;
      case 'under_review': return 50;
      case 'in_discussion': return 75;
      case 'approved': return 100;
      case 'rejected': return 100;
      default: return 0;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'submitted': 
        return 'Your application has been submitted and is waiting for review.';
      case 'under_review': 
        return 'The vendor is currently reviewing your application.';
      case 'in_discussion': 
        return 'The vendor wants to discuss your application further.';
      case 'approved': 
        return 'Congratulations! Your partnership application has been approved.';
      case 'rejected': 
        return 'Unfortunately, your application was not approved at this time.';
      default: 
        return 'Application status unknown.';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/marketplace')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">My Partnership Applications</h1>
          <p className="text-gray-600">Track the status of your partnership applications</p>
        </div>

        {/* Applications */}
        <div className="space-y-6">
          {applications.map((application) => {
            const StatusIcon = statusIcons[application.status as keyof typeof statusIcons];
            
            return (
              <Card key={application.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <StatusIcon className="w-6 h-6 text-white" />
                      </div>
                      
                      <div>
                        <CardTitle className="text-lg">
                          {application.products?.name || 'Product Application'}
                        </CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                          <Building className="w-4 h-4" />
                          <span>{application.products?.vendors?.company_name || 'Vendor'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Badge className={statusColors[application.status as keyof typeof statusColors]}>
                      {statusLabels[application.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Application Progress</span>
                      <span>{getStatusProgress(application.status)}%</span>
                    </div>
                    <Progress value={getStatusProgress(application.status)} className="h-2" />
                  </div>
                  
                  {/* Status Description */}
                  <p className="text-gray-700 mb-4">
                    {getStatusDescription(application.status)}
                  </p>
                  
                  {/* Application Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <strong>Submitted:</strong> {new Date(application.created_at).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Last Updated:</strong> {new Date(application.status_updated_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Vendor Notes */}
                  {application.vendor_notes && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Vendor Notes:</h4>
                      <p className="text-gray-700">{application.vendor_notes}</p>
                    </div>
                  )}
                  
                  {/* Scheduled Call */}
                  {application.scheduled_call_date && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2 text-blue-800">
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">Scheduled Call</span>
                      </div>
                      <p className="text-blue-700 mt-1">
                        {new Date(application.scheduled_call_date).toLocaleString()}
                      </p>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex space-x-3">
                    {application.status === 'approved' && (
                      <Button onClick={() => navigate('/partner/dashboard')}>
                        <User className="w-4 h-4 mr-2" />
                        Go to Partner Dashboard
                      </Button>
                    )}
                    
                    {(application.status === 'in_discussion' || application.status === 'approved') && (
                      <Button variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Open Chat
                      </Button>
                    )}
                    
                    {application.status === 'submitted' && application.current_step < 6 && (
                      <Button variant="outline">
                        Complete Application
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {applications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-600 mb-4">
              You haven't submitted any partnership applications yet.
            </p>
            <Button onClick={() => navigate('/marketplace')}>
              Browse Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerApplicationStatus;