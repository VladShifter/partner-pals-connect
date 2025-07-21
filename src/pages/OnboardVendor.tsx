
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Building, Package, Plus, X, Mail, User, DollarSign, Handshake, Target, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VendorData {
  // Step 1: Contact info
  email: string;
  name: string;
  
  // Step 2: Company info
  companyName: string;
  website: string;
  niche: string;
  description: string;
  
  // Step 3: Product info
  productTitle: string;
  productPitch: string;
  demoUrl: string;
  
  // Step 4: Business model
  monetizationModel: string[];
  monetizationOther?: string;
  averageDealSize: string[];
  partnershipModels: string[];
  partnerProfiles: string[];
  partnerEarnings: string;
  interestedRegions: string[];
  
  // White-label specific (only if full white-label selected)
  isWhiteLabelReady?: string;
  canRunDemosUnderBrand?: string;
  providesMarketingAssets?: string;
  infrastructureReady?: string;
}

const OnboardVendor = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalSteps = 4;

  const [vendorData, setVendorData] = useState<VendorData>({
    email: "",
    name: "",
    companyName: "",
    website: "",
    niche: "",
    description: "",
    productTitle: "",
    productPitch: "",
    demoUrl: "",
    monetizationModel: [],
    averageDealSize: [],
    partnershipModels: [],
    partnerProfiles: [],
    partnerEarnings: "",
    interestedRegions: [],
  });

  const updateField = (field: keyof VendorData, value: any) => {
    setVendorData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof VendorData, value: string, checked: boolean) => {
    const currentArray = (vendorData[field] as string[]) || [];
    if (checked) {
      updateField(field, [...currentArray, value]);
    } else {
      updateField(field, currentArray.filter(item => item !== value));
    }
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      // Save email and name to database immediately
      console.log("Saving initial vendor data:", { email: vendorData.email, name: vendorData.name });
      // TODO: Save to Supabase
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    
    console.log("Final vendor submission:", vendorData);
    // TODO: Complete Supabase vendor and product creation
    
    setTimeout(() => {
      toast({
        title: "🎉 Application Submitted Successfully!",
        description: "Your vendor application has been submitted for review. We'll contact you within 24-48 hours.",
      });
      navigate("/dashboard/vendor");
    }, 1000);
  };

  const isWhiteLabelSelected = vendorData.partnershipModels.includes("white_label");

  // Industry options from the tags system
  const industryOptions = [
    "AI SaaS", "Analytics", "E-commerce", "EdTech", "Energy", "FinTech", 
    "GovTech", "Healthcare", "HoReCa", "Legal", "Logistics", "Manufacturing", 
    "Marketing", "Productivity", "PropTech", "Retail", "Travel"
  ];

  // Partnership models synchronized with reseller onboarding
  const partnershipModelOptions = [
    {
      value: "white_label",
      label: "🏷️ White Label",
      description: "Rebrand and sell as your own product"
    },
    {
      value: "reseller",
      label: "🤝 Reseller",
      description: "Sell the product under original branding"
    },
    {
      value: "affiliate",
      label: "📈 Affiliate",
      description: "Promote and earn commission on referrals"
    },
    {
      value: "referral",
      label: "👥 Referral",
      description: "Refer clients and get paid per successful sale"
    },
    {
      value: "advisor",
      label: "🎯 Advisor",
      description: "Provide strategic guidance and consulting"
    },
    {
      value: "other",
      label: "⚡ Other",
      description: "Custom partnership arrangement"
    }
  ];

  // Partner profile options
  const individualTypeOptions = [
    "🏢 System Integrator",
    "👤 Solopreneur",
    "👔 Entrepreneur", 
    "🎯 Industry Expert",
    "💼 Business Consultant",
    "🏭 Agency Owner",
    "🏢 Consulting Company",
    "📢 Influencer",
    "🔧 Other"
  ];

  // Region options
  const regionOptions = [
    "Any",
    "North America",
    "Europe",
    "Asia Pacific",
    "Latin America",
    "Africa",
    "Middle East"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Vendor Onboarding</h1>
            <div className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</div>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        {/* Step 1: Contact Information */}
        {currentStep === 1 && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Let's start with your basic contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={vendorData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={vendorData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => navigate("/")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button type="submit">
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Company Information */}
        {currentStep === 2 && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-600" />
                Product/Service Information
              </CardTitle>
              <CardDescription>
                Tell us about your company and main product/service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Your Company Inc."
                    value={vendorData.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Company Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={vendorData.website}
                    onChange={(e) => updateField("website", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="niche">Niche/Industry</Label>
                  <Select value={vendorData.niche} onValueChange={(value) => updateField("niche", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industryOptions.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Product/Service Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your main product or service in 1-2 sentences..."
                    value={vendorData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button type="submit">
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Product Information */}
        {currentStep === 3 && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-600" />
                Product Information
              </CardTitle>
              <CardDescription>
                Tell us about your main product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productTitle">Product Title</Label>
                  <Input
                    id="productTitle"
                    type="text"
                    placeholder="e.g., CRM Software for Small Businesses"
                    value={vendorData.productTitle}
                    onChange={(e) => updateField("productTitle", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productPitch">Product Pitch</Label>
                  <Textarea
                    id="productPitch"
                    placeholder="Short pitch describing your product and its benefits..."
                    value={vendorData.productPitch}
                    onChange={(e) => updateField("productPitch", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="demoUrl">Demo URL (Optional)</Label>
                  <Input
                    id="demoUrl"
                    type="url"
                    placeholder="https://demo.yourproduct.com"
                    value={vendorData.demoUrl}
                    onChange={(e) => updateField("demoUrl", e.target.value)}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button type="submit">
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Business Model & Partnership */}
        {currentStep === 4 && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                Business Model & Partnership
              </CardTitle>
              <CardDescription>
                Help us understand your business model and partnership preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNextStep} className="space-y-6">
                
                {/* Monetization Model */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Monetization model</Label>
                  <p className="text-sm text-muted-foreground">Choose one or more:</p>
                  <div className="space-y-2">
                    {[
                      "💰 One-off purchase",
                      "🔄 Subscription",
                      "📊 Usage-based (tokens, seats, etc.)",
                      "🔧 Other"
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`monetization-${option}`}
                          checked={vendorData.monetizationModel.includes(option)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("monetizationModel", option, checked as boolean)
                          }
                        />
                        <Label htmlFor={`monetization-${option}`} className="text-sm font-normal">
                          {option}
                        </Label>
                      </div>
                    ))}
                    
                    {/* Other field for monetization model */}
                    {vendorData.monetizationModel.includes("🔧 Other") && (
                      <div className="ml-6">
                        <Input
                          placeholder="Please specify..."
                          value={vendorData.monetizationOther || ""}
                          onChange={(e) => updateField("monetizationOther", e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    )}
                  </div>
                </div>

                 {/* Average Deal Size */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Average deal size (USD)</Label>
                  <p className="text-sm text-muted-foreground">Select monthly ranges that apply:</p>
                  <div className="space-y-2">
                    {[
                      "Up to $5,000/month",
                      "$5,000-$10,000/month",
                      "$10,000-$20,000/month", 
                      "$20,000-$50,000/month",
                      "$50,000+/month"
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`deal-size-${option}`}
                          checked={vendorData.averageDealSize.includes(option)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("averageDealSize", option, checked as boolean)
                          }
                        />
                        <Label htmlFor={`deal-size-${option}`} className="text-sm font-normal">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                 {/* Partnership Models */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Which partnership model(s) are you looking for?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {partnershipModelOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          vendorData.partnershipModels.includes(option.value)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => {
                          const isSelected = vendorData.partnershipModels.includes(option.value);
                          handleCheckboxChange("partnershipModels", option.value, !isSelected);
                        }}
                      >
                        <div className="font-medium text-sm mb-1">{option.label}</div>
                        <div className="text-xs text-gray-600">{option.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Partner Profiles */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">What partner profiles interest you?</Label>
                  <div className="space-y-2">
                    {individualTypeOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`profiles-${option}`}
                          checked={vendorData.partnerProfiles.includes(option)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("partnerProfiles", option, checked as boolean)
                          }
                        />
                        <Label htmlFor={`profiles-${option}`} className="text-sm font-normal">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                 {/* Partner Earnings */}
                <div className="space-y-2">
                  <Label htmlFor="partnerEarnings">How much can (or do) partners in your industry typically earn?</Label>
                  <Input
                    id="partnerEarnings"
                    type="text"
                    placeholder="e.g., $50,000-$200,000 annually"
                    value={vendorData.partnerEarnings}
                    onChange={(e) => updateField("partnerEarnings", e.target.value)}
                    required
                  />
                </div>

                 {/* Interested Regions */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">In which regions/countries are you interested in partners?</Label>
                  <div className="space-y-2">
                    {regionOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`region-${option}`}
                          checked={vendorData.interestedRegions.includes(option)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("interestedRegions", option, checked as boolean)
                          }
                        />
                        <Label htmlFor={`region-${option}`} className="text-sm font-normal">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* White-label specific questions */}
                {isWhiteLabelSelected && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900">White-label specific questions</h4>
                    
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Is your product fully white-label-ready?</Label>
                      <p className="text-sm text-muted-foreground">(API, custom domain, brandable UI, etc.)</p>
                      <RadioGroup
                        value={vendorData.isWhiteLabelReady || ""}
                        onValueChange={(value) => updateField("isWhiteLabelReady", value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="wl-ready-yes" />
                          <Label htmlFor="wl-ready-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="wl-ready-no" />
                          <Label htmlFor="wl-ready-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium">Can your sales reps run demos and support under the reseller's brand?</Label>
                      <p className="text-sm text-muted-foreground">The more enablement you give resellers, the easier they land warm enterprise intros — boosting your sales.</p>
                      <RadioGroup
                        value={vendorData.canRunDemosUnderBrand || ""}
                        onValueChange={(value) => updateField("canRunDemosUnderBrand", value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="demos-yes" />
                          <Label htmlFor="demos-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="demos-no" />
                          <Label htmlFor="demos-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="unsure" id="demos-unsure" />
                          <Label htmlFor="demos-unsure">Unsure</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium">Will you provide marketing assets for re-branding?</Label>
                      <RadioGroup
                        value={vendorData.providesMarketingAssets || ""}
                        onValueChange={(value) => updateField("providesMarketingAssets", value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="assets-yes" />
                          <Label htmlFor="assets-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="assets-no" />
                          <Label htmlFor="assets-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="basic" id="assets-basic" />
                          <Label htmlFor="assets-basic">Only basic assets</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium">Is your infrastructure prepared to serve end-users under the reseller's brand?</Label>
                      <RadioGroup
                        value={vendorData.infrastructureReady || ""}
                        onValueChange={(value) => updateField("infrastructureReady", value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes-we-handle" id="infra-yes" />
                          <Label htmlFor="infra-yes">Yes, we handle support</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="infra-no" />
                          <Label htmlFor="infra-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="reseller-handles" id="infra-reseller" />
                          <Label htmlFor="infra-reseller">End-user support will be handled by the reseller</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(3)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Complete Setup"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OnboardVendor;
