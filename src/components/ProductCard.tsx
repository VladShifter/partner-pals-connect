
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, MessageSquare, ExternalLink, Play } from "lucide-react";

interface Product {
  id: string;
  title: string;
  vendor: string;
  niche: string;
  pitch: string;
  tags: string[];
  slug: string;
  partner_terms: Record<string, { margin_pct: number; notes: string }>;
  image?: string;
}

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
}

const ProductCard = ({ product, viewMode }: ProductCardProps) => {
  const availablePartnerTypes = Object.keys(product.partner_terms);

  // Default image if none provided
  const productImage = product.image || `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=240&fit=crop&crop=center`;

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex space-x-4 flex-1">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img 
                  src={productImage}
                  alt={product.title}
                  className="w-24 h-16 object-cover rounded-md border"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{product.vendor}</span>
                  <Badge variant="outline" className="text-xs">{product.niche}</Badge>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link to={`/product/${product.slug}`} className="hover:text-blue-600 transition-colors">
                    {product.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 mb-3 line-clamp-2">{product.pitch}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.tags.slice(0, 4).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {product.tags.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{product.tags.length - 4} more
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-gray-600">
                  Partner opportunities: {availablePartnerTypes.join(", ").replace(/_/g, " ")}
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
      {/* Product Image */}
      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
        <img 
          src={productImage}
          alt={product.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <Building className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{product.vendor}</span>
          <Badge variant="outline" className="text-xs">{product.niche}</Badge>
        </div>
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
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {product.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{product.tags.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="text-xs text-gray-600">
            <div className="font-medium mb-1">Available for:</div>
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
