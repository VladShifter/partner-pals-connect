
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Grid, List, X, ChevronDown, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSubtypes, setSelectedSubtypes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products for marketplace...');
      
      // Fetch all tags first
      const { data: tagsData, error: tagsError } = await supabase
        .from('tags')
        .select('*')
        .eq('is_global', true)
        .order('category', { ascending: true })
        .order('sort_order', { ascending: true });

      if (tagsError) throw tagsError;
      setAllTags(tagsData || []);
      
      // Fetch products with vendor and tags information
      const { data: productsData, error } = await supabase
        .from('products')
        .select(`
          *,
          vendors (
            company_name,
            niche,
            pitch,
            website,
            banner_image_url
          ),
          product_tags (
            tags (
              id,
              name,
              color_hex,
              category,
              is_featured,
              sort_order
            )
          )
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Raw products data:', productsData);

      // Transform data to match the expected format
      const transformedProducts = (productsData || []).map(product => {
        const tags = product.product_tags?.map(pt => pt.tags).filter(Boolean) || [];
        
        // CRITICAL: Use actual product image_url from database, fallback to niche-based image only if no image_url
        const productImage = product.image_url || getProductImage(product.vendors?.niche);
        
        console.log(`Product: ${product.name}`, {
          database_image_url: product.image_url,
          vendor_niche: product.vendors?.niche,
          final_image: productImage,
          using_database_image: !!product.image_url
        });
        
        return {
          id: product.id,
          title: product.name,
          vendor: product.vendors?.company_name || 'Unknown Vendor',
          niche: product.vendors?.niche || 'General',
          pitch: product.description || product.vendors?.pitch || '',
          tags: tags,
          slug: product.slug || product.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '',
          partner_terms: getDefaultPartnerTerms(),
          image: productImage, // This is the final image that will be displayed
          commission_rate: product.commission_rate,
          average_deal_size: product.average_deal_size,
          annual_income_potential: product.annual_income_potential,
          setup_fee: product.setup_fee
        };
      });

      console.log('Transformed products for marketplace:', transformedProducts.map(p => ({
        name: p.title,
        image: p.image,
        hasCustomImage: p.image && !p.image.includes('unsplash.com')
      })));

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (niche: string | undefined) => {
    const imageMap: { [key: string]: string } = {
      'SaaS': "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=240&fit=crop&crop=center",
      'E-commerce': "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=240&fit=crop&crop=center",
      'Cybersecurity': "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=240&fit=crop&crop=center",
      'EdTech': "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=240&fit=crop&crop=center"
    };
    return imageMap[niche || 'SaaS'] || imageMap['SaaS'];
  };

  const getDefaultPartnerTerms = () => ({
    white_label: { margin_pct: 30, notes: "Full white-label available" },
    reseller: { margin_pct: 25, notes: "Volume discounts available" },
    affiliate: { margin_pct: 15, notes: "Marketing materials provided" }
  });

  // Group all tags by category
  const tagsByCategory = allTags.reduce((acc, tag: any) => {
    const category = tag.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(tag);
    return acc;
  }, {} as Record<string, any[]>);

  // Basic filter categories
  const basicCategories = ['Business Model', 'Client Segment', 'Industry', 'Partner Type'];
  const basicTags = Object.fromEntries(
    Object.entries(tagsByCategory).filter(([category]) => basicCategories.includes(category))
  );
  
  const advancedTags = Object.fromEntries(
    Object.entries(tagsByCategory).filter(([category]) => !basicCategories.includes(category))
  );

  // Monthly earning ranges
  const monthlyEarningRanges = [
    { label: '$1,000+ / month', min: 12000 },
    { label: '$5,000+ / month', min: 60000 },
    { label: '$10,000+ / month', min: 120000 },
    { label: '$30,000+ / month', min: 360000 },
    { label: '$50,000+ / month', min: 600000 }
  ];

  // Setup fee ranges
  const setupFeeRanges = [
    { label: 'Free ($0)', min: 0, max: 0 },
    { label: 'Low ($1-$499)', min: 1, max: 499 },
    { label: 'Medium ($500-$999)', min: 500, max: 999 },
    { label: 'High ($1,000+)', min: 1000, max: Infinity }
  ];

  const partnerSubtypes = ["white_label", "reseller", "affiliate"];

  // Additional filter state
  const [selectedEarningRange, setSelectedEarningRange] = useState<string>("");
  const [selectedSetupFeeRange, setSelectedSetupFeeRange] = useState<string>("");

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.pitch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags?.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => product.tags?.some(t => t.name === tag));

    const matchesSubtypes = selectedSubtypes.length === 0 || 
      selectedSubtypes.some(subtype => product.partner_terms[subtype]);

    const matchesEarningRange = !selectedEarningRange || 
      (product.annual_income_potential && 
       product.annual_income_potential >= monthlyEarningRanges.find(r => r.label === selectedEarningRange)?.min);

    const matchesSetupFeeRange = !selectedSetupFeeRange || (() => {
      const range = setupFeeRanges.find(r => r.label === selectedSetupFeeRange);
      const fee = product.setup_fee || 0;
      return range && fee >= range.min && fee <= range.max;
    })();

    return matchesSearch && matchesTags && matchesSubtypes && matchesEarningRange && matchesSetupFeeRange;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleSubtype = (subtype: string) => {
    setSelectedSubtypes(prev => 
      prev.includes(subtype) 
        ? prev.filter(s => s !== subtype)
        : [...prev, subtype]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedSubtypes([]);
    setSelectedEarningRange("");
    setSelectedSetupFeeRange("");
    setSearchQuery("");
    setSearchParams({});
  };

  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Marketplace</h1>
            <p className="text-gray-600">Discover products and start partnership conversations</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search products, vendors, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <Card className="p-4">
              <div className="space-y-4">
                {/* Basic Filters */}
                <div className="flex flex-wrap gap-4 items-center">
                  {/* Basic Category Filters */}
                  {Object.entries(basicTags).map(([category, tags]) => {
                    const categoryTags = tags as any[];
                    return (
                      <div key={category} className="min-w-[200px]">
                        <Select
                          value={selectedTags.find(tag => categoryTags.some((t: any) => t.name === tag)) || ""}
                          onValueChange={(value) => {
                            if (value) {
                              toggleTag(value);
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={`${category} (${selectedTags.filter(tag => categoryTags.some((t: any) => t.name === tag)).length})`} />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryTags.map((tag: any) => (
                              <SelectItem 
                                key={tag.id} 
                                value={tag.name}
                                className={selectedTags.includes(tag.name) ? "bg-primary/10" : ""}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span>{tag.name}</span>
                                  {selectedTags.includes(tag.name) && (
                                    <X className="w-3 h-3 ml-2" />
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}

                  {/* Monthly Earning Filter */}
                  <div className="min-w-[200px]">
                    <Select
                      value={selectedEarningRange}
                      onValueChange={setSelectedEarningRange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Monthly Earning" />
                      </SelectTrigger>
                      <SelectContent>
                        {monthlyEarningRanges.map((range) => (
                          <SelectItem key={range.label} value={range.label}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clear Filters Button */}
                  {(selectedTags.length > 0 || selectedSubtypes.length > 0 || selectedEarningRange || selectedSetupFeeRange) && (
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      <X className="w-4 h-4 mr-2" />
                      Clear Filters ({selectedTags.length + selectedSubtypes.length + (selectedEarningRange ? 1 : 0) + (selectedSetupFeeRange ? 1 : 0)})
                    </Button>
                  )}
                </div>

                {/* Advanced Options Toggle */}
                <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Advanced Filters
                      <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    <div className="flex flex-wrap gap-4 items-center">
                      {/* Advanced Category Filters */}
                      {Object.entries(advancedTags).map(([category, tags]) => {
                        const categoryTags = tags as any[];
                        return (
                          <div key={category} className="min-w-[200px]">
                            <Select
                              value={selectedTags.find(tag => categoryTags.some((t: any) => t.name === tag)) || ""}
                              onValueChange={(value) => {
                                if (value) {
                                  toggleTag(value);
                                }
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={`${category} (${selectedTags.filter(tag => categoryTags.some((t: any) => t.name === tag)).length})`} />
                              </SelectTrigger>
                              <SelectContent>
                                {categoryTags.map((tag: any) => (
                                  <SelectItem 
                                    key={tag.id} 
                                    value={tag.name}
                                    className={selectedTags.includes(tag.name) ? "bg-primary/10" : ""}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span>{tag.name}</span>
                                      {selectedTags.includes(tag.name) && (
                                        <X className="w-3 h-3 ml-2" />
                                      )}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      })}
                      
                      {/* Setup Fee Filter */}
                      <div className="min-w-[200px]">
                        <Select
                          value={selectedSetupFeeRange}
                          onValueChange={setSelectedSetupFeeRange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Setup Fee" />
                          </SelectTrigger>
                          <SelectContent>
                            {setupFeeRanges.map((range) => (
                              <SelectItem key={range.label} value={range.label}>
                                {range.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Selected Filters Display */}
              {(selectedTags.length > 0 || selectedSubtypes.length > 0 || selectedEarningRange || selectedSetupFeeRange) && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
                      <Badge
                        key={tag}
                        variant="default"
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                    {selectedSubtypes.map(subtype => (
                      <Badge
                        key={subtype}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => toggleSubtype(subtype)}
                      >
                        {subtype.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                    {selectedEarningRange && (
                      <Badge
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => setSelectedEarningRange("")}
                      >
                        {selectedEarningRange}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    )}
                    {selectedSetupFeeRange && (
                      <Badge
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => setSelectedSetupFeeRange("")}
                      >
                        {selectedSetupFeeRange}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Results */}
          <div className="mb-4 text-sm text-gray-600">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </div>

          {/* Product Grid */}
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                viewMode={viewMode}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
