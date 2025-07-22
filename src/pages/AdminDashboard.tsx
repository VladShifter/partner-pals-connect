
import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock,
  Building,
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();

  // Mock data - TODO: Replace with Supabase data
  const stats = {
    pending_users: 7,
    pending_products: 4,
    total_users: 156,
    total_products: 89,
    active_chats: 23
  };

  const pendingUsers = [
    {
      id: "user-1",
      name: "Alice Johnson",
      email: "alice@startup.com",
      company: "StartupFlow",
      role: "vendor",
      created_at: "2024-01-15T10:00:00Z"
    },
    {
      id: "user-2",
      name: "Bob Smith",
      email: "bob@partners.io",
      company: "Global Partners",
      role: "partner",
      created_at: "2024-01-14T15:30:00Z"
    },
    {
      id: "user-3",
      name: "Carol White",
      email: "carol@techcorp.com",
      company: "TechCorp Solutions",
      role: "vendor",
      created_at: "2024-01-14T09:15:00Z"
    }
  ];

  const pendingProducts = [
    {
      id: "product-1",
      title: "AI-Powered Analytics",
      vendor: "DataTech Inc",
      niche: "Analytics",
      submitted_at: "2024-01-15T11:00:00Z",
      tags: ["AI", "Analytics", "SaaS"]
    },
    {
      id: "product-2",
      title: "E-commerce Optimizer",
      vendor: "ShopFlow",
      niche: "E-commerce",
      submitted_at: "2024-01-14T16:00:00Z",
      tags: ["E-commerce", "Optimization", "Conversion"]
    }
  ];

  const handleApproveUser = async (userId: string) => {
    // TODO: Implement Supabase user approval
    console.log("Approving user:", userId);
    toast({
      title: "User approved",
      description: "The user has been approved and can now access the platform.",
    });
  };

  const handleRejectUser = async (userId: string) => {
    // TODO: Implement Supabase user rejection
    console.log("Rejecting user:", userId);
    toast({
      title: "User rejected",
      description: "The user application has been rejected.",
      variant: "destructive"
    });
  };

  const handleApproveProduct = async (productId: string) => {
    // TODO: Implement Supabase product approval
    console.log("Approving product:", productId);
    toast({
      title: "Product approved",
      description: "The product is now live in the marketplace.",
    });
  };

  const handleRejectProduct = async (productId: string) => {
    // TODO: Implement Supabase product rejection
    console.log("Rejecting product:", productId);
    toast({
      title: "Product rejected",
      description: "The product has been rejected.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, products, and platform operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending_users}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending_products}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_users}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Live Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_products}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Chats</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active_chats}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">
              Pending Users 
              {stats.pending_users > 0 && (
                <Badge className="ml-2 bg-orange-100 text-orange-800">{stats.pending_users}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="products">
              Pending Products
              {stats.pending_products > 0 && (
                <Badge className="ml-2 bg-red-100 text-red-800">{stats.pending_products}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Pending Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Pending User Approvals</h2>
              <Badge variant="outline">{pendingUsers.length} pending</Badge>
            </div>

            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          <Badge 
                            variant="outline" 
                            className={user.role === "vendor" ? "text-blue-600" : "text-green-600"}
                          >
                            {user.role === "vendor" ? (
                              <>
                                <Building className="w-3 h-3 mr-1" />
                                Vendor
                              </>
                            ) : (
                              <>
                                <Users className="w-3 h-3 mr-1" />
                                Partner
                              </>
                            )}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>{user.email}</div>
                          <div>{user.company}</div>
                          <div>Applied {new Date(user.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApproveUser(user.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRejectUser(user.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Pending Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Pending Product Approvals</h2>
              <Badge variant="outline">{pendingProducts.length} pending</Badge>
            </div>

            <div className="space-y-4">
              {pendingProducts.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                          <Badge variant="outline">{product.niche}</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">
                            <Building className="w-4 h-4 inline mr-1" />
                            {product.vendor}
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {product.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            Submitted {new Date(product.submitted_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApproveProduct(product.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRejectProduct(product.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Platform Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    User Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12</div>
                  <p className="text-xs text-gray-600">New users this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <Package className="w-4 h-4 mr-2" />
                    Product Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">47</div>
                  <p className="text-xs text-gray-600">Products viewed today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Chat Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-gray-600">Messages sent today</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
