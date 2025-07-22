
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Search, 
  Users, 
  TrendingUp,
  Building,
  Star,
  Clock
} from "lucide-react";

const PartnerDashboard = () => {
  // Mock data - TODO: Replace with Supabase data
  const partner = {
    id: "partner-1",
    name: "John Partner",
    company: "Growth Partners LLC",
    subtype: "reseller",
    active_chats: 3,
    saved_products: 8,
    total_vendors: 5
  };

  const activeChats = [
    {
      id: "thread-1",
      product_title: "CloudCRM Pro",
      vendor_name: "Sarah Mitchell",
      vendor_company: "TechFlow Solutions",
      last_message: "Absolutely! Our reseller program offers 25% commission...",
      last_message_time: "2 hours ago",
      unread_count: 0,
      status: "active"
    },
    {
      id: "thread-2",
      product_title: "Analytics Dashboard",
      vendor_name: "Mike Chen",
      vendor_company: "DataFlow Inc",
      last_message: "I'd be happy to set up a demo for your team.",
      last_message_time: "1 day ago",
      unread_count: 2,
      status: "active"
    },
    {
      id: "thread-3",
      product_title: "Email Automation Suite",
      vendor_name: "Lisa Rodriguez",
      vendor_company: "AutoMail Pro",
      last_message: "Let me send you our partnership agreement for review.",
      last_message_time: "3 days ago",
      unread_count: 0,
      status: "negotiating"
    }
  ];

  const savedProducts = [
    {
      id: "1",
      title: "CloudCRM Pro",
      vendor: "TechFlow Solutions",
      niche: "SaaS",
      commission: "25%",
      saved_date: "2024-01-10"
    },
    {
      id: "2",
      title: "SecureFlow VPN",
      vendor: "CyberShield Corp",
      niche: "Cybersecurity",
      commission: "30%",
      saved_date: "2024-01-12"
    },
    {
      id: "3",
      title: "EcomBoost Suite",
      vendor: "Digital Commerce Inc",
      niche: "E-commerce",
      commission: "20%",
      saved_date: "2024-01-08"
    }
  ];

  const recentActivity = [
    {
      id: "1",
      type: "message",
      description: "New message from Sarah Mitchell",
      product: "CloudCRM Pro",
      time: "2 hours ago"
    },
    {
      id: "2",
      type: "product",
      description: "Saved SecureFlow VPN for later",
      product: "SecureFlow VPN",
      time: "1 day ago"
    },
    {
      id: "3",
      type: "chat",
      description: "Started chat about Analytics Dashboard",
      product: "Analytics Dashboard",
      time: "2 days ago"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={{ id: partner.id, role: "partner", name: partner.name }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Partner Dashboard</h1>
          <p className="text-gray-600">Manage your partnership opportunities and conversations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Chats</p>
                  <p className="text-2xl font-bold text-gray-900">{partner.active_chats}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Saved Products</p>
                  <p className="text-2xl font-bold text-gray-900">{partner.saved_products}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Connected Vendors</p>
                  <p className="text-2xl font-bold text-gray-900">{partner.total_vendors}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with your partnership journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link to="/marketplace">
                    <Search className="w-4 h-4 mr-2" />
                    Browse Products
                  </Link>
                </Button>
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Find Vendors
                </Button>
                <Button variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="chats" className="space-y-6">
          <TabsList>
            <TabsTrigger value="chats">Active Chats</TabsTrigger>
            <TabsTrigger value="saved">Saved Products</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

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
                            <h3 className="font-semibold text-gray-900">{chat.vendor_name}</h3>
                            <Badge 
                              variant={chat.status === "active" ? "default" : "secondary"}
                              className={chat.status === "active" ? "bg-green-100 text-green-800" : ""}
                            >
                              {chat.status}
                            </Badge>
                            {chat.unread_count > 0 && (
                              <Badge className="bg-red-100 text-red-800">
                                {chat.unread_count} new
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            {chat.vendor_company} • {chat.product_title}
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

          {/* Saved Products Tab */}
          <TabsContent value="saved" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Saved Products</h2>
              <Button variant="outline" asChild>
                <Link to="/marketplace">
                  <Search className="w-4 h-4 mr-2" />
                  Find More
                </Link>
              </Button>
            </div>

            <div className="grid gap-4">
              {savedProducts.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                          <Badge variant="outline">{product.niche}</Badge>
                          <Badge className="bg-green-100 text-green-800">
                            {product.commission} commission
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Building className="w-4 h-4 mr-1" />
                            {product.vendor}
                          </div>
                          <div>Saved {new Date(product.saved_date).toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Start Chat
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/product/${product.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {activity.type === "message" && (
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                          </div>
                        )}
                        {activity.type === "product" && (
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Star className="w-4 h-4 text-yellow-600" />
                          </div>
                        )}
                        {activity.type === "chat" && (
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-green-600" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-600">{activity.product}</p>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PartnerDashboard;
