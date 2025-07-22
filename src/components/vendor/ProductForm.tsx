import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, X } from 'lucide-react';

interface Product {
  id?: string;
  name: string;
  description: string;
  extended_description?: string;
  price: number | null;
  commission_rate: number | null;
  status: 'pending' | 'approved' | 'rejected';
  vendor_id?: string;
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
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product;
  vendorId?: string;
}

export function ProductForm({ isOpen, onClose, onSuccess, product, vendorId }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<Array<{ id: string; name: string; color_hex: string; category: string }>>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<Product>({
    defaultValues: {
      name: '',
      description: '',
      extended_description: '',
      price: null,
      commission_rate: null,
      status: 'pending',
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
    if (product) {
      form.reset({
        ...product,
        features: product.features && product.features.length > 0 ? product.features : [''],
        reseller_benefits: product.reseller_benefits && product.reseller_benefits.length > 0 ? product.reseller_benefits : [''],
        ideal_resellers: product.ideal_resellers && product.ideal_resellers.length > 0 ? product.ideal_resellers : [''],
        getting_customers: product.getting_customers && product.getting_customers.length > 0 ? product.getting_customers : [''],
        launch_steps: product.launch_steps && product.launch_steps.length > 0 ? product.launch_steps : ['']
      });
      
      // Fetch product tags if editing
      if (product.id) {
        fetchProductTags(product.id);
      }
    } else {
      form.reset({
        name: '',
        description: '',
        extended_description: '',
        price: null,
        commission_rate: null,
        status: 'pending',
        features: [''],
        reseller_benefits: [''],
        ideal_resellers: [''],
        getting_customers: [''],
        launch_steps: [''],
        annual_income_potential: null,
        average_deal_size: null,
        setup_fee: null,
        build_from_scratch_cost: null
      });
      setSelectedTags([]);
    }
  }, [product, form]);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('id, name, color_hex, category')
        .eq('is_global', true);

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchProductTags = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('product_tags')
        .select('tag_id')
        .eq('product_id', productId);

      if (error) throw error;
      setSelectedTags(data?.map(pt => pt.tag_id) || []);
    } catch (error) {
      console.error('Error fetching product tags:', error);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const addArrayItem = (fieldName: keyof Product) => {
    const currentValue = form.getValues(fieldName) as string[];
    form.setValue(fieldName as any, [...currentValue, '']);
  };

  const removeArrayItem = (fieldName: keyof Product, index: number) => {
    const currentValue = form.getValues(fieldName) as string[];
    const newValue = currentValue.filter((_, i) => i !== index);
    form.setValue(fieldName as any, newValue);
  };

  const updateArrayItem = (fieldName: keyof Product, index: number, value: string) => {
    const currentValue = form.getValues(fieldName) as string[];
    const newValue = [...currentValue];
    newValue[index] = value;
    form.setValue(fieldName as any, newValue);
  };

  const onSubmit = async (data: Product) => {
    setLoading(true);
    try {
      // Filter out empty strings from arrays
      const filteredData = {
        ...data,
        vendor_id: vendorId,
        features: data.features.filter(item => item.trim() !== ''),
        reseller_benefits: data.reseller_benefits.filter(item => item.trim() !== ''),
        ideal_resellers: data.ideal_resellers.filter(item => item.trim() !== ''),
        getting_customers: data.getting_customers.filter(item => item.trim() !== ''),
        launch_steps: data.launch_steps.filter(item => item.trim() !== '')
      };

      let productId = product?.id;

      if (product?.id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(filteredData)
          .eq('id', product.id);

        if (error) throw error;
      } else {
        // Create new product
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert([{
            ...filteredData,
            status: 'pending'
          }])
          .select()
          .single();

        if (error) throw error;
        productId = newProduct.id;
      }

      // Update product tags
      if (productId) {
        // Remove existing tags
        await supabase
          .from('product_tags')
          .delete()
          .eq('product_id', productId);

        // Add new tags
        if (selectedTags.length > 0) {
          const tagInserts = selectedTags.map(tagId => ({
            product_id: productId,
            tag_id: tagId
          }));

          await supabase
            .from('product_tags')
            .insert(tagInserts);
        }
      }

      toast({
        title: "Success",
        description: `Product ${product?.id ? 'updated' : 'created'} successfully`
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderArrayField = (
    fieldName: keyof Product,
    label: string,
    placeholder: string
  ) => {
    const values = form.watch(fieldName) as string[];
    
    return (
      <div className="space-y-2">
        <FormLabel className="text-sm font-medium">{label}</FormLabel>
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
                <TabsTrigger value="tags">Tags</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of your product..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="extended_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed description that will appear on the product page..."
                          className="min-h-[150px]"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                {renderArrayField('features', 'Features', 'Describe a product feature...')}
                {renderArrayField('reseller_benefits', 'Reseller Benefits', 'What benefit does the reseller get?')}
                {renderArrayField('ideal_resellers', 'Ideal Resellers', 'Who is perfect for selling this?')}
                {renderArrayField('getting_customers', 'How to Get Customers', 'How can resellers find customers?')}
                {renderArrayField('launch_steps', 'Launch Steps', 'What steps to launch this product?')}
              </TabsContent>

              <TabsContent value="financial" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="0.00"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
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
                            placeholder="0.00"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="annual_income_potential"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Income Potential ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="0.00"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
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
                            placeholder="0.00"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
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
                            placeholder="0.00"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
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
                            placeholder="0.00"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="tags" className="space-y-4">
                <div>
                  <FormLabel className="text-sm font-medium mb-3 block">Product Tags</FormLabel>
                  <div className="space-y-4">
                    {Object.entries(
                      tags.reduce((acc, tag) => {
                        const category = tag.category || 'Other';
                        if (!acc[category]) {
                          acc[category] = [];
                        }
                        acc[category].push(tag);
                        return acc;
                      }, {} as Record<string, typeof tags>)
                    ).map(([category, categoryTags]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">{category}</h4>
                        <div className="flex flex-wrap gap-2">
                          {categoryTags.map((tag) => (
                            <Badge
                              key={tag.id}
                              variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => toggleTag(tag.id)}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {product ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  product ? 'Update Product' : 'Create Product'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}