import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { Edit2, Check, X } from 'lucide-react';

interface Vendor {
  id: string;
  company_name: string;
  website: string;
  niche: string;
  pitch: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface EditVendorForm {
  company_name: string;
  website: string;
  niche: string;
  pitch: string;
}

export default function AdminVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingVendor, setEditingVendor] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<EditVendorForm>();

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredVendors(vendors);
    } else {
      setFilteredVendors(vendors.filter(vendor => vendor.status === statusFilter));
    }
  }, [vendors, statusFilter]);

  const fetchVendors = async () => {
    try {
      console.log('Fetching vendors...');
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Vendors data:', data);
      console.log('Vendors error:', error);
      
      if (error) throw error;
      setVendors((data || []) as Vendor[]);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch vendors",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateVendorStatus = async (vendorId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('vendors')
        .update({ status })
        .eq('id', vendorId);

      if (error) throw error;

      // Refresh the list
      fetchVendors();

      toast({
        title: "Success",
        description: `Vendor ${status} successfully`
      });
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast({
        title: "Error",
        description: "Failed to update vendor status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

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
          <h1 className="text-3xl font-bold">Vendor Management</h1>
          <p className="text-muted-foreground">
            Manage vendor profiles and approve/reject applications
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vendors</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Niche</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">{vendor.company_name}</TableCell>
                <TableCell>
                  {vendor.website ? (
                    <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {vendor.website}
                    </a>
                  ) : '-'}
                </TableCell>
                <TableCell>{vendor.niche || '-'}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(vendor.status)}>
                    {vendor.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(vendor.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/vendors/${vendor.id}/edit`)}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit Profile
                    </Button>
                    
                    {vendor.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => updateVendorStatus(vendor.id, 'approved')}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => updateVendorStatus(vendor.id, 'rejected')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}