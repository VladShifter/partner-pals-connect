import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Star, 
  DollarSign, 
  Users, 
  TrendingUp, 
  ExternalLink,
  Building,
  Target,
  Award
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  image?: string;
  commission_rate?: number;
  average_deal_size?: number;
  annual_income_potential?: number;
  setup_fee?: number;
  extended_description?: string;
}

interface ProductPreviewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductPreviewModal = ({ product, isOpen, onClose }: ProductPreviewModalProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!product || loading) {
    return null;
  }

  // Function to get category colors (same as ProductCard)
  const getCategoryColors = (category: string | null) => {
    const colorPalettes = {
      'Business Model': { bg: '#F8FAFF', border: '#E8EEFF', text: '#6366F1' },
      'Technology': { bg: '#FDFAFF', border: '#F3EAFF', text: '#8B5CF6' },
      'Client Segment': { bg: '#F8FDF9', border: '#E8F7ED', text: '#10B981' },
      'Industry': { bg: '#FFFCF5', border: '#FEF7E0', text: '#F59E0B' },
      'Quality': { bg: '#FFF9F9', border: '#FEE8E8', text: '#EF4444' },
      'Earning': { bg: '#F7FDF9', border: '#E6F7ED', text: '#059669' },
      'Partner Type': { bg: '#F9FAFB', border: '#E5E7EB', text: '#4B5563' },
    };
    
    return colorPalettes[category as keyof typeof colorPalettes] || 
           { bg: '#FAFAFA', border: '#E5E5E5', text: '#525252' };
  };

  // Get basic product type description
  const getProductTypeDescription = () => {
    const businessModelTag = product.tags?.find(tag => tag.category === 'Business Model');
    const technologyTag = product.tags?.find(tag => tag.category === 'Technology');
    const industryTag = product.tags?.find(tag => tag.category === 'Industry');
    
    let description = '';
    if (technologyTag) description += technologyTag.name;
    if (businessModelTag) description += (description ? ' ' : '') + businessModelTag.name;
    if (industryTag) description += ` for ${industryTag.name}`;
    
    return description || 'Business Solution';
  };

  // Get key benefit tags
  const getBenefitTags = () => {
    const tags = [];
    
    // Add earning potential
    if (product.annual_income_potential) {
      const monthlyIncome = product.annual_income_potential / 12;
      const range = monthlyIncome < 1000 ? 'up to $1K/month' :
                   monthlyIncome <= 4999 ? '$1K–5K/month' :
                   monthlyIncome <= 19999 ? '$5K–20K/month' :
                   monthlyIncome <= 99999 ? '$20K–100K/month' : '$100K+/month';
      tags.push({ 
        name: `Earn ${range}`, 
        icon: DollarSign, 
        color: '#10B981',
        category: 'earning'
      });
    }

    // Add partner types
    const partnerTypes = Object.keys(product.partner_terms);
    if (partnerTypes.includes('white_label')) {
      tags.push({ 
        name: 'White Label Available', 
        icon: Building, 
        color: '#8B5CF6',
        category: 'partner'
      });
    }
    if (partnerTypes.includes('reseller')) {
      tags.push({ 
        name: 'Reseller Program', 
        icon: Users, 
        color: '#3B82F6',
        category: 'partner'
      });
    }
    if (partnerTypes.includes('affiliate')) {
      tags.push({ 
        name: 'Affiliate Program', 
        icon: Target, 
        color: '#F59E0B',
        category: 'partner'
      });
    }

    // Add commission rate
    if (product.commission_rate) {
      tags.push({ 
        name: `${product.commission_rate}% Commission`, 
        icon: TrendingUp, 
        color: '#059669',
        category: 'commission'
      });
    }

    // Add quality tag if exists
    const qualityTag = product.tags?.find(tag => tag.category === 'Quality');
    if (qualityTag) {
      tags.push({ 
        name: qualityTag.name, 
        icon: Award, 
        color: '#EF4444',
        category: 'quality'
      });
    }

    return tags;
  };

  // Get ideal partner description
  const getIdealPartnerDescription = () => {
    const clientSegmentTag = product.tags?.find(tag => tag.category === 'Client Segment');
    const partnerTypes = Object.keys(product.partner_terms);
    
    let description = 'Perfect for ';
    
    if (partnerTypes.includes('white_label')) {
      description += 'agencies and consultants looking for white-label solutions';
    } else if (partnerTypes.includes('reseller')) {
      description += 'sales professionals and business development teams';
    } else {
      description += 'marketing professionals and affiliate marketers';
    }

    if (clientSegmentTag) {
      description += ` targeting ${clientSegmentTag.name.toLowerCase()}`;
    }

    return description;
  };

  const productImage = product.image || `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=300&fit=crop&crop=center`;
  const benefitTags = getBenefitTags();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {getProductTypeDescription()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Product Image */}
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={productImage}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-3 left-3">
              <Badge className="bg-black/70 text-white border-0 backdrop-blur-sm">
                {product.title}
              </Badge>
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">What is this product?</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.pitch}
            </p>
          </div>

          {/* Key Benefits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Key Benefits for Partners</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {benefitTags.map((tag, index) => {
                const IconComponent = tag.icon;
                return (
                  <Card key={index} className="border-l-4" style={{ borderLeftColor: tag.color }}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${tag.color}15` }}
                        >
                          <IconComponent 
                            className="w-5 h-5" 
                            style={{ color: tag.color }}
                          />
                        </div>
                        <span className="font-medium text-gray-900">{tag.name}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Ideal Partner Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Perfect For</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-blue-800 leading-relaxed">
                  {getIdealPartnerDescription()}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            {isAuthenticated ? (
              <>
                <Button asChild className="flex-1">
                  <Link to={`/product/${product.slug}`} onClick={onClose}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Details
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/chat" onClick={onClose}>
                    Start Partnership Chat
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="flex-1">
                  <Link to="/signup" onClick={onClose}>
                    <Star className="w-4 h-4 mr-2" />
                    Sign Up to Learn More
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/login" onClick={onClose}>
                    Already have an account?
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Small disclaimer for non-authenticated users */}
          {!isAuthenticated && (
            <div className="text-xs text-gray-500 text-center pt-2 border-t">
              Create a free account to access full product details, pricing information, and start partnership conversations
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPreviewModal;