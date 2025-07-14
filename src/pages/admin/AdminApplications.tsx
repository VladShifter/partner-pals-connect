import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';

interface PartnershipRequest {
  id: string;
  subtype: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  products: {
    name: string;
  };
  partners: {
    company_name: string;
  };
}

export default function AdminApplications() {
  const [applications, setApplications] = useState<PartnershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('partnership_requests')
        .select(`
          *,
          products (name),
          partners (company_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications((data || []) as PartnershipRequest[]);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch partnership applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationIds: string[], status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('partnership_requests')
        .update({ status })
        .in('id', applicationIds);

      if (error) throw error;

      setApplications(applications.map(app => 
        applicationIds.includes(app.id) ? { ...app, status } : app
      ));

      setSelectedApplications([]);

      toast({
        title: "Success",
        description: `${applicationIds.length} application(s) ${status} successfully`
      });
    } catch (error) {
      console.error('Error updating applications:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplications(applications.filter(app => app.status === 'pending').map(app => app.id));
    } else {
      setSelectedApplications([]);
    }
  };

  const handleSelectApplication = (applicationId: string, checked: boolean) => {
    if (checked) {
      setSelectedApplications([...selectedApplications, applicationId]);
    } else {
      setSelectedApplications(selectedApplications.filter(id => id !== applicationId));
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Partnership Applications</h1>
          <p className="text-muted-foreground">
            Review and approve/reject partnership requests
          </p>
        </div>

        {selectedApplications.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="text-green-600 hover:text-green-700"
              onClick={() => updateApplicationStatus(selectedApplications, 'approved')}
            >
              <Check className="h-4 w-4 mr-2" />
              Bulk Approve ({selectedApplications.length})
            </Button>
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={() => updateApplicationStatus(selectedApplications, 'rejected')}
            >
              <X className="h-4 w-4 mr-2" />
              Bulk Reject ({selectedApplications.length})
            </Button>
          </div>
        )}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={selectedApplications.length === pendingApplications.length && pendingApplications.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Partner</TableHead>
              <TableHead>Subtype</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  {application.status === 'pending' && (
                    <Checkbox
                      checked={selectedApplications.includes(application.id)}
                      onCheckedChange={(checked) => 
                        handleSelectApplication(application.id, checked as boolean)
                      }
                    />
                  )}
                </TableCell>
                <TableCell className="font-medium">{application.products?.name || 'N/A'}</TableCell>
                <TableCell>{application.partners?.company_name || 'N/A'}</TableCell>
                <TableCell>{application.subtype || '-'}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(application.status)}>
                    {application.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  {application.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => updateApplicationStatus([application.id], 'approved')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => updateApplicationStatus([application.id], 'rejected')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}