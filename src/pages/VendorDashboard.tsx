
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
  Building
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

  // Mock user - in real app this would come from auth context
  const currentUser = {
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

  // Mock data for chats - TODO: Replace with real data
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Products</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Chats</p>
                  <p className="text-2xl font-bold text-gray-900">{activeChats.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Partners</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="applications">Partner Applications</TabsTrigger>
            <TabsTrigger value="chats">Active Chats</TabsTrigger>
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
          <TabsContent value="applications">
            <PartnerApplications vendorId={vendor?.id} />
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
            <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Product Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-gray-600">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat Initiated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-gray-600">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    Conversion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18.5%</div>
                  <p className="text-xs text-gray-600">Views to chats</p>
                </CardContent>
              </Card>
            </div>
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
