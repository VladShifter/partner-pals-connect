import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building, Users, Eye, EyeOff, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuickSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickSignupModal = ({ isOpen, onClose }: QuickSignupModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<"vendor" | "partner">("partner");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
            quick_signup: true // Flag to indicate this was a quick signup
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Create profile with minimal data
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

        onClose();
        // Redirect to marketplace to continue browsing
        navigate("/marketplace");
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Quick Sign Up</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quick-name">Full Name</Label>
            <Input
              id="quick-name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quick-email">Email</Label>
            <Input
              id="quick-email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quick-password">Password</Label>
            <div className="relative">
              <Input
                id="quick-password"
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
                <RadioGroupItem value="vendor" id="quick-vendor" />
                <Label htmlFor="quick-vendor" className="flex items-center space-x-2 cursor-pointer flex-1">
                  <Building className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium text-sm">Vendor</div>
                    <div className="text-xs text-gray-600">I have products/services to offer</div>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="partner" id="quick-partner" />
                <Label htmlFor="quick-partner" className="flex items-center space-x-2 cursor-pointer flex-1">
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
        
        <div className="text-xs text-gray-500 text-center">
          You can complete your full profile later when you apply to products
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickSignupModal;