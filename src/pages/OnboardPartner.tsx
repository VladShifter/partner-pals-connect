
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { ArrowRight, ArrowLeft, Building, Package, Plus, X, Mail, User, DollarSign, Handshake, Target, Briefcase, MessageSquare, Crown, UserCheck, TrendingUp, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ApplicationData {
  id?: string;
  email: string;
  name: string;
  phone: string;
  
  // Partnership Details
  partner_roles: string[];
  
  // Entity Type
  entity_type: 'individual' | 'company';
  
  // Business Information
  company_name: string;
  company_description: string;
  website_url: string;
  country: string;
  business_model: string;
  individual_type: string;
  industry: string;
  experience_years: number | null;
  team_size: number | null;
  revenue_goals: number | null;
  
  // Marketing
  marketing_channels: string[];
  audience_size: string;
  social_profiles: string;
  
  // Additional Info
  why_interested: string;
  previous_partnerships: string;
  partnership_goals: string[];
  
  current_step: number;
  completed_steps: number[];
  product_id: string;
  user_id?: string;
}

const OnboardPartner = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const productId = searchParams.get('productId') || '';
  const productName = searchParams.get('productName') || '';

  const totalSteps = 5;

  const [applicationData, setApplicationData] = useState<ApplicationData>({
    email: "",
    name: "",
    phone: "",
    partner_roles: [],
    entity_type: 'individual',
    company_name: "",
    company_description: "",
    website_url: "",
    country: "",
    business_model: "",
    individual_type: "",
    industry: "",
    experience_years: null,
    team_size: null,
    revenue_goals: null,
    marketing_channels: [],
    audience_size: "",
    social_profiles: "",
    why_interested: "",
    previous_partnerships: "",
    partnership_goals: [],
    current_step: 1,
    completed_steps: [1],
    product_id: productId,
  });

  const updateField = (field: keyof ApplicationData, value: any) => {
    setApplicationData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof ApplicationData, value: string, checked: boolean) => {
    const currentArray = (applicationData[field] as string[]) || [];
    if (checked) {
      updateField(field, [...currentArray, value]);
    } else {
      updateField(field, currentArray.filter(item => item !== value));
    }
  };

  // Auto-save function
  const saveProgress = async (data: Partial<ApplicationData>, step: number) => {
    try {
      const updateData = {
        ...data,
        current_step: step,
        completed_steps: Array.from(new Set([...applicationData.completed_steps, step])),
        updated_at: new Date().toISOString(),
      };

      if (applicationData.id) {
        const { error } = await supabase
          .from("partner_applications")
          .update(updateData)
          .eq("id", applicationData.id);
        
        if (error) throw error;
      } else {
        const { data: newApp, error } = await supabase
          .from("partner_applications")
          .insert({ ...applicationData, ...updateData })
          .select()
          .single();
        
        if (error) throw error;
        setApplicationData(prev => ({ ...prev, id: newApp.id }));
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      // Save email and name to database immediately
      await saveProgress({ 
        email: applicationData.email, 
        name: applicationData.name 
      }, 1);
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    
    try {
      await saveProgress(applicationData, totalSteps);
      
      toast({
        title: "🎉 Application Submitted Successfully!",
        description: "Your partnership application has been submitted for review. We'll contact you within 24-48 hours.",
      });
      
      navigate("/partner/success");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const partnerRoleOptions = [
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

  const marketingChannelsOptions = [
    "🤝 My Industry Networking Connections",
    "📈 Upselling to Current Clients", 
    "📱 Social Media",
    "📧 Email Marketing",
    "📝 Content Marketing",
    "🔍 SEO",
    "💰 Paid Advertising",
    "🎯 Networking Events",
    "📞 Cold Outreach",
    "👥 Referrals",
    "🎥 Webinars",
    "⚡ Other"
  ];

  const individualTypeOptions = [
    "Solopreneur",
    "Entrepreneur", 
    "Industry Expert",
    "Business Consultant",
    "Agency Owner",
    "Consulting Company",
    "System Integrator",
    "Influencer",
    "Other"
  ];

  const partnershipGoalsOptions = [
    "💰 Increase Revenue",
    "📊 Expand Service Portfolio", 
    "🌍 Enter New Markets",
    "🤝 Build Strategic Partnerships",
    "📚 Gain Reselling Experience",
    "💎 Create Passive Income",
    "⚡ Other"
  ];

  const businessModelOptions = [
    "🎯 B2B",
    "🛍️ B2C", 
    "🏢 B2B2C",
    "🌐 Marketplace",
    "📱 SaaS",
    "🏭 E-commerce",
    "💼 Consulting",
    "📚 Education",
    "⚡ Other"
  ];

  const industryOptions = [
    "AI SaaS", "Analytics", "E-commerce", "EdTech", "Energy", "FinTech", 
    "GovTech", "Healthcare", "HoReCa", "Legal", "Logistics", "Manufacturing", 
    "Marketing", "Productivity", "PropTech", "Retail", "Travel"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Partner Application</h1>
            <div className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</div>
          </div>
          {productName && (
            <p className="text-gray-600 mb-4">
              Applying for partnership with: <span className="font-semibold">{productName}</span>
            </p>
          )}
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
                    value={applicationData.email}
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
                    value={applicationData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={applicationData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
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

        {/* Step 2: Partnership Type */}
        {currentStep === 2 && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Handshake className="w-5 h-5 mr-2 text-blue-600" />
                Partnership Type
              </CardTitle>
              <CardDescription>
                What type of partnership are you interested in?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {partnerRoleOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        applicationData.partner_roles.includes(option.value)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        const isSelected = applicationData.partner_roles.includes(option.value);
                        handleCheckboxChange("partner_roles", option.value, !isSelected);
                      }}
                    >
                      <div className="font-medium text-sm mb-1">{option.label}</div>
                      <div className="text-xs text-gray-600">{option.description}</div>
                    </div>
                  ))}
                </div>

                {/* Previous Partnership Experience */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Do you have experience with these types of partnerships?</Label>
                  <RadioGroup
                    value={applicationData.previous_partnerships}
                    onValueChange={(value) => updateField("previous_partnerships", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="experience-yes" />
                      <Label htmlFor="experience-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="experience-no" />
                      <Label htmlFor="experience-no">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="experience-other" />
                      <Label htmlFor="experience-other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Additional Info Field */}
                <div className="space-y-2">
                  <Label htmlFor="why_interested">Why are you interested in this partnership?</Label>
                  <Textarea
                    id="why_interested"
                    placeholder="Tell us what attracts you to this opportunity..."
                    value={applicationData.why_interested}
                    onChange={(e) => updateField("why_interested", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button type="submit" disabled={applicationData.partner_roles.length === 0}>
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Business Information */}
        {currentStep === 3 && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-600" />
                Business Information
              </CardTitle>
              <CardDescription>
                Tell us about your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="space-y-3">
                  <Label>Entity Type</Label>
                  <RadioGroup
                    value={applicationData.entity_type}
                    onValueChange={(value: 'individual' | 'company') => updateField("entity_type", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual">Individual</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="company" />
                      <Label htmlFor="company">Company</Label>
                    </div>
                  </RadioGroup>
                </div>

                {applicationData.entity_type === 'company' && (
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={applicationData.company_name}
                      onChange={(e) => updateField("company_name", e.target.value)}
                      placeholder="Your Company Inc."
                      required
                    />
                  </div>
                )}

                {applicationData.entity_type === 'individual' && (
                  <div className="space-y-2">
                    <Label htmlFor="individual_type">Individual Type</Label>
                    <Select value={applicationData.individual_type} onValueChange={(value) => updateField("individual_type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your type" />
                      </SelectTrigger>
                      <SelectContent>
                        {individualTypeOptions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={applicationData.industry} onValueChange={(value) => updateField("industry", value)}>
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
                  <Label htmlFor="business_model">Business Model</Label>
                  <Select value={applicationData.business_model} onValueChange={(value) => updateField("business_model", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your business model" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessModelOptions.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website_url">Website URL (Optional)</Label>
                  <Input
                    id="website_url"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={applicationData.website_url}
                    onChange={(e) => updateField("website_url", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="United States"
                    value={applicationData.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    required
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

        {/* Step 4: Experience & Scale */}
        {currentStep === 4 && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Experience & Scale
              </CardTitle>
              <CardDescription>
                Help us understand your experience and business scale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="experience_years">Years of Experience</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    min="0"
                    placeholder="5"
                    value={applicationData.experience_years || ""}
                    onChange={(e) => updateField("experience_years", e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team_size">Team Size</Label>
                  <Input
                    id="team_size"
                    type="number"
                    min="1"
                    placeholder="10"
                    value={applicationData.team_size || ""}
                    onChange={(e) => updateField("team_size", e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revenue_goals">Monthly Revenue Goals ($)</Label>
                  <Input
                    id="revenue_goals"
                    type="number"
                    min="0"
                    placeholder="10000"
                    value={applicationData.revenue_goals || ""}
                    onChange={(e) => updateField("revenue_goals", e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience_size">Target Audience Size</Label>
                  <Input
                    id="audience_size"
                    placeholder="e.g., 10,000 newsletter subscribers, 5,000 LinkedIn connections"
                    value={applicationData.audience_size}
                    onChange={(e) => updateField("audience_size", e.target.value)}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(3)}>
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

        {/* Step 5: Marketing Strategy */}
        {currentStep === 5 && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Marketing Strategy
              </CardTitle>
              <CardDescription>
                Tell us about your marketing approach
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNextStep} className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Primary Marketing Channels</Label>
                  <p className="text-sm text-muted-foreground">Select all that apply:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {marketingChannelsOptions.map((channel) => (
                      <div key={channel} className="flex items-center space-x-2">
                        <Checkbox
                          id={`channel-${channel}`}
                          checked={applicationData.marketing_channels.includes(channel)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("marketing_channels", channel, checked as boolean)
                          }
                        />
                        <Label htmlFor={`channel-${channel}`} className="text-sm font-normal">
                          {channel}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Partnership Goals</Label>
                  <p className="text-sm text-muted-foreground">What are you hoping to achieve?</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {partnershipGoalsOptions.map((goal) => (
                      <div key={goal} className="flex items-center space-x-2">
                        <Checkbox
                          id={`goal-${goal}`}
                          checked={applicationData.partnership_goals.includes(goal)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("partnership_goals", goal, checked as boolean)
                          }
                        />
                        <Label htmlFor={`goal-${goal}`} className="text-sm font-normal">
                          {goal}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social_profiles">Social Media Profiles/Portfolio Links</Label>
                  <Textarea
                    id="social_profiles"
                    placeholder="LinkedIn: linkedin.com/in/yourname&#10;Twitter: @yourhandle&#10;Website: yoursite.com"
                    value={applicationData.social_profiles}
                    onChange={(e) => updateField("social_profiles", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(4)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Submit Application"}
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

export default OnboardPartner;
