import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Vendor {
  id?: string;
  company_name: string;
  website: string;
  niche: string;
  pitch: string;
  status: 'pending' | 'approved' | 'rejected';
  user_id?: string;
}

interface VendorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vendor?: Vendor;
  userId?: string;
}

export function VendorForm({ isOpen, onClose, onSuccess, vendor, userId }: VendorFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<Vendor>({
    defaultValues: {
      company_name: '',
      website: '',
      niche: '',
      pitch: '',
      status: 'pending'
    }
  });

  useEffect(() => {
    if (vendor) {
      form.reset(vendor);
    } else {
      form.reset({
        company_name: '',
        website: '',
        niche: '',
        pitch: '',
        status: 'pending'
      });
    }
  }, [vendor, form]);

  const onSubmit = async (data: Vendor) => {
    setLoading(true);
    try {
      if (vendor?.id) {
        // Update existing vendor
        const { error } = await supabase
          .from('vendors')
          .update({
            company_name: data.company_name,
            website: data.website,
            niche: data.niche,
            pitch: data.pitch
          })
          .eq('id', vendor.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Vendor profile updated successfully"
        });
      } else {
        // Create new vendor profile
        const { error } = await supabase
          .from('vendors')
          .insert([{
            ...data,
            user_id: userId,
            status: 'pending'
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Vendor profile created successfully"
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving vendor:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save vendor profile",
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
            {vendor ? 'Edit Vendor Profile' : 'Create Vendor Profile'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com"
                      {...field}
                    />
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
                  <FormLabel>Niche/Industry</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., SaaS, E-commerce, Marketing"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pitch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Pitch</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell potential partners about your company..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {vendor ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  vendor ? 'Update Profile' : 'Create Profile'
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