import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building, Users, Eye, EyeOff, Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const QuickSignup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<"vendor" | "partner">("partner");
  const [isLoading, setIsLoading] = useState(false);

  const fromProduct = searchParams.get('from') === 'product';
  const productId = searchParams.get('productId');
  const productName = searchParams.get('productName');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            role,
            quick_signup: true
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Create profile with minimal data and quick_signup flag
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: data.user.id,
            email: data.user.email!,
            role: role === 'vendor' ? 'vendor' : 'partner',
            quick_signup: true
          });

        if (profileError) {
          console.warn('Profile creation error:', profileError);
        }

        toast({
          title: "Account created!",
          description: "You can now explore all products. Check your email to confirm your account.",
        });

        // Redirect based on context
        if (fromProduct && productId) {
          // If they came from a product, redirect to marketplace with the product info
          navigate(`/marketplace?highlight=${productId}`);
        } else {
          // Otherwise redirect to marketplace
          navigate("/marketplace");
        }
      }
    } catch (error: any) {
      toast({
        title: "Registration Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Quick Sign Up</CardTitle>
              <CardDescription>
                {fromProduct && productName 
                  ? `Create an account to explore ${productName} and other products`
                  : "Create your account to start exploring partnerships"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>I am a...</Label>
                  <RadioGroup
                    value={role}
                    onValueChange={(value) => setRole(value as "vendor" | "partner")}
                    className="grid grid-cols-1 gap-2"
                  >
                    <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="vendor" id="vendor" />
                      <Label htmlFor="vendor" className="flex items-center space-x-2 cursor-pointer flex-1">
                        <Building className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="font-medium text-sm">Vendor</div>
                          <div className="text-xs text-gray-600">I have products/services to offer</div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="partner" id="partner" />
                      <Label htmlFor="partner" className="flex items-center space-x-2 cursor-pointer flex-1">
                        <Users className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="font-medium text-sm">Partner</div>
                          <div className="text-xs text-gray-600">I want to promote/resell products</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    "Creating account..."
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Create Account & Continue
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center text-xs text-gray-500">
                You can complete your full profile later when you apply to products
              </div>
              
              <div className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSignup;
