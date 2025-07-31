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
import { useAuth } from "@/contexts/AuthContext";
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
  const [partnerApplications, setPartnerApplications] = useState<any[]>([]);
  const [connectedPartners, setConnectedPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingVendor, setEditingVendor] = useState<any>(null);
  const [expandedApplications, setExpandedApplications] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch vendor data based on authenticated user
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (vendorError) {
        console.error('Vendor query error:', vendorError);
        setVendor(null);
        setProducts([]);
        setPartnerApplications([]);
        setConnectedPartners([]);
        setLoading(false);
        return;
      }

      setVendor(vendorData);
      
      // Fetch products for this vendor
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('vendor_id', vendorData.id)
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Products query error:', productsError);
        setProducts([]);
      } else {
        setProducts(productsData || []);
      }

      // Fetch partner applications for vendor's products
      if (productsData && productsData.length > 0) {
        const productIds = productsData.map(p => p.id);
        
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('partner_applications')
          .select(`
            *,
            products!inner(name)
          `)
          .in('product_id', productIds)
          .order('created_at', { ascending: false });

        if (applicationsError) {
          console.error('Applications query error:', applicationsError);
          setPartnerApplications([]);
        } else {
          setPartnerApplications(applicationsData || []);
        }

        // Get completed applications to count as connected partners. The
        // partner_applications table uses 'completed' to indicate a
        // fully submitted application. Previously the code looked for
        // 'approved', which is not a valid status on this table.
        const completedApplications = (applicationsData || []).filter(app => app.status === 'completed');
        setConnectedPartners(completedApplications);
      } else {
        setPartnerApplications([]);
        setConnectedPartners([]);
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


  // Get white label resellers from partner applications with white label role
  const whiteLabelResellers = partnerApplications
    .filter(app =>
      app.partner_roles?.includes('White Label Partner') ||
      app.partner_roles?.includes('white_label')
    )
    .map(app => ({
      id: app.id,
      name: app.name,
      company: app.company_name || 'Individual',
      email: app.email,
      phone: app.phone || 'N/A',
      // Display a human‑friendly stage: completed applications are
      // whitelabeling, otherwise show the raw status (in_progress or
      // abandoned).
      stage: app.status === 'completed' ? 'whitelabeling' : app.status,
      demos_conducted: 0, // This would come from actual tracking data
      leads_generated: 0, // This would come from actual tracking data
      joined_date: new Date(app.created_at).toISOString().split('T')[0]
    }));


  // Get active chats - this would be fetched from partner_chats table
  const activeChats: any[] = []; // Empty for now until chat system is implemented

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access the vendor dashboard.</p>
          <Link to="/login" className="text-primary hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Vendor Profile Found</h2>
          <p className="text-gray-600 mb-4">You don't have a vendor profile yet.</p>
          <Link to="/onboard/vendor" className="text-primary hover:underline">Create Vendor Profile</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
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
                  <p className="text-2xl font-bold text-green-900">{connectedPartners.filter(p => p.status === 'completed').length}</p>
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
                    $0
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="products">Product and Analytics</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="white-label">White Label Resellers</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="chats">Chats</TabsTrigger>
          </TabsList>

          {/* Product and Analytics Tab */}
          <TabsContent value="products" className="space-y-6">
            {/* Products Section */}
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

            {/* Analytics Section */}
            <div className="pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center mb-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/**
                 * The following metrics were previously hard coded with
                 * placeholder values (e.g. 1,247 product views). To avoid
                 * displaying misleading data we initialise all values to
                 * zero. In the future these can be replaced with
                 * analytics fetched from the database or external
                 * tracking services.
                 */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-sm text-blue-700">
                      <Eye className="w-4 h-4 mr-2" />
                      Product Views
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-900">0</div>
                    <div className="flex items-center text-xs text-blue-600 mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      0% vs last month
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
                    <div className="text-2xl font-bold text-green-900">0</div>
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      0% vs last month
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
                    <div className="text-2xl font-bold text-purple-900">0</div>
                    <div className="flex items-center text-xs text-purple-600 mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      0% vs last month
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
                    <div className="text-2xl font-bold text-amber-900">0%</div>
                    <div className="flex items-center text-xs text-amber-600 mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Views to chats
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance by Product */}
              <Card className="mb-6">
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
                      // Placeholder analytics; these were previously hard coded
                      // per‑product values. Set all metrics to zero to avoid
                      // displaying fake data. Real metrics should be fetched
                      // from analytics tables when available.
                      const views = 0;
                      const chats = 0;
                      const clients = 0;
                      const conversionRate = '0.0';
                      
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
              <Card className="mb-6">
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
                      // Previously sorted by total revenue. Since the
                      // partner_applications table does not include revenue
                      // metrics, skip sorting.
                      .map((partner, index) => (
                        <div key={partner.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{partner.name}</p>
                              <p className="text-sm text-gray-500">{partner.company || ''}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">$0</p>
                            <p className="text-sm text-gray-500">0 deals</p>
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
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <div className="text-sm text-blue-700">Total Clicks</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <div className="text-sm text-green-700">Conversions</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">0%</div>
                      <div className="text-sm text-purple-700">Click-to-Chat Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Partner Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <PartnerApplications vendorId={vendor?.id || ''} />
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

        </Tabs>

        {/* Product Form Modal */}
        <ProductForm 
          isOpen={showProductForm}
          onClose={() => setShowProductForm(false)}
          product={editingProduct}
          vendorId={vendor?.id}
          onSuccess={() => {
            setShowProductForm(false);
            handleFormSuccess();
          }}
        />

        {/* Vendor Form Modal */}
        <VendorForm 
          isOpen={showVendorForm}
          onClose={() => setShowVendorForm(false)}
          vendor={editingVendor}
          onSuccess={() => {
            setShowVendorForm(false);
            handleFormSuccess();
          }}
        />
      </div>
    </div>
  );
};

export default VendorDashboard;
