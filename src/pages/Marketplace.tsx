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
import { Search, Filter, Grid, List, X } from "lucide-react";

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSubtypes, setSelectedSubtypes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
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

      // Transform data to match the expected format
      const transformedProducts = (productsData || []).map(product => {
        const tags = product.product_tags?.map(pt => pt.tags).filter(Boolean) || [];
        
        return {
          id: product.id,
          title: product.name,
          vendor: product.vendors?.company_name || 'Unknown Vendor',
          niche: product.vendors?.niche || 'General',
          pitch: product.description || product.vendors?.pitch || '',
          tags: tags,
          slug: product.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '',
          partner_terms: getDefaultPartnerTerms(),
          image: getProductImage(product.vendors?.niche),
          commission_rate: product.commission_rate,
          average_deal_size: product.average_deal_size,
          annual_income_potential: product.annual_income_potential
        };
      });

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
      'Cybersecurity': "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=240&fit=crop&crop=center"
    };
    return imageMap[niche || 'SaaS'] || imageMap['SaaS'];
  };

  const getDefaultPartnerTerms = () => ({
    white_label: { margin_pct: 30, notes: "Full white-label available" },
    reseller: { margin_pct: 25, notes: "Volume discounts available" },
    affiliate: { margin_pct: 15, notes: "Marketing materials provided" }
  });

  // Calculate all available tags and categories
  const allTags = Array.from(new Set(products.flatMap(product => 
    product.tags?.map(tag => tag.name) || []
  )));

  const tagsByCategory = products.reduce((acc, product) => {
    product.tags?.forEach(tag => {
      const category = tag.category || 'Other';
      if (!acc[category]) acc[category] = new Set();
      acc[category].add(tag.name);
    });
    return acc;
  }, {} as Record<string, Set<string>>);

  const partnerSubtypes = ["white_label", "reseller", "affiliate"];

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

    return matchesSearch && matchesTags && matchesSubtypes;
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

            {/* Filter Tags by Category */}
            <Card className="p-4">
              <div className="space-y-4">
                {Object.entries(tagsByCategory).length > 0 ? (
                  Object.entries(tagsByCategory).map(([category, tagSet]) => (
                    <div key={category}>
                      <h3 className="font-medium text-gray-900 mb-2">{category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(tagSet as Set<string>).map((tag: string) => (
                          <Badge
                            key={tag}
                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">All Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Partner Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {partnerSubtypes.map(subtype => (
                      <Badge
                        key={subtype}
                        variant={selectedSubtypes.includes(subtype) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleSubtype(subtype)}
                      >
                        {subtype.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>

                {(selectedTags.length > 0 || selectedSubtypes.length > 0 || searchQuery) && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
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