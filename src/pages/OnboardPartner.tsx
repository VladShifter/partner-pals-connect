
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Users, Globe, Building, UserCheck, DollarSign, Handshake } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OnboardPartner = () => {
  const [subtype, setSubtype] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const partnerTypes = [
    {
      value: "white_label",
      icon: Building,
      title: "White Label",
      description: "Rebrand and resell products under your own name"
    },
    {
      value: "reseller",
      icon: Globe,
      title: "Reseller",
      description: "Sell products directly to your customers with commission"
    },
    {
      value: "agent",
      icon: UserCheck,
      title: "Agent",
      description: "Represent vendors in specific territories or markets"
    },
    {
      value: "affiliate",
      icon: DollarSign,
      title: "Affiliate",
      description: "Promote products through content and earn commissions"
    },
    {
      value: "referral",
      icon: Users,
      title: "Referral",
      description: "Refer customers and earn rewards for successful matches"
    },
    {
      value: "advisor",
      icon: Handshake,
      title: "Advisor",
      description: "Provide strategic guidance and consulting services"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subtype) return;
    
    setIsLoading(true);

    // TODO: Implement Supabase partner creation
    console.log("Partner onboarding:", { subtype });

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Welcome to Rezollo!",
        description: "Your partner account has been set up successfully.",
      });
      navigate("/dashboard/partner");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Onboarding</h1>
          <p className="text-gray-600">Choose your partnership focus to get matched with relevant opportunities</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-600" />
              What type of partner are you?
            </CardTitle>
            <CardDescription>
              Select the partnership model that best describes your business approach
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <RadioGroup
                value={subtype}
                onValueChange={setSubtype}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {partnerTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <div key={type.value} className="flex items-start space-x-3 border-2 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                      <Label htmlFor={type.value} className="cursor-pointer flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                          <div className="font-medium text-gray-900">{type.title}</div>
                        </div>
                        <div className="text-sm text-gray-600">{type.description}</div>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>

              <div className="flex justify-between pt-6">
                <Button type="button" variant="outline" onClick={() => navigate("/")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button type="submit" disabled={!subtype || isLoading}>
                  {isLoading ? "Creating Account..." : "Complete Setup"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardPartner;
