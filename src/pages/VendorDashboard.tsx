import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductForm } from "@/components/vendor/ProductForm";
import { VendorForm } from "@/components/vendor/VendorForm";
import { PartnerApplications } from "@/components/vendor/PartnerApplications";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  MessageSquare, 
  Plus, 
  MoreVertical, 
  Users, 
  TrendingUp,
  Bell,
  Edit,
  Eye,
  Building,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  UserCheck,
  Share2,
  ExternalLink,
  Target,
  BarChart3
} from "lucide-react";

const VendorDashboard = () => {
  const [vendor, setVendor] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingVendor, setEditingVendor] = useState<any>(null);
  const [expandedApplications, setExpandedApplications] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Development mode - use mock user
  const DEVELOPMENT_MODE = true;
  const currentUser = DEVELOPMENT_MODE ? {
    id: 'vendor-1',
    email: 'vendor@demo.com'
  } : {
    id: 'temp-user-id',
    email: localStorage.getItem('temp_admin_email') || 'admin@rezollo.com'
  };

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      
      // For demo purposes, we'll use a mock vendor since we don't have real auth
      // In production, this would fetch based on the authenticated user
      const mockVendor = {
        id: 'vendor-1',
        user_id: currentUser.id,
        company_name: 'TechFlow Solutions',
        website: 'https://techflow.com',
        niche: 'SaaS',
        pitch: 'We create innovative software solutions for modern businesses.',
        status: 'approved'
      };
      
      setVendor(mockVendor);
      
      // Fetch products using a proper UUID query
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('vendor_id', mockVendor.id)
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Products query error:', productsError);
        // Set empty array if error
        setProducts([]);
      } else {
        // Add mock marketplace product for demo
        const mockMarketplaceProduct = {
          id: 'marketplace-1',
          name: 'CloudCRM Pro',
          description: 'Advanced CRM solution for growing businesses',
          price: 299,
          commission_rate: 25,
          status: 'approved',
          created_at: '2024-01-01T00:00:00Z',
          vendor_id: mockVendor.id,
          slug: 'cloudcrm-pro'
        };
        setProducts([mockMarketplaceProduct, ...(productsData || [])]);
      }
      
    } catch (error: any) {
      console.error('Error fetching vendor data:', error);
      toast({
        title: "Error",
        description: "Failed to load vendor data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: any) => {
    // Navigate to product edit page if it's a marketplace product
    if (product.id === 'marketplace-1') {
      window.location.href = `/admin/products/${product.slug}/edit`;
      return;
    }
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const toggleApplicationExpansion = (appId: string) => {
    const newExpanded = new Set(expandedApplications);
    if (newExpanded.has(appId)) {
      newExpanded.delete(appId);
    } else {
      newExpanded.add(appId);
    }
    setExpandedApplications(newExpanded);
  };

  const handleEditVendor = () => {
    setEditingVendor(vendor);
    setShowVendorForm(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleFormSuccess = () => {
    fetchVendorData();
  };

  // Mock data for partner applications
  const partnerApplications = [
    {
      id: "app-1",
      name: "Michael Rodriguez",
      email: "michael@growthpartners.com",
      company_name: "Growth Partners LLC",
      partner_type: "reseller",
      status: "approved",
      experience_years: 5,
      team_size: 8,
      monthly_revenue: 150000,
      target_market: "Small to medium-sized businesses in North America",
      marketing_channels: ["LinkedIn", "Cold Email", "Referrals"],
      partnership_goals: ["Revenue Growth", "Market Expansion"],
      created_at: "2024-01-15T10:00:00Z",
      product_name: "CloudCRM Pro",
      linkedin_url: "https://linkedin.com/in/michael-rodriguez-sales",
      // Full application data
      phone: "+1-555-0123",
      website_url: "https://growthpartners.com",
      company_description: "We specialize in helping SaaS companies scale through strategic partnerships and proven sales methodologies.",
      why_interested: "Your CRM solution aligns perfectly with our client base of growing B2B companies. We see significant potential for cross-selling opportunities.",
      previous_partnerships: "Successfully partnered with Salesforce, HubSpot, and Pipedrive, generating over $2M in partner revenue in the last 24 months.",
      revenue_goals: 500000,
      country: "United States",
      industry: "Sales & Marketing Technology",
      business_model: "Consultancy with commission-based partnerships",
      audience_size: "~5,000 qualified prospects in our database",
      active_marketing_channels: "LinkedIn outreach (500+ connections/month), Email campaigns (10k+ subscribers), Referral network of 50+ consultants",
      individual_type: "Sales Director",
      entity_type: "company",
      partner_roles: ["Reseller", "Lead Generator"],
      social_profiles: "LinkedIn: @michael-rodriguez-sales, Twitter: @MikeGrowthPro",
      communication_preference: "chat"
    },
    {
      id: "app-2", 
      name: "Sarah Chen",
      email: "sarah@asiaexpansion.co",
      company_name: "Asia Expansion Co",
      partner_type: "white_label",
      status: "pending",
      experience_years: 8,
      team_size: 15,
      monthly_revenue: 250000,
      target_market: "Enterprise clients in Southeast Asia",
      marketing_channels: ["Content Marketing", "Events", "Partnerships"],
      partnership_goals: ["White Label", "Geographic Expansion"],
      created_at: "2024-01-20T14:30:00Z",
      product_name: "CloudCRM Pro",
      linkedin_url: "https://linkedin.com/in/sarah-chen-asia",
      // Full application data
      phone: "+65-9123-4567",
      website_url: "https://asiaexpansion.co",
      company_description: "Leading technology consultancy focused on helping Western SaaS companies establish and scale operations across Southeast Asian markets.",
      why_interested: "We want to offer white-label CRM solutions to our enterprise clients who need localized, region-specific implementations.",
      previous_partnerships: "White-label partnerships with 3 major SaaS providers, helping them enter Singapore, Malaysia, and Thailand markets.",
      revenue_goals: 1200000,
      country: "Singapore",
      industry: "Enterprise Software Consulting",
      business_model: "White-label implementation and ongoing support services",
      audience_size: "Direct access to 200+ enterprise decision makers",
      active_marketing_channels: "Industry conferences, executive networking events, content marketing in Mandarin and English",
      individual_type: "Managing Director",
      entity_type: "company",
      partner_roles: ["White Label Partner", "Implementation Specialist"],
      social_profiles: "LinkedIn: @sarah-chen-asia, WeChat: SarahChenBiz",
      communication_preference: "email"
    },
    {
      id: "app-3",
      name: "David Thompson", 
      email: "david@techresellers.net",
      company_name: "Tech Resellers Network",
      partner_type: "reseller",
      status: "reviewing",
      experience_years: 3,
      team_size: 4,
      monthly_revenue: 75000,
      target_market: "Startups and scale-ups in Europe",
      marketing_channels: ["Social Media", "Webinars", "Trade Shows"],
      partnership_goals: ["Revenue Growth", "Product Portfolio Expansion"],
      created_at: "2024-01-25T09:15:00Z",
      product_name: "AI-Powered Training Platform",
      linkedin_url: "https://linkedin.com/in/david-thompson-tech",
      // Full application data
      phone: "+44-7700-900123",
      website_url: "https://techresellers.net",
      company_description: "Boutique technology reseller focused on AI and automation solutions for European startups and scale-ups.",
      why_interested: "The AI training platform fills a crucial gap in our portfolio. Our clients are actively seeking AI-powered learning solutions.",
      previous_partnerships: "Reseller agreements with 5 AI/ML companies, average deal size €15k, 85% client satisfaction rate.",
      revenue_goals: 300000,
      country: "United Kingdom",
      industry: "AI & Machine Learning Solutions",
      business_model: "Direct sales with implementation and training services",
      audience_size: "~1,200 qualified prospects across UK, Germany, and Netherlands",
      active_marketing_channels: "Tech meetups, LinkedIn thought leadership, partner webinars, startup accelerator relationships",
      individual_type: "Founder & Sales Director",
      entity_type: "company",
      partner_roles: ["Reseller", "Solution Integrator"],
      social_profiles: "LinkedIn: @david-thompson-tech, Twitter: @DTechSales",
      communication_preference: "chat"
    }
  ];

  // Mock data for white label resellers
  const whiteLabelResellers = [
    {
      id: "wl-1",
      name: "Sarah Chen",
      company: "Asia Expansion Co",
      email: "sarah@asiaexpansion.co",
      phone: "+65-9123-4567",
      stage: "whitelabeling",
      demos_conducted: 12,
      leads_generated: 45,
      joined_date: "2024-01-20"
    },
    {
      id: "wl-2", 
      name: "Marcus Weber",
      company: "EuroTech Solutions",
      email: "marcus@eurotech.de",
      phone: "+49-30-12345678",
      stage: "contract",
      demos_conducted: 0,
      leads_generated: 8,
      joined_date: "2024-02-01"
    },
    {
      id: "wl-3",
      name: "Jennifer Lopez",
      company: "LatAm Digital",
      email: "jennifer@latamdigital.com",
      phone: "+52-55-1234-5678",
      stage: "negotiations",
      demos_conducted: 0,
      leads_generated: 3,
      joined_date: "2024-02-10"
    },
    {
      id: "wl-4",
      name: "Akira Tanaka", 
      company: "Japan Software Partners",
      email: "akira@jsoftware.jp",
      phone: "+81-3-1234-5678",
      stage: "first_demos",
      demos_conducted: 3,
      leads_generated: 15,
      joined_date: "2024-01-25"
    },
    {
      id: "wl-5",
      name: "Robert Kim",
      company: "Seoul Tech Hub",
      email: "robert@seoultechhub.kr", 
      phone: "+82-2-1234-5678",
      stage: "sales",
      demos_conducted: 28,
      leads_generated: 87,
      joined_date: "2023-11-15"
    }
  ];

  // Mock data for connected partners and their results
  const connectedPartners = [
    {
      id: "partner-1",
      name: "Michael Rodriguez",
      company: "Growth Partners LLC",
      type: "reseller",
      joined_date: "2024-01-15",
      registered_clients: 23,
      closed_deals: 12,
      total_revenue: 48000,
      last_activity: "2 hours ago",
      status: "active"
    },
    {
      id: "partner-2",
      name: "Jennifer Wilson",
      company: "Sales Force Pro",
      type: "reseller", 
      joined_date: "2023-12-01",
      registered_clients: 45,
      closed_deals: 28,
      total_revenue: 112000,
      last_activity: "1 day ago",
      status: "active"
    },
    {
      id: "partner-3",
      name: "Robert Kim",
      company: "Digital Solutions Inc",
      type: "affiliate",
      joined_date: "2024-02-01",
      registered_clients: 8,
      closed_deals: 3,
      total_revenue: 9600,
      last_activity: "3 days ago", 
      status: "active"
    }
  ];

  // Mock data for chats
  const activeChats = [
    {
      id: "thread-1",
      product_title: "CloudCRM Pro",
      partner_name: "John Partner",
      partner_company: "Growth Partners LLC",
      last_message: "Absolutely! Our reseller program offers 25% commission...",
      last_message_time: "2 hours ago",
      unread_count: 0,
      partner_type: "reseller"
    },
    {
      id: "thread-2",
      product_title: "CloudCRM Pro",
      partner_name: "Lisa Chen",
      partner_company: "Asia Expansion Co",
      last_message: "I'm interested in white-label opportunities for the Asian market.",
      last_message_time: "1 day ago",
      unread_count: 2,
      partner_type: "white_label"
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Referral link copied successfully"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={{ id: vendor?.id, role: "vendor", name: vendor?.company_name }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
            <p className="text-gray-600">Manage your products and partnership conversations</p>
          </div>
          {vendor && (
            <Button variant="outline" onClick={handleEditVendor}>
              <Building className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-700">Products</p>
                  <p className="text-2xl font-bold text-blue-900">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-700">Active Partners</p>
                  <p className="text-2xl font-bold text-green-900">{connectedPartners.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-700">Active Chats</p>
                  <p className="text-2xl font-bold text-purple-900">{activeChats.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-amber-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-amber-700">Total Revenue</p>
                  <p className="text-2xl font-bold text-amber-900">
                    ${connectedPartners.reduce((sum, p) => sum + p.total_revenue, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="white-label">White Label Resellers</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="chats">Chats</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Your Products</h2>
              <Button onClick={handleAddProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="grid gap-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                          <Badge 
                            variant={product.status === "approved" ? "default" : "secondary"}
                            className={product.status === "approved" ? "bg-green-100 text-green-800" : ""}
                          >
                            {product.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div>Price: ${product.price || 'Not set'}</div>
                          <div>Commission: {product.commission_rate || 0}%</div>
                          <div>Created {new Date(product.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Partner Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Partner Applications</h2>
              <Badge variant="outline">{partnerApplications.length} applications</Badge>
            </div>

            <div className="space-y-4">
              {partnerApplications.map((app) => (
                <Card key={app.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{app.name}</CardTitle>
                        <CardDescription className="flex items-center space-x-2 mt-1">
                          <span>{app.company_name}</span>
                          <Badge variant="outline" className="text-xs">
                            {app.partner_type.replace('_', ' ')}
                          </Badge>
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a 
                          href={app.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          LinkedIn
                        </a>
                        <Badge 
                          variant={app.status === 'approved' ? 'default' : app.status === 'pending' ? 'secondary' : 'outline'}
                          className={
                            app.status === 'approved' ? 'bg-green-100 text-green-800' :
                            app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }
                        >
                          {app.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {app.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {app.status === 'reviewing' && <Eye className="w-3 h-3 mr-1" />}
                          {app.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Experience</p>
                        <p className="font-medium">{app.experience_years} years</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Team Size</p>
                        <p className="font-medium">{app.team_size} people</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Monthly Revenue</p>
                        <p className="font-medium">${app.monthly_revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Product</p>
                        <p className="font-medium">{app.product_name}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">Target Market:</span> {app.target_market}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Marketing Channels:</span>
                        {app.marketing_channels.map((channel, index) => (
                          <Badge key={index} variant="outline" className="text-xs">{channel}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Goals:</span>
                        {app.partnership_goals.map((goal, index) => (
                          <Badge key={index} variant="outline" className="text-xs">{goal}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleApplicationExpansion(app.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {expandedApplications.has(app.id) ? 'Hide Details' : 'View Details'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Start Chat
                      </Button>
                    </div>

                    {/* Expanded Application Details */}
                    {expandedApplications.has(app.id) && (
                      <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                        <h4 className="font-semibold text-gray-900 mb-4">Full Application Details</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Contact Information</p>
                              <div className="mt-1 text-sm text-gray-600">
                                <p>Email: {app.email}</p>
                                <p>Phone: {app.phone}</p>
                                <p>Website: <a href={app.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{app.website_url}</a></p>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-gray-700">Company Details</p>
                              <div className="mt-1 text-sm text-gray-600">
                                <p>Industry: {app.industry}</p>
                                <p>Country: {app.country}</p>
                                <p>Business Model: {app.business_model}</p>
                                <p>Entity Type: {app.entity_type}</p>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-gray-700">Partner Profile</p>
                              <div className="mt-1 text-sm text-gray-600">
                                <p>Role: {app.individual_type}</p>
                                <p>Communication: {app.communication_preference}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span>Roles:</span>
                                  {app.partner_roles.map((role, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">{role}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Business Metrics</p>
                              <div className="mt-1 text-sm text-gray-600">
                                <p>Revenue Goal: ${app.revenue_goals?.toLocaleString() || 'Not specified'}</p>
                                <p>Audience Size: {app.audience_size}</p>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-gray-700">Company Description</p>
                              <p className="mt-1 text-sm text-gray-600">{app.company_description}</p>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-gray-700">Why Interested</p>
                              <p className="mt-1 text-sm text-gray-600">{app.why_interested}</p>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-gray-700">Previous Partnerships</p>
                              <p className="mt-1 text-sm text-gray-600">{app.previous_partnerships}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Marketing Channels</p>
                            <p className="mt-1 text-sm text-gray-600">{app.active_marketing_channels}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-700">Social Profiles</p>
                            <p className="mt-1 text-sm text-gray-600">{app.social_profiles}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* White Label Resellers Tab */}
          <TabsContent value="white-label" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">White Label Resellers</h2>
              <Badge variant="outline">{whiteLabelResellers.length} resellers</Badge>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reseller
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contacts
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Demos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leads
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {whiteLabelResellers.map((reseller) => (
                      <tr key={reseller.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{reseller.name}</div>
                            <div className="text-sm text-gray-500">{reseller.company}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{reseller.email}</div>
                          <div className="text-sm text-gray-500">{reseller.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant="outline"
                            className={
                              reseller.stage === 'sales' ? 'bg-green-100 text-green-800 border-green-200' :
                              reseller.stage === 'whitelabeling' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              reseller.stage === 'first_demos' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              reseller.stage === 'contract' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                              'bg-gray-100 text-gray-800 border-gray-200'
                            }
                          >
                            {reseller.stage.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {reseller.demos_conducted}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {reseller.leads_generated}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Chat
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Referral Links</h2>
              <p className="text-sm text-gray-600">Generate links for non-white-label partners</p>
            </div>

            <div className="grid gap-6">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="w-5 h-5" />
                      <span>{product.name}</span>
                    </CardTitle>
                    <CardDescription>Generate referral links for this product</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Reseller Link</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input 
                            readOnly 
                            value={`https://marketplace.rezollo.com/product/${product.slug}?ref=reseller-${vendor?.id}`}
                            className="flex-1"
                          />
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyToClipboard(`https://marketplace.rezollo.com/product/${product.slug}?ref=reseller-${vendor?.id}`)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700">Affiliate Link</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input 
                            readOnly 
                            value={`https://marketplace.rezollo.com/product/${product.slug}?ref=affiliate-${vendor?.id}`}
                            className="flex-1"
                          />
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyToClipboard(`https://marketplace.rezollo.com/product/${product.slug}?ref=affiliate-${vendor?.id}`)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Custom Referral Code</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input 
                            placeholder="Enter custom code (e.g., PARTNER2024)"
                            className="flex-1"
                          />
                          <Button size="sm">
                            <Plus className="w-4 h-4 mr-1" />
                            Generate
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Link Performance</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Track clicks, conversions, and revenue from your referral links in the Analytics tab.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Chats Tab */}
          <TabsContent value="chats" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Active Conversations</h2>
              <Badge variant="outline">{activeChats.length} active</Badge>
            </div>

            <div className="space-y-4">
              {activeChats.map((chat) => (
                <Card key={chat.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <Link to={`/chat/${chat.id}`} className="block">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{chat.partner_name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {chat.partner_type.replace('_', ' ')}
                            </Badge>
                            {chat.unread_count > 0 && (
                              <Badge className="bg-red-100 text-red-800">
                                {chat.unread_count} new
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            {chat.partner_company} • {chat.product_title}
                          </div>
                          
                          <p className="text-gray-700 line-clamp-2">{chat.last_message}</p>
                        </div>
                        
                        <div className="text-xs text-gray-500 ml-4">
                          {chat.last_message_time}
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Analytics & Performance</h2>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Last 30 days</Badge>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>

            {/* Top Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm text-blue-700">
                    <Eye className="w-4 h-4 mr-2" />
                    Product Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">1,247</div>
                  <div className="flex items-center text-xs text-blue-600 mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.5% vs last month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm text-green-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chats Started
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">89</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8.3% vs last month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm text-purple-700">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Closed Clients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">43</div>
                  <div className="flex items-center text-xs text-purple-600 mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +15.2% vs last month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm text-amber-700">
                    <Target className="w-4 h-4 mr-2" />
                    Conversion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-900">7.1%</div>
                  <div className="flex items-center text-xs text-amber-600 mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Views to chats
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance by Product */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Product Performance
                </CardTitle>
                <CardDescription>Performance metrics by product</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product, index) => {
                    const views = [523, 412, 312][index] || 0;
                    const chats = [45, 28, 16][index] || 0;
                    const clients = [23, 12, 8][index] || 0;
                    const conversionRate = views > 0 ? ((chats / views) * 100).toFixed(1) : '0.0';
                    
                    return (
                      <div key={product.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <Badge variant="outline">{product.status}</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-blue-600">{views}</div>
                            <div className="text-gray-500">Views</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-green-600">{chats}</div>
                            <div className="text-gray-500">Chats</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-purple-600">{clients}</div>
                            <div className="text-gray-500">Clients</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-amber-600">{conversionRate}%</div>
                            <div className="text-gray-500">Conv. Rate</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Partner Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Top Partner Performance
                </CardTitle>
                <CardDescription>Revenue generated by top partners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {connectedPartners
                    .sort((a, b) => b.total_revenue - a.total_revenue)
                    .map((partner, index) => (
                      <div key={partner.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{partner.name}</p>
                            <p className="text-sm text-gray-500">{partner.company} • {partner.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${partner.total_revenue.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{partner.closed_deals} deals</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Referral Link Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="w-5 h-5 mr-2" />
                  Referral Link Performance
                </CardTitle>
                <CardDescription>Clicks and conversions from referral links</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-sm text-blue-700">Total Clicks</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">23</div>
                    <div className="text-sm text-green-700">Conversions</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">14.7%</div>
                    <div className="text-sm text-purple-700">Click-to-Chat Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Product Form Modal */}
        {showProductForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <Button variant="ghost" onClick={() => setShowProductForm(false)}>
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>
                <ProductForm 
                  product={editingProduct}
                  vendorId={vendor?.id}
                  onSuccess={() => {
                    setShowProductForm(false);
                    handleFormSuccess();
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Vendor Form Modal */}
        {showVendorForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Edit Vendor Profile</h2>
                  <Button variant="ghost" onClick={() => setShowVendorForm(false)}>
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>
                <VendorForm 
                  vendor={editingVendor}
                  onSuccess={() => {
                    setShowVendorForm(false);
                    handleFormSuccess();
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
