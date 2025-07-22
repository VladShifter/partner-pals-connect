import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Edit2, Check, X, Plus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  commission_rate: number;
  status: 'pending' | 'approved' | 'rejected';
  vendor_id: string;
  created_at: string;
  vendors: {
    company_name: string;
  };
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.status === statusFilter));
    }
  }, [products, statusFilter]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          vendors!inner(company_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts((data || []) as Product[]);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProductStatus = async (productId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status })
        .eq('id', productId);

      if (error) throw error;

      // Refresh the list
      fetchProducts();

      toast({
        title: "Success",
        description: `Product ${status} successfully`
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product status",
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
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">
            Manage products and approve/reject submissions
          </p>
        </div>
        <Button onClick={() => navigate('/admin/products/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
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
              <TableHead>Product Name</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.vendors?.company_name || '-'}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.commission_rate}%</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(product.status)}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(product.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    
                    {product.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => updateProductStatus(product.id, 'approved')}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => updateProductStatus(product.id, 'rejected')}
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