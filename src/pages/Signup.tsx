
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mail, ArrowLeft, Building, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState<"vendor" | "partner">("vendor");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement Supabase auth and user creation
    console.log("Signup attempt:", { email, name, company, role });
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Account created!",
        description: "Check your email to verify your account.",
      });
      setIsLoading(false);
      // TODO: Redirect to appropriate onboarding
      if (role === "vendor") {
        navigate("/onboard/vendor");
      } else {
        navigate("/onboard/partner");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Join Rezollo</CardTitle>
              <CardDescription>
                Create your account to start building partnerships
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
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Acme Inc."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>I am a...</Label>
                  <RadioGroup
                    value={role}
                    onValueChange={(value) => setRole(value as "vendor" | "partner")}
                    className="grid grid-cols-1 gap-3"
                  >
                    <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="vendor" id="vendor" />
                      <Label htmlFor="vendor" className="flex items-center space-x-2 cursor-pointer flex-1">
                        <Building className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Vendor</div>
                          <div className="text-sm text-gray-600">I have products/services to offer</div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="partner" id="partner" />
                      <Label htmlFor="partner" className="flex items-center space-x-2 cursor-pointer flex-1">
                        <Users className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium">Partner</div>
                          <div className="text-sm text-gray-600">I want to promote/resell products</div>
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
                      Create Account
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
