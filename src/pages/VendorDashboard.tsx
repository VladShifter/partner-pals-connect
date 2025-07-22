
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
        setProducts(productsData || []);
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
    setEditingProduct(product);
    setShowProductForm(true);
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
      product_name: "CloudCRM Pro"
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
      product_name: "CloudCRM Pro"
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
      product_name: "AI-Powered Training Platform"
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
            <TabsTrigger value="partners">Partners</TabsTrigger>
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

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-gray-500">
                        Applied {new Date(app.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Start Chat
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Connected Partners Tab */}
          <TabsContent value="partners" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Connected Partners</h2>
              <Badge variant="outline">{connectedPartners.length} active partners</Badge>
            </div>

            <div className="grid gap-4">
              {connectedPartners.map((partner) => (
                <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{partner.name}</CardTitle>
                        <CardDescription className="flex items-center space-x-2 mt-1">
                          <span>{partner.company}</span>
                          <Badge variant="outline" className="text-xs">
                            {partner.type}
                          </Badge>
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {partner.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{partner.registered_clients}</div>
                        <div className="text-xs text-blue-700">Registered Clients</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{partner.closed_deals}</div>
                        <div className="text-xs text-green-700">Closed Deals</div>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <div className="text-2xl font-bold text-amber-600">${partner.total_revenue.toLocaleString()}</div>
                        <div className="text-xs text-amber-700">Total Revenue</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {partner.closed_deals > 0 ? Math.round((partner.total_revenue / partner.closed_deals)) : 0}
                        </div>
                        <div className="text-xs text-purple-700">Avg Deal Size</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm text-gray-600">
                        <p>Joined {new Date(partner.joined_date).toLocaleDateString()}</p>
                        <p>Last activity: {partner.last_activity}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Chat
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Referral Links Tab */}
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

        {/* Forms */}
        <ProductForm
          isOpen={showProductForm}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          onSuccess={handleFormSuccess}
          product={editingProduct}
          vendorId={vendor?.id}
        />

        <VendorForm
          isOpen={showVendorForm}
          onClose={() => {
            setShowVendorForm(false);
            setEditingVendor(null);
          }}
          onSuccess={handleFormSuccess}
          vendor={editingVendor}
          userId={currentUser.id}
        />
      </div>
    </div>
  );
};

export default VendorDashboard;
