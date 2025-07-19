import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { Plus, Edit2, Trash2, Palette, Filter } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Tag {
  id: string;
  name: string;
  color_hex: string;
  is_global: boolean;
  category: string | null;
  filter_type: string;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
}

interface TagForm {
  name: string;
  color_hex: string;
  is_global: boolean;
  category: string;
  filter_type: string;
  sort_order: number;
  is_featured: boolean;
}

export default function AdminTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const categories = [
    'Industry', 'Use-Case', 'Product Scale', 'Technology', 'Business Model', 
    'Partner Type', 'Vendor Support', 'Quality', 'Client Segment', 
    'Geography', 'Setup', 'Hosting'
  ];

  const form = useForm<TagForm>({
    defaultValues: {
      name: '',
      color_hex: '#777777',
      is_global: true,
      category: 'Industry',
      filter_type: 'checkbox',
      sort_order: 0,
      is_featured: false
    }
  });

  useEffect(() => {
    fetchTags();
    
    // Set up realtime subscription for tags
    const channel = supabase
      .channel('tags-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tags'
      }, () => {
        fetchTags();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('category', { ascending: true })
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tags",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createTag = async (data: TagForm) => {
    try {
      const { error } = await supabase
        .from('tags')
        .insert([data]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tag created successfully"
      });
      
      setIsDialogOpen(false);
      form.reset();
      fetchTags();
    } catch (error) {
      console.error('Error creating tag:', error);
      toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive"
      });
    }
  };

  const updateTag = async (tagId: string, data: TagForm) => {
    try {
      const { error } = await supabase
        .from('tags')
        .update(data)
        .eq('id', tagId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tag updated successfully"
      });
      
      setEditingTag(null);
      setIsDialogOpen(false);
      form.reset();
      fetchTags();
    } catch (error) {
      console.error('Error updating tag:', error);
      toast({
        title: "Error",
        description: "Failed to update tag",
        variant: "destructive"
      });
    }
  };

  const deleteTag = async (tagId: string) => {
    if (!confirm('Are you sure you want to delete this tag? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tag deleted successfully"
      });
      
      fetchTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast({
        title: "Error",
        description: "Failed to delete tag",
        variant: "destructive"
      });
    }
  };

  const openCreateDialog = () => {
    setEditingTag(null);
    form.reset({
      name: '',
      color_hex: '#777777',
      is_global: true,
      category: 'Industry',
      filter_type: 'checkbox',
      sort_order: 0,
      is_featured: false
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (tag: Tag) => {
    setEditingTag(tag);
    form.reset({
      name: tag.name,
      color_hex: tag.color_hex,
      is_global: tag.is_global,
      category: tag.category || 'Industry',
      filter_type: tag.filter_type || 'checkbox',
      sort_order: tag.sort_order || 0,
      is_featured: tag.is_featured || false
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: TagForm) => {
    if (editingTag) {
      updateTag(editingTag.id, data);
    } else {
      createTag(data);
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
          <h1 className="text-3xl font-bold">Tag Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage categorized tags for products and vendors
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Create Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTag ? 'Edit Tag' : 'Create New Tag'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., AI SaaS" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="color_hex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            {...field}
                            className="w-12 h-10 rounded border border-input"
                          />
                          <Input
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="#777777"
                            className="flex-1"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sort_order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort Order</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="filter_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Filter Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="checkbox">Checkbox</SelectItem>
                            <SelectItem value="range">Range Slider</SelectItem>
                            <SelectItem value="select">Dropdown</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured Tag</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Show in product headers and priority areas
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="is_global"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Global Tag</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Make this tag available to all users
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingTag ? 'Update Tag' : 'Create Tag'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4" />
          <Select value={selectedCategory || 'all'} onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category} ({tags.filter(t => t.category === category).length})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg">
          {categories.map((category) => {
            const categoryTags = tags.filter(tag => 
              tag.category === category && 
              (!selectedCategory || selectedCategory === category)
            );
            
            if (categoryTags.length === 0 && selectedCategory) return null;
            if (categoryTags.length === 0) return (
              <div key={category} className="p-4 border-b last:border-b-0">
                <h3 className="font-semibold text-lg mb-2">{category}</h3>
                <p className="text-muted-foreground text-sm">No tags in this category</p>
              </div>
            );

            return (
              <Collapsible key={category} defaultOpen={!!selectedCategory || category === 'Industry'}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border-b hover:bg-muted/50">
                  <h3 className="font-semibold text-lg">{category} ({categoryTags.length})</h3>
                  <Plus className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tag</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead>Global</TableHead>
                        <TableHead>Filter Type</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryTags.map((tag) => (
                        <TableRow key={tag.id}>
                          <TableCell>
                            <div 
                              className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium text-white"
                              style={{ backgroundColor: tag.color_hex }}
                            >
                              {tag.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-6 h-6 rounded-full border"
                                style={{ backgroundColor: tag.color_hex }}
                              />
                              <span className="text-sm font-mono">{tag.color_hex}</span>
                            </div>
                          </TableCell>
                          <TableCell>{tag.sort_order}</TableCell>
                          <TableCell>{tag.is_featured ? '⭐' : '-'}</TableCell>
                          <TableCell>{tag.is_global ? 'Yes' : 'No'}</TableCell>
                          <TableCell>{tag.filter_type}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(tag)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => deleteTag(tag.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </div>
  );
}