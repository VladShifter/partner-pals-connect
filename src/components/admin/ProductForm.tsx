import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, X } from 'lucide-react';

interface ProductFormData {
  name: string;
  description: string;
  price: number | null;
  commission_rate: number | null;
  status: string;
  vendor_id: string;
  features: string[];
  reseller_benefits: string[];
  ideal_resellers: string[];
  getting_customers: string[];
  launch_steps: string[];
}

interface ProductFormProps {
  productId?: string;
  vendorId?: string;
  onSuccess?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ productId, vendorId, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState<any[]>([]);
  const [existingProducts, setExistingProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(productId || null);
  const [isCreatingNew, setIsCreatingNew] = useState(!productId);

  const form = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      description: '',
      price: null,
      commission_rate: null,
      status: 'pending',
      vendor_id: vendorId || '',
      features: [''],
      reseller_benefits: [''],
      ideal_resellers: [''],
      getting_customers: [''],
      launch_steps: ['']
    }
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    if (vendorId) {
      fetchVendorProducts();
    }
  }, [vendorId]);

  useEffect(() => {
    if (selectedProductId || productId) {
      fetchProduct();
    }
  }, [selectedProductId, productId]);

  const fetchVendors = async () => {
    const { data, error } = await supabase
      .from('vendors')
      .select('id, company_name')
      .eq('status', 'approved');

    if (error) {
      console.error('Error fetching vendors:', error);
      return;
    }

    setVendors(data || []);
  };

  const fetchVendorProducts = async () => {
    if (!vendorId) return;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('vendor_id', vendorId);

    if (error) {
      console.error('Error fetching vendor products:', error);
      return;
    }

    setExistingProducts(data || []);
  };

  const fetchProduct = async () => {
    const currentProductId = selectedProductId || productId;
    if (!currentProductId) return;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', currentProductId)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch product data"
      });
      return;
    }

    if (data) {
      form.reset({
        name: data.name,
        description: data.description || '',
        price: data.price,
        commission_rate: data.commission_rate,
        status: data.status || 'pending',
        vendor_id: data.vendor_id || '',
        features: data.features && data.features.length > 0 ? data.features : [''],
        reseller_benefits: data.reseller_benefits && data.reseller_benefits.length > 0 ? data.reseller_benefits : [''],
        ideal_resellers: data.ideal_resellers && data.ideal_resellers.length > 0 ? data.ideal_resellers : [''],
        getting_customers: data.getting_customers && data.getting_customers.length > 0 ? data.getting_customers : [''],
        launch_steps: data.launch_steps && data.launch_steps.length > 0 ? data.launch_steps : ['']
      });
    }
    setIsCreatingNew(false);
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    setIsCreatingNew(false);
  };

  const handleCreateNew = () => {
    setSelectedProductId(null);
    setIsCreatingNew(true);
    form.reset({
      name: '',
      description: '',
      price: null,
      commission_rate: null,
      status: 'pending',
      vendor_id: vendorId || '',
      features: [''],
      reseller_benefits: [''],
      ideal_resellers: [''],
      getting_customers: [''],
      launch_steps: ['']
    });
  };

  const addArrayItem = (fieldName: keyof ProductFormData) => {
    const currentValue = form.getValues(fieldName) as string[];
    form.setValue(fieldName as any, [...currentValue, '']);
  };

  const removeArrayItem = (fieldName: keyof ProductFormData, index: number) => {
    const currentValue = form.getValues(fieldName) as string[];
    const newValue = currentValue.filter((_, i) => i !== index);
    form.setValue(fieldName as any, newValue);
  };

  const updateArrayItem = (fieldName: keyof ProductFormData, index: number, value: string) => {
    const currentValue = form.getValues(fieldName) as string[];
    const newValue = [...currentValue];
    newValue[index] = value;
    form.setValue(fieldName as any, newValue);
  };

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);

    try {
      // Filter out empty strings from arrays
      const filteredData = {
        ...data,
        features: data.features.filter(item => item.trim() !== ''),
        reseller_benefits: data.reseller_benefits.filter(item => item.trim() !== ''),
        ideal_resellers: data.ideal_resellers.filter(item => item.trim() !== ''),
        getting_customers: data.getting_customers.filter(item => item.trim() !== ''),
        launch_steps: data.launch_steps.filter(item => item.trim() !== '')
      };

      let result;
      const currentProductId = selectedProductId || productId;
      if (currentProductId) {
        result = await supabase
          .from('products')
          .update(filteredData)
          .eq('id', currentProductId);
      } else {
        result = await supabase
          .from('products')
          .insert([filteredData]);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: "Success",
        description: `Product ${currentProductId ? 'updated' : 'created'} successfully`
      });

      // Refresh the product list
      if (vendorId) {
        fetchVendorProducts();
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving product:', error);
      const currentProductId = selectedProductId || productId;
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${currentProductId ? 'update' : 'create'} product`
      });
    } finally {
      setLoading(false);
    }
  };

  const renderArrayField = (
    fieldName: keyof ProductFormData,
    label: string,
    placeholder: string
  ) => {
    const values = form.watch(fieldName) as string[];
    
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <Textarea
              value={value}
              onChange={(e) => updateArrayItem(fieldName, index, e.target.value)}
              placeholder={placeholder}
              className="min-h-[40px]"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeArrayItem(fieldName, index)}
              className="mt-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addArrayItem(fieldName)}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {label.toLowerCase().replace(/s$/, '')}
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Existing Products List */}
      {vendorId && existingProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Existing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {existingProducts.map((product) => (
                <div
                  key={product.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedProductId === product.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleProductSelect(product.id)}
                >
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <Badge variant={product.status === 'approved' ? 'default' : 'secondary'}>
                      {product.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ${product.price || 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              onClick={handleCreateNew}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Product
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Product Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isCreatingNew 
              ? 'Create New Product' 
              : selectedProductId 
                ? 'Edit Product' 
                : 'Product Form'
            }
          </CardTitle>
        </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter product name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vendor_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full p-2 border border-input rounded-md"
                      >
                        <option value="">Select vendor</option>
                        {vendors.map((vendor) => (
                          <option key={vendor.id} value={vendor.id}>
                            {vendor.company_name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter product description"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="0.00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commission_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission Rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="0.00"
                        min="0"
                        max="100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full p-2 border border-input rounded-md"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Array Fields */}
            <div className="space-y-6">
              {renderArrayField('features', 'Features (What are you reselling)', 'Enter a feature description')}
              {renderArrayField('reseller_benefits', 'Reseller Benefits (Why You Should Resell This)', 'Enter a benefit for resellers')}
              {renderArrayField('ideal_resellers', 'Ideal Resellers', 'Enter ideal reseller type')}
              {renderArrayField('getting_customers', 'Getting Customers (Easy Ways to Get Customers)', 'Enter a customer acquisition method')}
              {renderArrayField('launch_steps', 'Launch Steps (How To Launch)', 'Enter a launch step')}
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (selectedProductId || productId ? 'Update Product' : 'Create Product')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
    </div>
  );
};

export default ProductForm;