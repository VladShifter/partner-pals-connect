
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building, Send, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Chat = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      author_id: "partner-1",
      author_name: "John Smith",
      author_role: "partner" as const,
      body: "Hi! I'm interested in your CloudCRM Pro solution. Could you tell me more about the white-label partnership terms?",
      created_at: "2024-01-15T10:30:00Z",
      seen_by_vendor: true,
      seen_by_partner: true
    },
    {
      id: "2",
      author_id: "vendor-1",
      author_name: "Sarah Johnson",
      author_role: "vendor" as const,
      body: "Hello John! Thanks for your interest. Our white-label program offers 30% margins with full branding customization. We provide dedicated support and API access. Would you like to schedule a demo?",
      created_at: "2024-01-15T11:15:00Z",
      seen_by_vendor: true,
      seen_by_partner: true
    }
  ]);

  // Mock current user - TODO: Replace with actual auth
  const currentUser = {
    id: "partner-1",
    role: "partner" as const,
    name: "John Smith"
  };

  // Mock thread data - TODO: Replace with Supabase data
  const thread = {
    id: threadId,
    product: {
      title: "CloudCRM Pro",
      vendor: "TechFlow Solutions",
      niche: "SaaS"
    },
    vendor: {
      id: "vendor-1",
      name: "Sarah Johnson",
      company: "TechFlow Solutions"
    },
    partner: {
      id: "partner-1",
      name: "John Smith",
      company: "Growth Partners"
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // TODO: Implement with Supabase
    const newMessage = {
      id: Date.now().toString(),
      author_id: currentUser.id,
      author_name: currentUser.name,
      author_role: currentUser.role,
      body: message,
      created_at: new Date().toISOString(),
      seen_by_vendor: currentUser.role === "vendor",
      seen_by_partner: currentUser.role === "partner"
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");

    toast({
      title: "Message sent",
      description: "Your message has been delivered.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getOtherParticipant = () => {
    return currentUser.role === "vendor" ? thread.partner : thread.vendor;
  };

  if (!thread) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Chat not found</h1>
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col">
        {/* Chat Header */}
        <Card className="mb-4">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/marketplace")}
                  className="p-0 h-auto text-blue-600 hover:text-blue-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <div>
                  <CardTitle className="text-lg">{thread.product.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    {thread.product.vendor}
                    <Badge variant="outline" className="ml-2 text-xs">
                      {thread.product.niche}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                Chatting with <span className="font-medium">{getOtherParticipant().name}</span>
                <div className="text-xs text-gray-500">{getOtherParticipant().company}</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Messages */}
        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 p-0">
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const isOwnMessage = msg.author_id === currentUser.id;
                
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {msg.author_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`rounded-lg px-3 py-2 ${
                        isOwnMessage 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className={`text-xs mb-1 ${
                          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {msg.author_name} • {formatTime(msg.created_at)}
                        </div>
                        <div className="text-sm">{msg.body}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Message Input */}
        <div className="mt-4 flex space-x-2">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!message.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
