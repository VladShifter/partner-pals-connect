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
  const [selectedTagsByCategory, setSelectedTagsByCategory] = useState<Record<string, string[]>>({});
  const [selectedSubtypes, setSelectedSubtypes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch products with vendor information and tags
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
              slug,
              category,
              color_hex
            )
          )
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match the expected format
      const transformedProducts = (productsData || []).map(product => ({
        id: product.id,
        title: product.name,
        vendor: product.vendors?.company_name || 'Unknown Vendor',
        niche: product.vendors?.niche || 'General',
        pitch: product.description || product.vendors?.pitch || '',
        tags: product.product_tags?.map(pt => pt.tags?.name).filter(Boolean) || [product.vendors?.niche || 'General'],
        slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        image: product.vendors?.banner_image_url || getProductImage(product.vendors?.niche),
        partner_terms: getDefaultPartnerTerms(),
        price: product.price,
        commission_rate: product.commission_rate,
        tagData: product.product_tags?.map(pt => pt.tags).filter(Boolean) || []
      }));

      setProducts(transformedProducts);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
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

  const allTags = Array.from(new Set(products.flatMap(p => p.tags)));
  const allTagData = Array.from(
    new Map(products.flatMap(p => p.tagData).map(tag => [tag.id, tag])).values()
  );
  
  // Group tags by category
  const tagsByCategory = allTagData.reduce((acc, tag) => {
    const category = tag.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tag);
    return acc;
  }, {} as Record<string, any[]>);
  
  const partnerSubtypes = ["white_label", "reseller", "agent", "affiliate", "referral", "advisor"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.niche.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Check if product matches any selected tags from any category
    const selectedTagIds = Object.values(selectedTagsByCategory).flat();
    const matchesTags = selectedTagIds.length === 0 || 
      product.tagData.some(tag => selectedTagIds.includes(tag.id));

    const matchesSubtypes = selectedSubtypes.length === 0 || 
      selectedSubtypes.some(subtype => product.partner_terms[subtype]);

    return matchesSearch && matchesTags && matchesSubtypes;
  });

  const toggleTag = (category: string, tagId: string) => {
    setSelectedTagsByCategory(prev => {
      const categoryTags = prev[category] || [];
      const newCategoryTags = categoryTags.includes(tagId)
        ? categoryTags.filter(id => id !== tagId)
        : [...categoryTags, tagId];
      
      return {
        ...prev,
        [category]: newCategoryTags
      };
    });
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
    setSelectedTagsByCategory({});
    setSelectedSubtypes([]);
    setSearchQuery("");
    setSearchParams({});
  };

  const getTotalSelectedTags = () => {
    return Object.values(selectedTagsByCategory).flat().length;
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

            {/* Advanced Filters */}
            <Card className="p-4">
              <div className="space-y-4">
                {/* Quick Filters Row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {/* Business Model */}
                  {tagsByCategory['Business Model'] && (
                    <div>
                      <select 
                        className="w-full p-2 border rounded-md text-sm"
                        value={selectedTagsByCategory['Business Model']?.[0] || ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            toggleTag('Business Model', e.target.value);
                          }
                        }}
                      >
                        <option value="">Business Model (0)</option>
                        {tagsByCategory['Business Model'].map(tag => (
                          <option key={tag.id} value={tag.id}>{tag.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Client Segment */}
                  {tagsByCategory['Client Segment'] && (
                    <div>
                      <select 
                        className="w-full p-2 border rounded-md text-sm"
                        value={selectedTagsByCategory['Client Segment']?.[0] || ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            toggleTag('Client Segment', e.target.value);
                          }
                        }}
                      >
                        <option value="">Client Segment (0)</option>
                        {tagsByCategory['Client Segment'].map(tag => (
                          <option key={tag.id} value={tag.id}>{tag.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Industry */}
                  {tagsByCategory['Industry'] && (
                    <div>
                      <select 
                        className="w-full p-2 border rounded-md text-sm"
                        value={selectedTagsByCategory['Industry']?.[0] || ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            toggleTag('Industry', e.target.value);
                          }
                        }}
                      >
                        <option value="">Industry (0)</option>
                        {tagsByCategory['Industry'].map(tag => (
                          <option key={tag.id} value={tag.id}>{tag.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Partner Type */}
                  {tagsByCategory['Partner Type'] && (
                    <div>
                      <select 
                        className="w-full p-2 border rounded-md text-sm"
                        value={selectedTagsByCategory['Partner Type']?.[0] || ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            toggleTag('Partner Type', e.target.value);
                          }
                        }}
                      >
                        <option value="">Partner Type (0)</option>
                        {tagsByCategory['Partner Type'].map(tag => (
                          <option key={tag.id} value={tag.id}>{tag.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Monthly Earning */}
                  <div>
                    <select className="w-full p-2 border rounded-md text-sm">
                      <option value="">Monthly Earning</option>
                      <option value="0-1000">$0 - $1,000</option>
                      <option value="1000-5000">$1,000 - $5,000</option>
                      <option value="5000-20000">$5,000 - $20,000</option>
                      <option value="20000+">$20,000+</option>
                    </select>
                  </div>
                </div>

                {/* Advanced Filters Toggle */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Advanced Filters
                    {showAdvancedFilters ? ' ▲' : ' ▼'}
                  </Button>
                  
                  {getTotalSelectedTags() > 0 && (
                    <span className="text-sm text-gray-600">
                      {getTotalSelectedTags()} filters applied
                    </span>
                  )}
                </div>

                {/* Advanced Filters Section */}
                {showAdvancedFilters && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                    {/* Geography */}
                    {tagsByCategory['Geography'] && (
                      <div>
                        <select 
                          className="w-full p-2 border rounded-md text-sm"
                          value={selectedTagsByCategory['Geography']?.[0] || ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              toggleTag('Geography', e.target.value);
                            }
                          }}
                        >
                          <option value="">Geography (0)</option>
                          {tagsByCategory['Geography'].map(tag => (
                            <option key={tag.id} value={tag.id}>{tag.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Hosting */}
                    {tagsByCategory['Hosting'] && (
                      <div>
                        <select 
                          className="w-full p-2 border rounded-md text-sm"
                          value={selectedTagsByCategory['Hosting']?.[0] || ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              toggleTag('Hosting', e.target.value);
                            }
                          }}
                        >
                          <option value="">Hosting (0)</option>
                          {tagsByCategory['Hosting'].map(tag => (
                            <option key={tag.id} value={tag.id}>{tag.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Product Scale */}
                    {tagsByCategory['Product Scale'] && (
                      <div>
                        <select 
                          className="w-full p-2 border rounded-md text-sm"
                          value={selectedTagsByCategory['Product Scale']?.[0] || ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              toggleTag('Product Scale', e.target.value);
                            }
                          }}
                        >
                          <option value="">Product Scale (0)</option>
                          {tagsByCategory['Product Scale'].map(tag => (
                            <option key={tag.id} value={tag.id}>{tag.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Quality */}
                    {tagsByCategory['Quality'] && (
                      <div>
                        <select 
                          className="w-full p-2 border rounded-md text-sm"
                          value={selectedTagsByCategory['Quality']?.[0] || ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              toggleTag('Quality', e.target.value);
                            }
                          }}
                        >
                          <option value="">Quality (0)</option>
                          {tagsByCategory['Quality'].map(tag => (
                            <option key={tag.id} value={tag.id}>{tag.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Setup */}
                    {tagsByCategory['Setup'] && (
                      <div>
                        <select 
                          className="w-full p-2 border rounded-md text-sm"
                          value={selectedTagsByCategory['Setup']?.[0] || ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              toggleTag('Setup', e.target.value);
                            }
                          }}
                        >
                          <option value="">Setup (0)</option>
                          {tagsByCategory['Setup'].map(tag => (
                            <option key={tag.id} value={tag.id}>{tag.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Technology */}
                    {tagsByCategory['Technology'] && (
                      <div>
                        <select 
                          className="w-full p-2 border rounded-md text-sm"
                          value={selectedTagsByCategory['Technology']?.[0] || ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              toggleTag('Technology', e.target.value);
                            }
                          }}
                        >
                          <option value="">Technology (0)</option>
                          {tagsByCategory['Technology'].map(tag => (
                            <option key={tag.id} value={tag.id}>{tag.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Use-Case */}
                    {tagsByCategory['Use-Case'] && (
                      <div>
                        <select 
                          className="w-full p-2 border rounded-md text-sm"
                          value={selectedTagsByCategory['Use-Case']?.[0] || ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              toggleTag('Use-Case', e.target.value);
                            }
                          }}
                        >
                          <option value="">Use-Case (0)</option>
                          {tagsByCategory['Use-Case'].map(tag => (
                            <option key={tag.id} value={tag.id}>{tag.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Vendor Support */}
                    {tagsByCategory['Vendor Support'] && (
                      <div>
                        <select 
                          className="w-full p-2 border rounded-md text-sm"
                          value={selectedTagsByCategory['Vendor Support']?.[0] || ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              toggleTag('Vendor Support', e.target.value);
                            }
                          }}
                        >
                          <option value="">Vendor Support (0)</option>
                          {tagsByCategory['Vendor Support'].map(tag => (
                            <option key={tag.id} value={tag.id}>{tag.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Setup Fee */}
                    <div>
                      <select className="w-full p-2 border rounded-md text-sm">
                        <option value="">Setup Fee</option>
                        <option value="0">$0</option>
                        <option value="1-499">$1 - $499</option>
                        <option value="500-999">$500 - $999</option>
                        <option value="1000+">$1,000+</option>
                      </select>
                    </div>
                  </div>
                )}

                {(getTotalSelectedTags() > 0 || selectedSubtypes.length > 0 || searchQuery) && (
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
