import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number | null;
  commission_rate: number | null;
  status: 'pending' | 'approved' | 'rejected';
  vendor_id?: string;
  slug?: string;
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
  const [tags, setTags] = useState<Array<{ id: string; name: string; color_hex: string; category?: string; sort_order?: number }>>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<Product>({
    defaultValues: {
      name: '',
      description: '',
      price: null,
      commission_rate: null,
      status: 'pending'
    }
  });

  useEffect(() => {
    fetchTags();
    if (product) {
      form.reset(product);
      fetchProductTags();
    } else {
      form.reset({
        name: '',
        description: '',
        price: null,
        commission_rate: null,
        status: 'pending'
      });
      setSelectedTags([]);
    }
  }, [product, form]);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('id, name, color_hex, category, sort_order')
        .eq('is_global', true)
        .order('category', { ascending: true })
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchProductTags = async () => {
    if (!product?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('product_tags')
        .select('tag_id')
        .eq('product_id', product.id);

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

  const saveProductTags = async (productId: string) => {
    try {
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
    } catch (error) {
      console.error('Error saving product tags:', error);
    }
  };

  const onSubmit = async (data: Product) => {
    setLoading(true);
    try {
      if (product?.id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            name: data.name,
            description: data.description,
            price: data.price,
            commission_rate: data.commission_rate,
            slug: product.slug || data.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
          })
          .eq('id', product.id);

        if (error) throw error;
        
        // Save tags
        await saveProductTags(product.id);

        toast({
          title: "Success",
          description: "Product updated successfully"
        });
      } else {
        // Create new product - generate slug from name
        const slug = data.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');
        
        const { error, data: newProduct } = await supabase
          .from('products')
          .insert([{
            ...data,
            vendor_id: vendorId,
            status: 'pending',
            slug
          }])
          .select()
          .single();

        if (error) throw error;
        
        // Save tags for new product
        if (newProduct) {
          await saveProductTags(newProduct.id);
        }

        toast({
          title: "Success",
          description: "Product created successfully"
        });
      }

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your product..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
            </div>

            {/* Tags Section */}
            <div className="space-y-4">
              <Label>Tags & Categories</Label>
              <p className="text-sm text-gray-600">
                Select tags that describe this product, organized by category
              </p>
              
              {/* Group tags by category */}
              {Object.entries(
                tags.reduce((acc, tag) => {
                  const category = tag.category || 'Other';
                  if (!acc[category]) {
                    acc[category] = [];
                  }
                  acc[category].push(tag);
                  return acc;
                }, {} as Record<string, any[]>)
              ).map(([category, categoryTags]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700 uppercase tracking-wide">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {categoryTags.map(tag => (
                      <Badge
                        key={tag.id}
                        variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                        className="cursor-pointer transition-all hover:scale-105"
                        style={{
                          backgroundColor: selectedTags.includes(tag.id) ? tag.color_hex : 'transparent',
                          color: selectedTags.includes(tag.id) ? 'white' : tag.color_hex,
                          borderColor: tag.color_hex
                        }}
                        onClick={() => toggleTag(tag.id)}
                      >
                        {tag.name}
                        {selectedTags.includes(tag.id) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
              
              {selectedTags.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Selected tags: {selectedTags.length}
                  </p>
                </div>
              )}
            </div>

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