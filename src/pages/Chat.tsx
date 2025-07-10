
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Send, MoreVertical, Building, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  author_id: string;
  author_name: string;
  author_role: "vendor" | "partner";
  body: string;
  created_at: string;
  seen_by_vendor: boolean;
  seen_by_partner: boolean;
}

const Chat = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock current user - TODO: Get from auth context
  const currentUser = {
    id: "user-1",
    role: "partner" as const,
    name: "John Partner"
  };

  // Mock thread data - TODO: Replace with Supabase data
  const thread = {
    id: threadId,
    product: {
      title: "CloudCRM Pro",
      vendor: "TechFlow Solutions"
    },
    vendor: {
      id: "vendor-1",
      name: "Sarah Mitchell",
      company: "TechFlow Solutions"
    },
    partner: {
      id: "partner-1",
      name: "John Partner",
      company: "Growth Partners LLC"
    },
    created_at: "2024-01-15T10:00:00Z"
  };

  // Mock messages - TODO: Replace with Supabase realtime
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: "msg-1",
        author_id: "vendor-1",
        author_name: "Sarah Mitchell",
        author_role: "vendor",
        body: "Hi! Thanks for your interest in CloudCRM Pro. I'd love to discuss partnership opportunities with you.",
        created_at: "2024-01-15T10:05:00Z",
        seen_by_vendor: true,
        seen_by_partner: true
      },
      {
        id: "msg-2",
        author_id: "partner-1",
        author_name: "John Partner",
        author_role: "partner",
        body: "Hello! I'm very interested in the reseller program. Could you tell me more about the commission structure and any volume requirements?",
        created_at: "2024-01-15T10:15:00Z",
        seen_by_vendor: true,
        seen_by_partner: true
      },
      {
        id: "msg-3",
        author_id: "vendor-1",
        author_name: "Sarah Mitchell",
        author_role: "vendor",
        body: "Absolutely! Our reseller program offers 25% commission on all sales. We have volume tiers that can increase this to 30% for $50k+ monthly sales. We also provide comprehensive sales training and marketing materials.",
        created_at: "2024-01-15T10:30:00Z",
        seen_by_vendor: true,
        seen_by_partner: false
      }
    ];
    setMessages(mockMessages);
  }, [threadId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      author_id: currentUser.id,
      author_name: currentUser.name,
      author_role: currentUser.role,
      body: message.trim(),
      created_at: new Date().toISOString(),
      seen_by_vendor: currentUser.role === "vendor",
      seen_by_partner: currentUser.role === "partner"
    };

    // TODO: Send message via Supabase
    console.log("Sending message:", newMessage);
    
    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    setIsLoading(false);
    
    toast({
      title: "Message sent",
      description: "Your message has been delivered.",
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <div>
                  <CardTitle className="text-lg">{thread.product.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      {thread.vendor.name} ({thread.vendor.company})
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {thread.partner.name} ({thread.partner.company})
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Messages */}
        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 p-0">
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => {
                const isCurrentUser = msg.author_id === currentUser.id;
                const showDate = index === 0 || 
                  formatDate(messages[index - 1].created_at) !== formatDate(msg.created_at);
                
                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="text-center text-xs text-gray-500 my-4">
                        {formatDate(msg.created_at)}
                      </div>
                    )}
                    
                    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                      <div className={`flex space-x-2 max-w-xs lg:max-w-md ${isCurrentUser ? "flex-row-reverse space-x-reverse" : ""}`}>
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={msg.author_role === "vendor" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}>
                            {msg.author_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-medium text-gray-700">
                              {msg.author_name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {msg.author_role}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatTime(msg.created_at)}
                            </span>
                          </div>
                          
                          <div className={`rounded-lg p-3 ${
                            isCurrentUser 
                              ? "bg-blue-600 text-white" 
                              : "bg-white border border-gray-200 text-gray-900"
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !message.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
