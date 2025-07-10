
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  MessageSquare, 
  Plus, 
  MoreVertical, 
  Users, 
  TrendingUp,
  Bell,
  Edit,
  Eye
} from "lucide-react";

const VendorDashboard = () => {
  // Mock data - TODO: Replace with Supabase data
  const vendor = {
    id: "vendor-1",
    name: "Sarah Mitchell",
    company: "TechFlow Solutions",
    products_count: 3,
    active_chats: 5,
    total_partners: 12
  };

  const products = [
    {
      id: "1",
      title: "CloudCRM Pro",
      niche: "SaaS",
      status: "approved",
      active_chats: 3,
      interested_partners: 8,
      created_at: "2024-01-10"
    },
    {
      id: "2",
      title: "Analytics Dashboard",
      niche: "Analytics",
      status: "pending",
      active_chats: 0,
      interested_partners: 2,
      created_at: "2024-01-12"
    },
    {
      id: "3",
      title: "Email Automation Suite",
      niche: "Marketing",
      status: "approved",
      active_chats: 2,
      interested_partners: 12,
      created_at: "2024-01-08"
    }
  ];

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
    },
    {
      id: "thread-3",
      product_title: "Email Automation Suite",
      partner_name: "Mike Rodriguez",
      partner_company: "Digital Marketing Pro",
      last_message: "Could we schedule a demo for our team?",
      last_message_time: "3 days ago",
      unread_count: 1,
      partner_type: "affiliate"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={{ id: vendor.id, role: "vendor", name: vendor.name }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-gray-600">Manage your products and partnership conversations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Products</p>
                  <p className="text-2xl font-bold text-gray-900">{vendor.products_count}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{vendor.active_chats}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{vendor.total_partners}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="chats">Active Chats</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Your Products</h2>
              <Button>
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
                          <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                          <Badge variant="outline">{product.niche}</Badge>
                          <Badge 
                            variant={product.status === "approved" ? "default" : "secondary"}
                            className={product.status === "approved" ? "bg-green-100 text-green-800" : ""}
                          >
                            {product.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {product.active_chats} active chats
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {product.interested_partners} interested partners
                          </div>
                          <div>Created {new Date(product.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
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
      </div>
    </div>
  );
};

export default VendorDashboard;
