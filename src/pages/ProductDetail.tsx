
import { useState } from "react";
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
import { Building, MessageSquare, ExternalLink, ArrowLeft, Users, DollarSign, FileText, Calculator, Star, Check, TrendingUp, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [calculatorValues, setCalculatorValues] = useState({
    price: 1000,
    deals: 5,
    margin: 25
  });

  // Mock data - TODO: Replace with Supabase data
  const product = {
    id: "1",
    title: "CloudCRM Pro",
    vendor: "TechFlow Solutions", 
    vendor_id: "vendor-1",
    niche: "SaaS",
    pitch: "All-in-one CRM solution for growing businesses with advanced automation and analytics. CloudCRM Pro helps you manage leads, track sales, and build stronger customer relationships with powerful AI-driven insights.",
    demo_video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["CRM", "SaaS", "Automation", "Analytics", "AI", "Sales"],
    income_range: {
      minimum: 7800,
      maximum: 56000
    },
    features: [
      "Price Monitoring by Region - Track competitor prices on specific products across different cities",
      "Location Expansion - Advise brands on where to open new stores based on traffic flows, competition, and spending potential",
      "Market Share Tracking - Show a business their share of foot traffic or sales volume vs. competitors",
      "Brand Perception Insights - Compare brand strength across regions and uncover opportunities to reposition",
      "Product Benchmarking - Reveal gaps in the product mix compared to market leaders"
    ],
    reseller_benefits: [
      "One of the very few platforms in the world offering this level of offline analytics",
      "Trusted by top global retail and F&B chains — already in use across 215+ countries",
      "Average deal size starts at $30K+",
      "Fully managed: you sell, the platform handles insights, dashboards, and support",
      "Enterprise-grade sales kits, demo access, and real use-case examples provided",
      "Up to 75% reseller discount = huge margin potential even on high-ticket sales"
    ],
    ideal_resellers: [
      "FMCG, HORECA and Retail Experts and Sales Reps",
      "Retail Strategy Consultants", 
      "Franchise Developers",
      "Market Research Agencies",
      "Data-Driven Business Advisors",
      "Expansion/Localization Experts"
    ],
    getting_customers: [
      "Demo Calls – Show course generation on the first meeting",
      "Corporate Networks – Target companies investing in training",
      "Social Media – Share success stories and platform benefits",
      "Email Campaigns – Highlight 40% reduction in onboarding time",
      "Industry Events – Showcase capabilities to HR decision-makers"
    ],
    launch_steps: [
      "Book a demo – see how the platform works",
      "Get materials – pitch decks, use cases, pricing logic",
      "Bring clients or pitch directly",
      "Earn up to 25% per deal"
    ],
    partner_terms: {
      white_label: { 
        margin_pct: 30, 
        notes: "Full white-label available with custom branding, dedicated support, and API access" 
      },
      reseller: { 
        margin_pct: 25, 
        notes: "Volume discounts available, marketing materials provided, sales training included" 
      },
      affiliate: { 
        margin_pct: 15, 
        notes: "Marketing materials provided, real-time tracking, monthly payouts" 
      }
    },
    vendor_details: {
      website: "https://techflow.com",
      description: "TechFlow Solutions is a leading provider of business automation tools, serving over 10,000 companies worldwide.",
      founded: "2019",
      employees: "50-200"
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
                  <span className="text-muted-foreground">{product.vendor}</span>
                  <Badge variant="outline">{product.niche}</Badge>
                </div>
                <CardTitle className="text-3xl">{product.title}</CardTitle>
                <CardDescription className="text-lg">
                  {product.pitch}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <Button onClick={handleStartChat} size="lg">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Apply
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
                  <iframe
                    src={product.demo_video}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>

            {/* Partnership Terms & Calculator - Moved up here */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Partnership Opportunities
                </CardTitle>
                <CardDescription>
                  Available partnership models and earnings calculator
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={Object.keys(product.partner_terms)[0]} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    {Object.keys(product.partner_terms).map(type => (
                      <TabsTrigger key={type} value={type}>
                        {formatPartnerType(type)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {Object.entries(product.partner_terms).map(([type, terms]) => (
                    <TabsContent key={type} value={type} className="mt-4">
                      <div className="bg-accent rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-lg">{formatPartnerType(type)}</h4>
                          <Badge variant="outline" className="text-lg px-3 py-1">
                            {type === 'white_label' 
                              ? 'Up to 300% margin rate' 
                              : `${terms.margin_pct}% Commission`
                            }
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{terms.notes}</p>
                      </div>

                      {/* Earnings Calculator */}
                      <div className="bg-card border rounded-lg p-4">
                        <h4 className="font-semibold text-lg mb-4 flex items-center">
                          <Calculator className="w-5 h-5 mr-2" />
                          Earnings Calculator
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <Label htmlFor="deal-price">Average Deal Price ($)</Label>
                            <Input
                              id="deal-price"
                              type="number"
                              value={calculatorValues.price}
                              onChange={(e) => setCalculatorValues({...calculatorValues, price: parseInt(e.target.value) || 0})}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="deals-per-month">Deals per Month</Label>
                            <Input
                              id="deals-per-month"
                              type="number"
                              value={calculatorValues.deals}
                              onChange={(e) => setCalculatorValues({...calculatorValues, deals: parseInt(e.target.value) || 0})}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>{type === 'white_label' ? 'Your Margin (%)' : 'Commission Rate'}</Label>
                            {type === 'white_label' ? (
                              <Input
                                type="number"
                                value={calculatorValues.margin}
                                onChange={(e) => setCalculatorValues({...calculatorValues, margin: parseInt(e.target.value) || 0})}
                                className="mt-1"
                                placeholder="Enter margin %"
                                min="0"
                                max="300"
                              />
                            ) : (
                              <div className="mt-1 p-2 bg-muted rounded text-center font-medium">
                                {terms.margin_pct}%
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="bg-primary/10 rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">Estimated Annual Earnings</div>
                            <div className="text-2xl font-bold text-primary">
                              ${((calculatorValues.price * calculatorValues.deals * (type === 'white_label' ? calculatorValues.margin : terms.margin_pct) * 12) / 100).toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Monthly: ${((calculatorValues.price * calculatorValues.deals * (type === 'white_label' ? calculatorValues.margin : terms.margin_pct)) / 100).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

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
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
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
                  {product.reseller_benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
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
                  {product.ideal_resellers.map((reseller, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{reseller}</span>
                    </li>
                  ))}
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
                  {product.getting_customers.map((method, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{method}</span>
                    </li>
                  ))}
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
                  {product.launch_steps.map((step, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

          </div>

          {/* Fixed Sidebar */}
          <div className="lg:sticky lg:top-8 lg:h-fit space-y-6">
            {/* Vendor Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Vendor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-foreground">{product.vendor}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{product.vendor_details.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Founded</span>
                    <div className="font-medium">{product.vendor_details.founded}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Team Size</span>
                    <div className="font-medium">{product.vendor_details.employees}</div>
                  </div>
                </div>

                {/* Income Information */}
                <div className="bg-primary/10 rounded-lg p-4">
                  <h5 className="font-medium text-primary mb-2">Earning Potential</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-primary/80">Minimum result:</span>
                      <span className="font-medium text-primary">${product.income_range.minimum.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary/80">Best Result for now:</span>
                      <span className="font-medium text-primary">${product.income_range.maximum.toLocaleString()}/mo</span>
                    </div>
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
                          Fill out this form to apply for a partnership with {product.vendor}
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
