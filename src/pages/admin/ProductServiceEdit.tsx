import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye, Plus, X, Upload, Play, Image, Building, MessageSquare, Calculator } from 'lucide-react';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { PricingTiersManager } from '@/components/admin/PricingTiersManager';

interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  extended_description?: string;
  price: number | null;
  commission_rate: number | null;
  status: string;
  features: string[];
  reseller_benefits: string[];
  ideal_resellers: string[];
  getting_customers: string[];
  launch_steps: string[];
  annual_income_potential?: number | null;
  average_deal_size?: number | null;
  setup_fee?: number | null;
  build_from_scratch_cost?: number | null;
  roi_default_deals_per_month?: number;
  roi_default_deal_value?: number;
  roi_monthly_fee?: number;
}

interface VendorInfo {
  id: string;
  company_name: string;
  website: string;
  niche: string;
  banner_image_url?: string;
  demo_video_url?: string;
  demo_video_file_url?: string;
  status: string;
}

export default function ProductServiceEdit() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<VendorInfo | null>(null);
  const [product, setProduct] = useState<ProductFormData | null>(null);
  const [tags, setTags] = useState<Array<{ id: string; name: string; color_hex: string; category?: string; sort_order?: number }>>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProductFormData>({
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
      build_from_scratch_cost: null,
      roi_default_deals_per_month: 5,
      roi_default_deal_value: 1000,
      roi_monthly_fee: 99
    }
  });

  useEffect(() => {
    if (vendorId) {
      fetchData();
      fetchTags();
    }
  }, [vendorId]);

  const fetchData = async () => {
    try {
      // Fetch vendor info
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .select('id, company_name, website, niche, banner_image_url, demo_video_file_url, status')
        .eq('id', vendorId)
        .single();

      if (vendorError) throw vendorError;
      setVendor(vendorData);

      // Fetch product for this vendor
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('vendor_id', vendorId)
        .limit(1)
        .single();

      if (productError && productError.code !== 'PGRST116') {
        console.error('Error fetching product:', productError);
      }

      if (productData) {
        setProduct(productData);
        populateForm(productData);
      }

      // Fetch product tags
      if (productData) {
        const { data: productTags, error: tagsError } = await supabase
          .from('product_tags')
          .select('tag_id')
          .eq('product_id', productData.id);

        if (!tagsError && productTags) {
          setSelectedTags(productTags.map(pt => pt.tag_id));
        }
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load product data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (data: any) => {
    form.reset({
      id: data.id,
      name: data.name || '',
      description: data.description || '',
      extended_description: data.extended_description || '',
      price: data.price,
      commission_rate: data.commission_rate,
      status: data.status || 'pending',
      features: data.features && data.features.length > 0 ? data.features : [''],
      reseller_benefits: data.reseller_benefits && data.reseller_benefits.length > 0 ? data.reseller_benefits : [''],
      ideal_resellers: data.ideal_resellers && data.ideal_resellers.length > 0 ? data.ideal_resellers : [''],
      getting_customers: data.getting_customers && data.getting_customers.length > 0 ? data.getting_customers : [''],
      launch_steps: data.launch_steps && data.launch_steps.length > 0 ? data.launch_steps : [''],
      annual_income_potential: data.annual_income_potential,
      average_deal_size: data.average_deal_size,
      setup_fee: data.setup_fee,
      build_from_scratch_cost: data.build_from_scratch_cost,
      roi_default_deals_per_month: data.roi_default_deals_per_month || 5,
      roi_default_deal_value: data.roi_default_deal_value || 1000,
      roi_monthly_fee: data.roi_monthly_fee || 99
    });
  };

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('is_global', true);

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
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
    setSaving(true);
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

      let result;
      if (product?.id || data.id) {
        // Update existing product
        const updateId = product?.id || data.id;
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

      if (result.error) throw result.error;

      // Update product tags if we have a product
      if (product?.id || data.id) {
        const productId = product?.id || data.id;
        
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
        description: `Product ${product?.id || data.id ? 'updated' : 'created'} successfully`
      });

      // Refresh data
      fetchData();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    setUploadingVideo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${vendorId}/banner-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('editor-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('editor-images')
        .getPublicUrl(fileName);

      // Update vendor's banner image
      const { error: updateError } = await supabase
        .from('vendors')
        .update({ banner_image_url: data.publicUrl })
        .eq('id', vendorId);

      if (updateError) throw updateError;

      setVendor(prev => prev ? { ...prev, banner_image_url: data.publicUrl } : null);
      
      toast({
        title: "Success",
        description: "Banner image uploaded successfully"
      });
    } catch (error: any) {
      console.error('Error uploading banner:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload banner image",
        variant: "destructive"
      });
    } finally {
      setUploadingVideo(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor not found</h2>
          <Button onClick={() => navigate('/admin/vendors')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vendors
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/vendors')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vendors
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {form.watch('name') || 'New Product/Service'}
              </h1>
              <p className="text-gray-600">
                Edit product information for {vendor.company_name}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Form {...form}>
              <form className="space-y-6">
                {/* Basic Product Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product/Service Information</CardTitle>
                    <CardDescription>
                      Main information about your product or service
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product/Service Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter product or service name" {...field} />
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
                            <RichTextEditor
                              key={`description-${vendorId}`}
                              value={field.value || ''}
                              onChange={field.onChange}
                              placeholder="Detailed description of your product/service..."
                              className="min-h-[200px]"
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
                          <FormLabel>Extended Description</FormLabel>
                          <FormControl>
                            <Textarea
                              value={field.value || ''}
                              onChange={field.onChange}
                              placeholder="This extended description will appear prominently on the product page to give more context to potential partners..."
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
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Information</CardTitle>
                    <CardDescription>
                      Revenue potential and costs for resellers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                  </CardContent>
                </Card>

                {/* ROI Calculator Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calculator className="w-5 h-5 mr-2" />
                      ROI Calculator Settings
                    </CardTitle>
                    <CardDescription>
                      Default values for the ROI calculator on product page
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="roi_default_deals_per_month"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Deals Per Month</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                                placeholder="5"
                                min="1"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="roi_default_deal_value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Deal Value ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                                placeholder="1000"
                                min="0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="roi_monthly_fee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Fee ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                                placeholder="99"
                                min="0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Product Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {renderArrayField('features', 'Features', 'Enter a feature of your product/service')}
                    {renderArrayField('reseller_benefits', 'Reseller Benefits', 'Enter a benefit for resellers')}
                    {renderArrayField('ideal_resellers', 'Ideal Resellers', 'Describe ideal reseller profile')}
                    {renderArrayField('getting_customers', 'Getting Customers', 'How resellers can get customers')}
                    {renderArrayField('launch_steps', 'Launch Steps', 'Steps to launch the business')}
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tags & Categories</CardTitle>
                    <CardDescription>
                      Select tags that describe this product, organized by category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
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
                  </CardContent>
                </Card>
              </form>
            </Form>

            {/* Pricing Tiers */}
            {product?.id && (
              <Card>
                <CardHeader>
                  <CardTitle>Pricing Tiers</CardTitle>
                </CardHeader>
                <CardContent>
                  <PricingTiersManager productId={product.id} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge 
                  variant={form.watch('status') === 'approved' ? 'default' : form.watch('status') === 'rejected' ? 'destructive' : 'secondary'}
                  className="mb-4"
                >
                  {form.watch('status')}
                </Badge>
                <p className="text-sm text-gray-600 mb-4">
                  {form.watch('status') === 'approved' 
                    ? 'This product is visible on the marketplace'
                    : form.watch('status') === 'pending'
                    ? 'This product is awaiting approval'
                    : 'This product has been rejected'
                  }
                </p>
              </CardContent>
            </Card>

            {/* Marketplace Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Marketplace Preview</CardTitle>
                <CardDescription>
                  This is how your product will appear in the marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-sm">
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    {/* Product Banner Image */}
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg relative group cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={uploadingVideo}
                      />
                      {vendor.banner_image_url ? (
                        <img 
                          src={vendor.banner_image_url}
                          alt="Product banner"
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                          <span className="text-white text-sm">Product Banner</span>
                        </div>
                      )}
                      {/* Upload overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {uploadingVideo ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        ) : (
                          <div className="text-white text-center">
                            <Upload className="w-6 h-6 mx-auto mb-1" />
                            <span className="text-xs">Click to upload</span>
                          </div>
                        )}
                      </div>
                    </div>
                   
                    <CardHeader>
                      <div className="flex items-center space-x-2 mb-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{vendor.company_name}</span>
                        <Badge variant="outline" className="text-xs">{vendor.niche}</Badge>
                      </div>
                      <CardTitle className="text-lg">
                        {form.watch('name') || 'Product Name'}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {form.watch('description')?.replace(/<[^>]*>/g, '') || 'Product description will appear here...'}
                      </CardDescription>
                    </CardHeader>
                   
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-1">
                          {selectedTags.length > 0 ? (
                            tags
                              .filter(tag => selectedTags.includes(tag.id))
                              .slice(0, 3)
                              .map(tag => (
                                <Badge 
                                  key={tag.id}
                                  variant="secondary" 
                                  className="text-xs"
                                  style={{ 
                                    backgroundColor: tag.color_hex + '20',
                                    color: tag.color_hex,
                                    borderColor: tag.color_hex + '40'
                                  }}
                                >
                                  {tag.name}
                                </Badge>
                              ))
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              No tags
                            </Badge>
                          )}
                          {selectedTags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{selectedTags.length - 3}
                            </Badge>
                          )}
                        </div>
                       
                        <div className="text-xs text-gray-600">
                          <div className="font-medium mb-1">Available for:</div>
                          <div>white label, reseller, affiliate</div>
                        </div>
                       
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1" disabled>
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" disabled>
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}