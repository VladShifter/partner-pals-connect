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
import { ArrowLeft, Save, Eye, Plus, X, Upload, Play, Image, Building, MessageSquare } from 'lucide-react';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import ProductForm from '@/components/admin/ProductForm';

interface VendorProfile {
  id: string;
  company_name: string;
  website: string;
  niche: string;
  pitch: string;
  status: 'pending' | 'approved' | 'rejected';
  description?: string;
  logo_url?: string;
  demo_video_url?: string;
  demo_video_file_url?: string;
  founded_year?: number;
  team_size?: string;
  location?: string;
  preview_image_url?: string;
  banner_image_url?: string;
}

export default function VendorProfileEdit() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [tags, setTags] = useState<Array<{ id: string; name: string; color_hex: string }>>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const { toast } = useToast();

  const form = useForm<VendorProfile>();

  useEffect(() => {
    if (vendorId) {
      fetchVendorData();
      fetchTags();
    }
  }, [vendorId]);

  const fetchVendorData = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', vendorId)
        .single();

      if (error) throw error;
      
      setVendor(data as VendorProfile);
      form.reset(data as VendorProfile);

      // Fetch vendor tags
      const { data: vendorTags, error: tagsError } = await supabase
        .from('vendor_tags')
        .select('tag_id')
        .eq('vendor_id', vendorId);

      if (!tagsError && vendorTags) {
        setSelectedTags(vendorTags.map(vt => vt.tag_id));
      }
    } catch (error: any) {
      console.error('Error fetching vendor:', error);
      toast({
        title: "Error",
        description: "Failed to load vendor profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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

  const onSubmit = async (data: VendorProfile) => {
    setSaving(true);
    try {
      // Update vendor profile
      const { error } = await supabase
        .from('vendors')
        .update({
          company_name: data.company_name,
          website: data.website,
          niche: data.niche,
          pitch: data.pitch,
          description: data.description,
          logo_url: data.logo_url,
          demo_video_url: data.demo_video_url,
          demo_video_file_url: data.demo_video_file_url,
          founded_year: data.founded_year,
          team_size: data.team_size,
          location: data.location,
          preview_image_url: data.preview_image_url,
          banner_image_url: data.banner_image_url
        })
        .eq('id', vendorId);

      if (error) throw error;

      // Update vendor tags
      const { error: tagsError } = await supabase.rpc('update_vendor_tags', {
        vendor_id_param: vendorId,
        tag_ids: selectedTags
      });

      if (tagsError) throw tagsError;

      toast({
        title: "Success",
        description: "Vendor profile updated successfully"
      });
    } catch (error: any) {
      console.error('Error updating vendor:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update vendor profile",
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

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast({
        title: "Error",
        description: "Please select a video file",
        variant: "destructive"
      });
      return;
    }

    setUploadingVideo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${vendorId}/demo-video-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('vendor-videos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('vendor-videos')
        .getPublicUrl(fileName);

      form.setValue('demo_video_file_url', data.publicUrl);
      
      toast({
        title: "Success",
        description: "Video uploaded successfully"
      });
    } catch (error: any) {
      console.error('Error uploading video:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload video",
        variant: "destructive"
      });
    } finally {
      setUploadingVideo(false);
    }
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

    setUploadingVideo(true); // Reuse the same loading state
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

      form.setValue('banner_image_url', data.publicUrl);
      
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
              <h1 className="text-3xl font-bold text-gray-900">{vendor.company_name}</h1>
              <p className="text-gray-600">Edit vendor profile and marketplace presence</p>
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
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="company_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="niche"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry/Niche</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SaaS">SaaS</SelectItem>
                                  <SelectItem value="E-commerce">E-commerce</SelectItem>
                                  <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                                  <SelectItem value="Marketing">Marketing</SelectItem>
                                  <SelectItem value="Analytics">Analytics</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="pitch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Pitch</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Brief description of your company..."
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
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detailed Description</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              key={`description-${vendorId}`}
                              value={field.value || ''}
                              onChange={field.onChange}
                              placeholder="Enter detailed description with rich formatting..."
                              className="min-h-[200px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Company Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Company Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="founded_year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Founded Year</FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                placeholder="2020"
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="team_size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Team Size</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1-10">1-10 employees</SelectItem>
                                  <SelectItem value="11-50">11-50 employees</SelectItem>
                                  <SelectItem value="51-200">51-200 employees</SelectItem>
                                  <SelectItem value="201-500">201-500 employees</SelectItem>
                                  <SelectItem value="500+">500+ employees</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="New York, USA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Media */}
                <Card>
                  <CardHeader>
                    <CardTitle>Media & Assets</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="logo_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Logo URL</FormLabel>
                          <FormControl>
                            <div className="flex space-x-2">
                              <Input 
                                placeholder="https://example.com/logo.png"
                                {...field}
                              />
                              <Button type="button" variant="outline">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preview_image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marketplace Preview Image</FormLabel>
                          <FormControl>
                            <div className="flex space-x-2">
                              <Input 
                                placeholder="https://example.com/preview.jpg"
                                {...field}
                              />
                              <Button type="button" variant="outline">
                                <Image className="w-4 h-4 mr-2" />
                                Upload
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                          {field.value && (
                            <div className="mt-2">
                              <img 
                                src={field.value} 
                                alt="Preview" 
                                className="w-32 h-20 object-cover rounded border"
                              />
                            </div>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="banner_image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Banner Image</FormLabel>
                          <FormControl>
                            <div className="flex space-x-2">
                              <Input 
                                placeholder="https://example.com/banner.jpg"
                                {...field}
                              />
                              <Button type="button" variant="outline">
                                <Image className="w-4 h-4 mr-2" />
                                Upload
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                          {field.value && (
                            <div className="mt-2">
                              <img 
                                src={field.value} 
                                alt="Banner" 
                                className="w-48 h-24 object-cover rounded border"
                              />
                            </div>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="demo_video_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Demo Video URL</FormLabel>
                          <FormControl>
                            <div className="flex space-x-2">
                              <Input 
                                placeholder="https://youtube.com/watch?v=..."
                                {...field}
                              />
                              <Button type="button" variant="outline">
                                <Play className="w-4 h-4 mr-2" />
                                Preview
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center space-x-4">
                      <div className="w-full h-px bg-gray-300"></div>
                      <span className="text-sm text-gray-500 whitespace-nowrap">OR</span>
                      <div className="w-full h-px bg-gray-300"></div>
                    </div>

                    <FormField
                      control={form.control}
                      name="demo_video_file_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload Demo Video</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <div className="flex space-x-2">
                                <Input 
                                  type="file"
                                  accept="video/*"
                                  onChange={handleVideoUpload}
                                  disabled={uploadingVideo}
                                />
                                {uploadingVideo && (
                                  <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                  </div>
                                )}
                              </div>
                              {field.value && (
                                <div className="mt-2">
                                  <video 
                                    src={field.value} 
                                    controls 
                                    className="w-full max-w-md h-40 rounded border"
                                  />
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tags & Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Click to add/remove tags that describe this vendor
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
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
                      {selectedTags.length > 0 && (
                        <div className="pt-2 border-t">
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

            {/* Products Management */}
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductForm vendorId={vendorId} />
              </CardContent>
            </Card>
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
                  variant={vendor.status === 'approved' ? 'default' : vendor.status === 'rejected' ? 'destructive' : 'secondary'}
                  className="mb-4"
                >
                  {vendor.status}
                </Badge>
                <p className="text-sm text-gray-600 mb-4">
                  {vendor.status === 'approved' 
                    ? 'This vendor is visible on the marketplace'
                    : vendor.status === 'pending'
                    ? 'This vendor is awaiting approval'
                    : 'This vendor has been rejected'
                  }
                </p>
                <Button variant="outline" className="w-full">
                  Change Status
                </Button>
              </CardContent>
            </Card>

            {/* Marketplace Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Marketplace Preview</CardTitle>
                <CardDescription>
                  This is how your vendor's product will appear in the marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-sm">
                  {/* Actual marketplace card preview */}
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
                       {form.watch('banner_image_url') ? (
                         <img 
                           src={form.watch('banner_image_url')}
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
                        <span className="text-sm text-gray-600">{form.watch('company_name') || 'Company Name'}</span>
                        <Badge variant="outline" className="text-xs">{form.watch('niche') || 'Industry'}</Badge>
                      </div>
                      <CardTitle className="text-lg">
                        {form.watch('company_name') ? `${form.watch('company_name')} Suite` : 'Product Name'}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {form.watch('pitch') || 'Your product description will appear here...'}
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