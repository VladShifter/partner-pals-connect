import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Calendar, 
  Eye, 
  UserCheck, 
  UserX, 
  Clock,
  Building,
  User,
  Globe,
  TrendingUp,
  Mail,
  Phone
} from "lucide-react";

interface PartnerApplication {
  id: string;
  email: string;
  name: string;
  phone?: string;
  company_name?: string;
  partner_roles: string[];
  entity_type: string;
  industry?: string;
  experience_years?: number;
  team_size?: number;
  revenue_goals?: number;
  marketing_channels: string[];
  why_interested?: string;
  status: string;
  status_updated_at: string;
  created_at: string;
  product_id: string;
  vendor_notes?: string;
  communication_preference: string;
  scheduled_call_date?: string;
  products?: {
    name: string;
  };
}

interface PartnerApplicationsProps {
  vendorId: string;
}

const statusColors = {
  submitted: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  in_discussion: 'bg-purple-100 text-purple-800'
};

const statusLabels = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  in_discussion: 'In Discussion'
};

export const PartnerApplications: React.FC<PartnerApplicationsProps> = ({ vendorId }) => {
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<PartnerApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vendorNotes, setVendorNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, [vendorId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      // Get products for this vendor first
      const { data: vendorProducts, error: productsError } = await supabase
        .from('products')
        .select('id')
        .eq('vendor_id', vendorId);

      if (productsError) throw productsError;

      if (!vendorProducts || vendorProducts.length === 0) {
        setApplications([]);
        return;
      }

      const productIds = vendorProducts.map(p => p.id);

      // Get applications for these products
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('partner_applications')
        .select(`
          *,
          products!inner(name)
        `)
        .in('product_id', productIds)
        .order('created_at', { ascending: false });

      if (applicationsError) throw applicationsError;

      setApplications(applicationsData || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string, notes?: string) => {
    try {
      const updateData: any = { status };
      if (notes) updateData.vendor_notes = notes;

      const { error } = await supabase
        .from('partner_applications')
        .update(updateData)
        .eq('id', applicationId);

      if (error) throw error;

      // Create notification for the partner
      if (status === 'approved' || status === 'rejected') {
        const application = applications.find(app => app.id === applicationId);
        if (application) {
          await supabase.rpc('create_notification', {
            target_user_id: application.email, // Will need to get user_id properly
            notification_type: 'application_status',
            notification_title: `Application ${status}`,
            notification_message: `Your partnership application has been ${status}.`,
            notification_data: { application_id: applicationId, status }
          });
        }
      }

      fetchApplications();
      toast({
        title: "Success",
        description: `Application ${status} successfully`,
      });
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive"
      });
    }
  };

  const startChat = async (application: PartnerApplication) => {
    try {
      // Create or find existing chat
      const { data: existingChat } = await supabase
        .from('partner_chats')
        .select('*')
        .eq('application_id', application.id)
        .eq('vendor_id', vendorId)
        .single();

      if (existingChat) {
        // Navigate to existing chat
        window.location.href = `/chat/${existingChat.thread_id}`;
      } else {
        // Create new chat
        const threadId = `thread-${application.id}-${Date.now()}`;
        
        const { error } = await supabase
          .from('partner_chats')
          .insert({
            application_id: application.id,
            vendor_id: vendorId,
            partner_id: application.email, // Will need proper user_id
            thread_id: threadId
          });

        if (error) throw error;

        // Navigate to new chat
        window.location.href = `/chat/${threadId}`;
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      toast({
        title: "Error",
        description: "Failed to start chat",
        variant: "destructive"
      });
    }
  };

  const filteredApplications = applications.filter(app => 
    statusFilter === 'all' || app.status === statusFilter
  );

  const getPartnerTypeIcon = (roles: string[]) => {
    if (roles.includes('reseller')) return '🤝';
    if (roles.includes('white_label')) return '🏷️';
    if (roles.includes('affiliate')) return '📈';
    return '👥';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Partner Applications</h2>
          <p className="text-sm text-gray-600">{filteredApplications.length} applications</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Applications</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="in_discussion">In Discussion</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                    {application.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{application.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{getPartnerTypeIcon(application.partner_roles)}</span>
                      <span>{application.partner_roles.join(', ')}</span>
                    </div>
                    {application.company_name && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                        <Building className="w-4 h-4" />
                        <span>{application.company_name}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={statusColors[application.status as keyof typeof statusColors]}>
                    {statusLabels[application.status as keyof typeof statusLabels]}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(application.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>{application.email}</span>
                </div>
                {application.industry && (
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{application.industry}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <span>{application.products?.name}</span>
                </div>
              </div>

              {application.why_interested && (
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  "{application.why_interested}"
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Application Details</DialogTitle>
                        <DialogDescription>
                          Complete information for {application.name}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedApplication && (
                        <Tabs defaultValue="details" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="actions">Actions</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="details" className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <strong>Entity Type:</strong> {selectedApplication.entity_type}
                              </div>
                              <div>
                                <strong>Experience:</strong> {selectedApplication.experience_years || 'N/A'} years
                              </div>
                              <div>
                                <strong>Team Size:</strong> {selectedApplication.team_size || 'N/A'}
                              </div>
                              <div>
                                <strong>Revenue Goals:</strong> ${selectedApplication.revenue_goals || 'N/A'}
                              </div>
                            </div>
                            
                            <div>
                              <strong>Marketing Channels:</strong>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {selectedApplication.marketing_channels.map((channel, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {channel}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            {selectedApplication.why_interested && (
                              <div>
                                <strong>Why Interested:</strong>
                                <p className="mt-1 text-gray-700">{selectedApplication.why_interested}</p>
                              </div>
                            )}
                          </TabsContent>
                          
                          <TabsContent value="actions" className="space-y-4 mt-4">
                            <div>
                              <label className="text-sm font-medium">Vendor Notes</label>
                              <Textarea
                                value={vendorNotes}
                                onChange={(e) => setVendorNotes(e.target.value)}
                                placeholder="Add notes about this application..."
                                className="mt-2"
                              />
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button 
                                onClick={() => updateApplicationStatus(selectedApplication.id, 'approved', vendorNotes)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <UserCheck className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                variant="destructive"
                                onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected', vendorNotes)}
                              >
                                <UserX className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={() => updateApplicationStatus(selectedApplication.id, 'under_review', vendorNotes)}
                              >
                                <Clock className="w-4 h-4 mr-1" />
                                Under Review
                              </Button>
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    onClick={() => startChat(application)}
                    disabled={application.status === 'rejected'}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Start Chat
                  </Button>
                </div>
                
                {application.status === 'submitted' && (
                  <div className="flex space-x-1">
                    <Button 
                      size="sm"
                      onClick={() => updateApplicationStatus(application.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <UserCheck className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={() => updateApplicationStatus(application.id, 'rejected')}
                    >
                      <UserX className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">
            {statusFilter === 'all' 
              ? "You haven't received any partnership applications yet." 
              : `No applications with status "${statusFilter}".`}
          </p>
        </div>
      )}
    </div>
  );
};