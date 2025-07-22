
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Grid3X3, List, Search, Filter, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";

interface Tag {
  id: string;
  name: string;
  color_hex: string;
  category: string | null;
  is_featured: boolean;
  sort_order: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  commission_rate: number;
  status: string;
  slug: string;
  image_url: string | null;
  annual_income_potential: number | null;
  average_deal_size: number | null;
  vendor: {
    company_name: string;
    niche: string;
  };
  tags: Tag[];
}

const Marketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("");
  const [commissionRange, setCommissionRange] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchTags();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedTags, priceRange, commissionRange]);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('is_global', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const { data: productsData, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          commission_rate,
          status,
          slug,
          image_url,
          annual_income_potential,
          average_deal_size,
          vendor:vendors(company_name, niche)
        `)
        .eq('status', 'approved');

      if (error) throw error;

      // Fetch tags for each product
      const productsWithTags = await Promise.all(
        (productsData || []).map(async (product) => {
          const { data: tagData } = await supabase
            .from('product_tags')
            .select(`
              tag:tags(id, name, color_hex, category, is_featured, sort_order)
            `)
            .eq('product_id', product.id);

          const productTags = tagData?.map(pt => pt.tag).filter(Boolean) || [];
          
          return {
            ...product,
            vendor: Array.isArray(product.vendor) ? product.vendor[0] : product.vendor,
            tags: productTags
          };
        })
      );

      setProducts(productsWithTags);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.vendor?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(product =>
        selectedTags.some(tagId => product.tags.some(tag => tag.id === tagId))
      );
    }

    // Price filter
    if (priceRange) {
      filtered = filtered.filter(product => {
        if (!product.price) return false;
        const price = product.price;
        switch (priceRange) {
          case "0-100": return price <= 100;
          case "100-500": return price > 100 && price <= 500;
          case "500-1000": return price > 500 && price <= 1000;
          case "1000+": return price > 1000;
          default: return true;
        }
      });
    }

    // Commission filter
    if (commissionRange) {
      filtered = filtered.filter(product => {
        if (!product.commission_rate) return false;
        const commission = product.commission_rate;
        switch (commissionRange) {
          case "0-10": return commission <= 10;
          case "10-25": return commission > 10 && commission <= 25;
          case "25-50": return commission > 25 && commission <= 50;
          case "50+": return commission > 50;
          default: return true;
        }
      });
    }

    setFilteredProducts(filtered);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const mapProductForCard = (product: Product) => {
    // Генерируем фоллбэк изображение на основе ниши
    const fallbackImage = `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=240&fit=crop&crop=center`;
    
    return {
      id: product.id,
      title: product.name,
      vendor: product.vendor?.company_name || 'Unknown Vendor',
      niche: product.vendor?.niche || 'Technology',
      pitch: product.description || '',
      tags: product.tags,
      slug: product.slug,
      partner_terms: { reseller: { margin_pct: product.commission_rate || 0, notes: '' } },
      image: product.image_url || fallbackImage, // Используем image_url из базы данных или фоллбэк
      commission_rate: product.commission_rate,
      average_deal_size: product.average_deal_size,
      annual_income_potential: product.annual_income_potential
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const tagCategories = tags.reduce((acc, tag) => {
    const category = tag.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tag);
    return acc;
  }, {} as Record<string, Tag[]>);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Partner Marketplace</h1>
        <p className="text-lg text-gray-600">
          Discover partnership opportunities and grow your business
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products, vendors, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
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

        {/* Filters Panel */}
        {showFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Price Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All prices</SelectItem>
                    <SelectItem value="0-100">$0 - $100</SelectItem>
                    <SelectItem value="100-500">$100 - $500</SelectItem>
                    <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                    <SelectItem value="1000+">$1,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Commission Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Commission</label>
                <Select value={commissionRange} onValueChange={setCommissionRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All rates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All rates</SelectItem>
                    <SelectItem value="0-10">0% - 10%</SelectItem>
                    <SelectItem value="10-25">10% - 25%</SelectItem>
                    <SelectItem value="25-50">25% - 50%</SelectItem>
                    <SelectItem value="50+">50%+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <div className="space-y-3">
                  {Object.entries(tagCategories).map(([category, categoryTags]) => (
                    <div key={category}>
                      <h4 className="text-xs font-medium text-gray-500 mb-1">{category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {categoryTags.map((tag) => (
                          <Badge
                            key={tag.id}
                            variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleTag(tag.id)}
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedTags.length > 0 || priceRange || commissionRange) && (
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedTags([]);
                    setPriceRange("");
                    setCommissionRange("");
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </Card>
      ) : (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={mapProductForCard(product)}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
