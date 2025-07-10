
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, MessageSquare, ExternalLink, ArrowLeft, Users, DollarSign, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock data - TODO: Replace with Supabase data
  const product = {
    id: "1",
    title: "CloudCRM Pro",
    vendor: "TechFlow Solutions",
    vendor_id: "vendor-1",
    niche: "SaaS",
    pitch: "All-in-one CRM solution for growing businesses with advanced automation and analytics. CloudCRM Pro helps you manage leads, track sales, and build stronger customer relationships with powerful AI-driven insights.",
    demo_url: "https://demo.cloudcrm.com",
    tags: ["CRM", "SaaS", "Automation", "Analytics", "AI", "Sales"],
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
      <div className="min-h-screen bg-gray-50">
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/marketplace")}
            className="p-0 h-auto text-blue-600 hover:text-blue-700"
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
                  <Building className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">{product.vendor}</span>
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
                    Start Partnership Chat
                  </Button>
                  {product.demo_url && (
                    <Button variant="outline" size="lg" asChild>
                      <a href={product.demo_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Demo
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Partnership Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Partnership Opportunities
                </CardTitle>
                <CardDescription>
                  Available partnership models and terms
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
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-lg">{formatPartnerType(type)}</h4>
                          <Badge variant="outline" className="text-lg px-3 py-1">
                            {terms.margin_pct}% Commission
                          </Badge>
                        </div>
                        <p className="text-gray-700">{terms.notes}</p>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
                  <h4 className="font-medium text-gray-900">{product.vendor}</h4>
                  <p className="text-sm text-gray-600 mt-1">{product.vendor_details.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Founded</span>
                    <div className="font-medium">{product.vendor_details.founded}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Team Size</span>
                    <div className="font-medium">{product.vendor_details.employees}</div>
                  </div>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <a href={product.vendor_details.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Website
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleStartChat} className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Chat
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Save for Later
                </Button>
                
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Request Info
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
