
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { Plus, X, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { PricingTiersManager } from '@/components/admin/PricingTiersManager';

interface ProductFormData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  extended_description?: string;
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
  image_url?: string | null;
}

const ProductServiceEdit: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasImageChanged, setHasImageChanged] = useState(false);

  const form = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      extended_description: '',
      price: null,
      commission_rate: null,
      status: 'pending',
      vendor_id: '',
      features: [''],
      reseller_benefits: [''],
      ideal_resellers: [''],
      getting_customers: [''],
      launch_steps: [''],
      annual_income_potential: null,
      average_deal_size: null,
      setup_fee: null,
      build_from_scratch_cost: null,
      image_url: null
    }
  });

  // Watch for form changes to show unsaved changes warning
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(true);
      setUploadSuccess(false); // Reset upload success when form changes
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    fetchVendors();
    if (productId) {
      fetchData();
    }
  }, [productId]);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('id, company_name')
        .eq('status', 'approved');

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch vendors"
      });
    }
  };

  const fetchData = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      console.log('Fetching product data for ID:', productId);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;

      console.log('Fetched product data:', {
        id: data.id,
        name: data.name,
        image_url: data.image_url,
        hasImage: !!data.image_url
      });

      // Only populate form if we have data and haven't made unsaved changes
      if (data && !hasUnsavedChanges) {
        populateForm(data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch product data"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const populateForm = (data: any) => {
    console.log('Populating form with data:', {
      name: data.name,
      image_url: data.image_url,
      hasCurrentImage: !!data.image_url
    });

    const formData = {
      ...data,
      slug: data.slug || generateSlug(data.name || ''),
      extended_description: data.extended_description || '',
      features: data.features && data.features.length > 0 ? data.features : [''],
      reseller_benefits: data.reseller_benefits && data.reseller_benefits.length > 0 ? data.reseller_benefits : [''],
      ideal_resellers: data.ideal_resellers && data.ideal_resellers.length > 0 ? data.ideal_resellers : [''],
      getting_customers: data.getting_customers && data.getting_customers.length > 0 ? data.getting_customers : [''],
      launch_steps: data.launch_steps && data.launch_steps.length > 0 ? data.launch_steps : [''],
    };

    form.reset(formData);
    setHasUnsavedChanges(false);
    setHasImageChanged(false);
    console.log('Form populated with image_url:', form.getValues('image_url'));
  };

  const handleProductImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please select an image smaller than 5MB"
      });
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select a JPEG, PNG, or WebP image"
      });
      return;
    }

    setUploading(true);
    setUploadSuccess(false);

    try {
      console.log('Starting image upload:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      console.log('Uploading to path:', filePath);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('editor-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('editor-images')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      console.log('Generated public URL:', publicUrl);

      // Update form with new image URL
      form.setValue('image_url', publicUrl);
      setHasImageChanged(true);
      setHasUnsavedChanges(true);
      setUploadSuccess(true);

      console.log('Form updated with image URL:', {
        imageUrl: publicUrl,
        formValue: form.getValues('image_url'),
        hasImageChanged: true
      });

      toast({
        title: "Success",
        description: "Product image uploaded successfully. Don't forget to save your changes!"
      });

    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Failed to upload image"
      });
    } finally {
      setUploading(false);
    }
  };

  const addArrayItem = (fieldName: keyof ProductFormData) => {
    const currentValue = form.getValues(fieldName) as string[];
    form.setValue(fieldName as any, [...currentValue, '']);
    setHasUnsavedChanges(true);
  };

  const removeArrayItem = (fieldName: keyof ProductFormData, index: number) => {
    const currentValue = form.getValues(fieldName) as string[];
    const newValue = currentValue.filter((_, i) => i !== index);
    form.setValue(fieldName as any, newValue);
    setHasUnsavedChanges(true);
  };

  const updateArrayItem = (fieldName: keyof ProductFormData, index: number, value: string) => {
    const currentValue = form.getValues(fieldName) as string[];
    const newValue = [...currentValue];
    newValue[index] = value;
    form.setValue(fieldName as any, newValue);
    setHasUnsavedChanges(true);
  };

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);

    try {
      console.log('Starting product save with data:', {
        id: data.id || productId,
        name: data.name,
        image_url: data.image_url,
        hasImageChanged,
        hasUnsavedChanges
      });

      // Filter out empty strings from arrays
      const baseData = {
        ...data,
        features: data.features.filter(item => item.trim() !== ''),
        reseller_benefits: data.reseller_benefits.filter(item => item.trim() !== ''),
        ideal_resellers: data.ideal_resellers.filter(item => item.trim() !== ''),
        getting_customers: data.getting_customers.filter(item => item.trim() !== ''),
        launch_steps: data.launch_steps.filter(item => item.trim() !== '')
      };

      // CRITICAL: Always include image_url in the save data
      const saveData = {
        ...baseData,
        image_url: data.image_url // Explicitly include image_url
      };

      console.log('Final save data:', {
        id: saveData.id,
        name: saveData.name,
        image_url: saveData.image_url,
        allFields: Object.keys(saveData)
      });

      let result;
      if (productId) {
        // Update existing product
        console.log('Updating product with ID:', productId);
        result = await supabase
          .from('products')
          .update(saveData)
          .eq('id', productId)
          .select(); // Add select to get the updated data

        console.log('Update result:', result);
      } else {
        // Create new product
        console.log('Creating new product');
        result = await supabase
          .from('products')
          .insert([saveData])
          .select(); // Add select to get the created data
      }

      if (result.error) {
        console.error('Database error:', result.error);
        throw result.error;
      }

      // Verify the save was successful
      if (result.data && result.data.length > 0) {
        const savedProduct = result.data[0];
        console.log('Product saved successfully:', {
          id: savedProduct.id,
          name: savedProduct.name,
          image_url: savedProduct.image_url,
          savedCorrectly: savedProduct.image_url === data.image_url
        });
      }

      setHasUnsavedChanges(false);
      setHasImageChanged(false);
      setUploadSuccess(false);

      toast({
        title: "Success",
        description: `Product ${productId ? 'updated' : 'created'} successfully`
      });

      // Refresh data to confirm save
      if (productId) {
        setTimeout(() => fetchData(), 500);
      }

    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || `Failed to ${productId ? 'update' : 'create'} product`
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

  const currentImageUrl = form.watch('image_url');

  if (loading && !productId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {productId ? 'Edit Product' : 'Create Product'}
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                <AlertCircle className="w-3 h-3 mr-1" />
                Unsaved Changes
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {productId ? 'Update product information and settings' : 'Create a new product'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Product Image Upload */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Product Image</Label>
                
                {/* Current Image Display */}
                {currentImageUrl && (
                  <div className="relative">
                    <img 
                      src={currentImageUrl} 
                      alt="Product preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg border"
                      onError={(e) => {
                        console.error('Image failed to load:', currentImageUrl);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {uploadSuccess && (
                      <Badge className="absolute top-2 right-2 bg-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Uploaded
                      </Badge>
                    )}
                  </div>
                )}
                
                {/* Upload Input */}
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleProductImageUpload}
                    disabled={uploading}
                    className="max-w-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        {currentImageUrl ? 'Change Image' : 'Upload Image'}
                      </>
                    )}
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500">
                  Supported formats: JPEG, PNG, WebP. Max size: 5MB.
                </p>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter product name"
                          onChange={(e) => {
                            field.onChange(e);
                            // Auto-generate slug when name changes for new products
                            if (!productId) {
                              form.setValue('slug', generateSlug(e.target.value));
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="product-url-slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Brief description of your product"
                        className="min-h-[100px]"
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
                        {...field}
                        value={field.value || ''}
                        placeholder="Detailed description that will appear on the product page"
                        className="min-h-[150px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pricing Info */}
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

              {/* Financial Information */}
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

              <div className="flex justify-end space-x-2 pt-6 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/admin/products')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className={hasUnsavedChanges ? 'bg-orange-600 hover:bg-orange-700' : ''}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      {productId ? 'Update Product' : 'Create Product'}
                      {hasUnsavedChanges && ' *'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {/* Pricing Tiers Manager - Show only for existing products */}
          {productId && (
            <div className="mt-8 pt-8 border-t">
              <PricingTiersManager productId={productId} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductServiceEdit;
