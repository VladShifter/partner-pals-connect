import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye, Plus, X, Upload, Play } from 'lucide-react';

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
  founded_year?: number;
  team_size?: string;
  location?: string;
}

export default function VendorProfileEdit() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [tags, setTags] = useState<Array<{ id: string; name: string; color_hex: string }>>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
          founded_year: data.founded_year,
          team_size: data.team_size,
          location: data.location
        })
        .eq('id', vendorId);

      if (error) throw error;

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
                            <Textarea 
                              placeholder="Detailed description for the vendor page..."
                              className="min-h-[150px]"
                              {...field}
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
                        Select tags that describe your company and products
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <Badge
                            key={tag.id}
                            variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                            className="cursor-pointer"
                            style={{
                              backgroundColor: selectedTags.includes(tag.id) ? tag.color_hex : 'transparent',
                              color: selectedTags.includes(tag.id) ? 'white' : tag.color_hex,
                              borderColor: tag.color_hex
                            }}
                            onClick={() => toggleTag(tag.id)}
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </Form>
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

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Marketplace Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    {vendor.logo_url ? (
                      <img src={vendor.logo_url} alt="Logo" className="max-h-full max-w-full" />
                    ) : (
                      <div className="text-gray-400">Company Logo</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{vendor.company_name}</h3>
                    <p className="text-sm text-gray-600">{vendor.niche}</p>
                    <p className="text-sm mt-2 line-clamp-3">{vendor.pitch}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}