import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ExternalLink, Play, Star } from "lucide-react";

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
  title: string;
  vendor: string;
  niche: string;
  pitch: string;
  tags: Tag[];
  slug: string;
  partner_terms: Record<string, { margin_pct: number; notes: string }>;
  image?: string; // This will contain either product.image_url or fallback image
  commission_rate?: number;
  average_deal_size?: number;
  annual_income_potential?: number;
}

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
}

const ProductCard = ({ product, viewMode }: ProductCardProps) => {
  const availablePartnerTypes = Object.keys(product.partner_terms);
  
  // Function to generate very light pastel colors based on category (Notion-style)
  const getCategoryColors = (category: string | null) => {
    const colorPalettes = {
      'Business Model': { bg: '#F8FAFF', border: '#E8EEFF', text: '#6366F1' }, // Very light indigo
      'Technology': { bg: '#FDFAFF', border: '#F3EAFF', text: '#8B5CF6' }, // Very light purple
      'Client Segment': { bg: '#F8FDF9', border: '#E8F7ED', text: '#10B981' }, // Very light green
      'Industry': { bg: '#FFFCF5', border: '#FEF7E0', text: '#F59E0B' }, // Very light amber
      'Quality': { bg: '#FFF9F9', border: '#FEE8E8', text: '#EF4444' }, // Very light red
      'Earning': { bg: '#F7FDF9', border: '#E6F7ED', text: '#059669' }, // Very light emerald
      'Partner Type': { bg: '#F9FAFB', border: '#E5E7EB', text: '#4B5563' }, // Very light gray
    };
    
    return colorPalettes[category as keyof typeof colorPalettes] || 
           { bg: '#FAFAFA', border: '#E5E5E5', text: '#525252' }; // Default very light gray
  };

  // Get key tags for overlay on image
  const getKeyTags = () => {
    const businessModelTag = product.tags?.find(tag => tag.category === 'Business Model');
    const technologyTag = product.tags?.find(tag => tag.category === 'Technology');
    const clientSegmentTag = product.tags?.find(tag => tag.category === 'Client Segment');
    
    return [businessModelTag, technologyTag, clientSegmentTag].filter(Boolean);
  };

  // Get display tags for content area
  const getDisplayTags = () => {
    const industryTag = product.tags?.find(tag => tag.category === 'Industry');
    const qualityTag = product.tags?.find(tag => tag.category === 'Quality');
    
    const tags = [];
    
    if (industryTag) tags.push(industryTag);
    
    // Add earning potential tag
    if (product.annual_income_potential) {
      const monthlyIncome = product.annual_income_potential / 12;
      const range = monthlyIncome < 1000 ? '<$1K/mo' :
                   monthlyIncome <= 4999 ? '$1K–5K/mo' :
                   monthlyIncome <= 19999 ? '$5K–20K/mo' :
                   monthlyIncome <= 99999 ? '$20K–100K/mo' : '$100K+/mo';
      tags.push({ name: `Earn from ${range}`, color_hex: '#10B981', category: 'Earning', id: 'earning' });
    }
    
    if (qualityTag) tags.push(qualityTag);
    
    return tags;
  };

  // Default image if none provided
  const productImage = product.image || `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=240&fit=crop&crop=center`;

  const keyTags = getKeyTags();
  const displayTags = getDisplayTags();

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex space-x-4 flex-1">
              {/* Product Image with Key Tags */}
              <div className="flex-shrink-0 relative">
                <img 
                  src={productImage}
                  alt={product.title}
                  className="w-24 h-16 object-cover rounded-md border"
                />
                {/* Key tags overlay */}
                <div className="absolute top-1 left-1 flex flex-wrap gap-1">
                  {keyTags.slice(0, 2).map((tag, index) => (
                    <Badge 
                      key={tag.id || `key-${index}`}
                      className="text-xs text-white border-0 bg-black/70 backdrop-blur-sm"
                    >
                      {tag.name === 'AI-powered' && <Star className="w-3 h-3 mr-1" />}
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex-1">
                {/* Product Title and Description */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link to={`/product/${product.slug}`} className="hover:text-blue-600 transition-colors">
                    {product.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 mb-3 line-clamp-2">{product.pitch}</p>
                
                {/* Display Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {displayTags.map((tag, index) => {
                    const colors = getCategoryColors(tag.category);
                    return (
                      <Badge 
                        key={tag.id || `display-${index}`} 
                        className="text-xs border"
                        style={{ 
                          backgroundColor: colors.bg,
                          borderColor: colors.border,
                          color: colors.text
                        }}
                      >
                        {tag.name}
                      </Badge>
                    );
                  })}
                </div>
                
                <div className="text-sm text-gray-600">
                  Partnership options: {availablePartnerTypes.join(", ").replace(/_/g, " ")}
                </div>
              </div>
            </div>
            
            <div className="ml-6 flex flex-col space-y-2">
              <Button size="sm" asChild>
                <Link to={`/product/${product.slug}`}>
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View Details
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Play className="w-4 h-4 mr-1" />
                Watch Demo
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-1" />
                Start Chat
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      {/* Product Image with Key Tags Overlay */}
      <div className="aspect-video w-full overflow-hidden rounded-t-lg relative">
        <img 
          src={productImage}
          alt={product.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        {/* Key tags overlay in top left corner */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {keyTags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={tag.id || `key-${index}`}
              className="text-xs text-white border-0 bg-black/70 backdrop-blur-sm"
            >
              {tag.name === 'AI-powered' && <Star className="w-3 h-3 mr-1" />}
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
      
      <CardHeader>
        {/* Product Title and Description (removed vendor name) */}
        <CardTitle className="text-lg">
          <Link to={`/product/${product.slug}`} className="hover:text-blue-600 transition-colors">
            {product.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {product.pitch}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Display Tags */}
          <div className="flex flex-wrap gap-1">
            {displayTags.map((tag, index) => {
              const colors = getCategoryColors(tag.category);
              return (
                <Badge 
                  key={tag.id || `display-${index}`} 
                  className="text-xs border"
                  style={{ 
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                >
                  {tag.name}
                </Badge>
              );
            })}
          </div>
          
          <div className="text-xs text-gray-600">
            <div className="font-medium mb-1">Partnership options:</div>
            <div>{availablePartnerTypes.join(", ").replace(/_/g, " ")}</div>
          </div>
          
          <div className="flex space-x-2">
            <Button size="sm" className="flex-1" asChild>
              <Link to={`/product/${product.slug}`}>
                View Details
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <Play className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;