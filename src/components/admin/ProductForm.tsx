import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, X } from 'lucide-react';
import { PricingTiersManager } from './PricingTiersManager';

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
  annual_income_potential?: number | null;
  average_deal_size?: number | null;
  setup_fee?: number | null;
  build_from_scratch_cost?: number | null;
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
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [productExists, setProductExists] = useState(false);

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
      launch_steps: [''],
      annual_income_potential: null,
      average_deal_size: null,
      setup_fee: null,
      build_from_scratch_cost: null
    }
  });

  useEffect(() => {
    fetchVendors();
    if (vendorId) {
      fetchVendorProduct();
    } else if (productId) {
      fetchProduct();
    }
  }, [vendorId, productId]);

  const fetchVendorProduct = async () => {
    if (!vendorId) return;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('vendor_id', vendorId)
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching vendor product:', error);
      return;
    }

    if (data) {
      setCurrentProduct(data);
      setProductExists(true);
      populateForm(data);
    } else {
      setProductExists(false);
      // Set default values for new product
      form.setValue('vendor_id', vendorId);
    }
  };

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

  const fetchProduct = async () => {
    if (!productId) return;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
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
      setCurrentProduct(data);
      setProductExists(true);
      populateForm(data);
    }
  };

  const populateForm = (data: any) => {
    form.reset({
      name: data.name,
      description: data.description || '',
      price: data.price,
      commission_rate: data.commission_rate,
      status: data.status || 'pending',
      vendor_id: data.vendor_id || vendorId || '',
      features: data.features && data.features.length > 0 ? data.features : [''],
      reseller_benefits: data.reseller_benefits && data.reseller_benefits.length > 0 ? data.reseller_benefits : [''],
      ideal_resellers: data.ideal_resellers && data.ideal_resellers.length > 0 ? data.ideal_resellers : [''],
      getting_customers: data.getting_customers && data.getting_customers.length > 0 ? data.getting_customers : [''],
      launch_steps: data.launch_steps && data.launch_steps.length > 0 ? data.launch_steps : [''],
      annual_income_potential: data.annual_income_potential,
      average_deal_size: data.average_deal_size,
      setup_fee: data.setup_fee,
      build_from_scratch_cost: data.build_from_scratch_cost
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
      if (productExists || productId) {
        // Update existing product
        const updateId = currentProduct?.id || productId;
        result = await supabase
          .from('products')
          .update(filteredData)
          .eq('id', updateId);
      } else {
        // Create new product - generate slug from name
        const slug = filteredData.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');
        
        result = await supabase
          .from('products')
          .insert([{ ...filteredData, slug }]);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: "Success",
        description: `Product ${productExists || productId ? 'updated' : 'created'} successfully`
      });

      // Refresh the product data
      if (vendorId) {
        fetchVendorProduct();
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${productExists || productId ? 'update' : 'create'} product`
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
    <Card>
      <CardHeader>
        <CardTitle>
          {productExists || productId ? 'Edit Product' : 'Create Product'}
        </CardTitle>
        {currentProduct && (
          <CardDescription>
            Editing: {currentProduct.name}
          </CardDescription>
        )}
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
                        <option value="none">Select vendor</option>
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

            {/* Reseller Income Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="annual_income_potential"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Income Potential ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="150000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="average_deal_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Deal Size ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="5000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="setup_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Setup Fee ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="990"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="build_from_scratch_cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Build from Scratch Cost ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="80000"
                      />
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
                {loading ? 'Saving...' : (productExists || productId ? 'Update Product' : 'Create Product')}
              </Button>
            </div>
          </form>
        </Form>

        {/* Pricing Tiers Manager - Show only for existing products */}
        {(currentProduct?.id || productId) && (
          <div className="mt-8">
            <PricingTiersManager productId={currentProduct?.id || productId} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductForm;