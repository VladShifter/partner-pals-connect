
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building, MessageSquare, ExternalLink, ArrowLeft, Users, DollarSign, Calculator, Star, Check, TrendingUp, Zap, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PricingTiersSection } from "@/components/pricing/PricingTiersSection";
import { ROICalculator } from "@/components/ROICalculator";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [calculatorValues, setCalculatorValues] = useState({
    price: 1000,
    deals: 5,
    margin: 25
  });

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      
      // Convert slug to product name (cloudcrm-pro -> CloudCRM Pro)
      const productName = slug?.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ').replace('Crm', 'CRM') || '';
      
      console.log('Looking for product:', productName);
      
      // Fetch product by name
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${productName}%`)
        .eq('status', 'approved')
        .single();

      if (productError) {
        console.error('Error fetching product:', productError);
        setProduct(null);
        setLoading(false);
        return;
      }

      setProduct(productData);

      // Fetch vendor info
      if (productData.vendor_id) {
        const { data: vendorData, error: vendorError } = await supabase
          .from('vendors')
          .select('*')
          .eq('id', productData.vendor_id)
          .single();

        if (!vendorError && vendorData) {
          setVendor(vendorData);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async () => {
    // TODO: Implement chat creation with Supabase
    console.log("Starting chat for product:", product.id);
    
    // Simulate API call
    const threadId = "thread-123";
    toast({
      title: "Chat started!",
      description: "You can now discuss partnership opportunities.",
    });
    navigate(`/chat/${threadId}`);
  };

  const formatPartnerType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
            <Button onClick={() => navigate("/marketplace")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Mock partner terms for now - this should come from database later
  const partner_terms = {
    white_label: { 
      margin_pct: 30, 
      notes: "Full white-label available with custom branding, dedicated support, and API access" 
    },
    reseller: { 
      margin_pct: product.commission_rate || 25, 
      notes: "Volume discounts available, marketing materials provided, sales training included" 
    },
    affiliate: { 
      margin_pct: 15, 
      notes: "Marketing materials provided, real-time tracking, monthly payouts" 
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/marketplace")}
            className="p-0 h-auto text-primary hover:text-primary/80"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Marketplace
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Building className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">{vendor?.company_name || 'Unknown Vendor'}</span>
                  <Badge variant="outline">{vendor?.niche || 'General'}</Badge>
                </div>
                <CardTitle className="text-3xl">{product.name}</CardTitle>
                <CardDescription className="text-lg">
                  {product.description || 'No description available'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Extended Description */}
                <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    Start a thriving e-learning business under your own brand with zero hassle. Our fully white-label AI training platform lets you offer corporate learning solutions without managing content creation, assessment development, or support—we handle it all. Focus on growing your profits and brand!
                  </p>
                </div>

                {/* Clean Overview */}
                <div className="space-y-4 mb-6">
                  {/* Partner Types - Simple text with dots */}
                  <div>
                    <span className="text-sm text-muted-foreground">Perfect for: </span>
                    <span className="text-sm">IT Consultants • SaaS Resellers • Digital Agencies • System Integrators</span>
                  </div>

                  {/* Key Metrics - Subtle */}
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="font-semibold text-primary">$150K</span>
                      <span className="text-muted-foreground ml-1">annual potential</span>
                    </div>
                    <div>
                      <span className="font-semibold text-primary">75%</span>
                      <span className="text-muted-foreground ml-1">profit margin</span>
                    </div>
                  </div>

                  {/* Key Benefits - Simple list */}
                  <div className="text-sm text-muted-foreground">
                    Zero Investment • Fully Managed • 215+ Countries • Enterprise Ready
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleStartChat} size="lg">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href={vendor?.website_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Demo Video */}
            <Card>
              <CardHeader>
                <CardTitle>Product Demo</CardTitle>
                <CardDescription>
                  See how the platform works in action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden">
                  {vendor?.demo_video_file_url ? (
                    <video
                      src={vendor.demo_video_file_url}
                      controls
                      className="w-full h-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title="Product Demo"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ROI Calculator */}
            <ROICalculator 
              product={product}
            />

            {/* What are you reselling */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  What are you reselling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {product.features && product.features.length > 0 ? (
                    product.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">No features listed</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Why You Should Resell This */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Why You Should Resell This
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {product.reseller_benefits && product.reseller_benefits.length > 0 ? (
                    product.reseller_benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{benefit}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">No benefits listed</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Ideal for such resellers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Ideal for such resellers as:
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {product.ideal_resellers && product.ideal_resellers.length > 0 ? (
                    product.ideal_resellers.map((reseller, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{reseller}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">No ideal resellers listed</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Easy Ways to Get Customers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Easy Ways to Get Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {product.getting_customers && product.getting_customers.length > 0 ? (
                    product.getting_customers.map((method, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{method}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">No customer acquisition methods listed</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* How To Launch */}
            <Card>
              <CardHeader>
                <CardTitle>How To Launch</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {product.launch_steps && product.launch_steps.length > 0 ? (
                    product.launch_steps.map((step, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-foreground">{step}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">No launch steps listed</li>
                  )}
                </ol>
              </CardContent>
            </Card>

            {/* Pricing Tiers Section - at the bottom */}
            <PricingTiersSection 
              productId={product.id} 
              setupFee={product.setup_fee}
            />

          </div>

          {/* Fixed Sidebar */}
          <div className="lg:sticky lg:top-8 lg:h-fit space-y-6">
            {/* Reseller Opportunity Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Reseller Opportunity
                </CardTitle>
                <CardDescription>
                  Start earning with {product?.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Annual Income Potential</span>
                    <span className="font-bold text-green-600 text-lg">
                      ${product?.annual_income_potential?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Average Deal Size</span>
                    <span className="font-medium">${product?.average_deal_size?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Build from scratch</span>
                    <span className="font-medium text-red-600 line-through decoration-2">
                      ${product?.build_from_scratch_cost?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Income Information */}
                <div className="bg-primary/10 rounded-lg p-4">
                  <h5 className="font-medium text-primary mb-2">Earning Potential</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-primary/80">Minimum result:</span>
                      <span className="font-medium text-primary">$2,500/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary/80">Best Result for now:</span>
                      <span className="font-medium text-primary">$36,000/mo</span>
                    </div>
                  </div>
                </div>

                {/* Pricing Tiers Summary */}
                <PricingTiersSection 
                  productId={product.id} 
                  setupFee={product.setup_fee}
                  sidebarOnly={true}
                />

                {/* Value Propositions */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Easy Start
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      🛡️ Zero Risk
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      💰 High Margin
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      🔄 100% Refund
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        Apply
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Apply for Partnership</DialogTitle>
                        <DialogDescription>
                          Fill out this form to apply for a partnership with {vendor?.company_name || 'this vendor'}
                        </DialogDescription>
                      </DialogHeader>
                      <form className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" placeholder="Enter your full name" />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="Enter your email" />
                        </div>
                        <div>
                          <Label htmlFor="company">Company</Label>
                          <Input id="company" placeholder="Enter your company name" />
                        </div>
                        <div>
                          <Label htmlFor="experience">Experience</Label>
                          <Textarea 
                            id="experience" 
                            placeholder="Tell us about your experience in sales/partnerships..."
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="partnership-type">Preferred Partnership Type</Label>
                          <select className="w-full p-2 border rounded-md">
                            <option value="">Select partnership type</option>
                            <option value="reseller">Reseller</option>
                            <option value="affiliate">Affiliate</option>
                            <option value="white_label">White Label</option>
                          </select>
                        </div>
                        <Button type="submit" className="w-full">
                          Submit Application
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    onClick={handleStartChat} 
                    variant="outline" 
                    className="w-full bg-primary/5 border-primary/30 hover:bg-primary/10"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Start Chat
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
