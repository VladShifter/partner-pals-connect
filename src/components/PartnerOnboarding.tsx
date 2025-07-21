import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, Check, Mail, User, Building2, Target, DollarSign, Users, Briefcase, MessageSquare, Crown, UserCheck, TrendingUp, Handshake } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PartnerOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

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

const TOTAL_STEPS = 6;

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

export const PartnerOnboarding: React.FC<PartnerOnboardingProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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

  const updateField = (field: keyof ApplicationData, value: any) => {
    setApplicationData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = async () => {
    if (currentStep === 1 && (!applicationData.email || !applicationData.name)) {
      toast({
        title: "Required fields",
        description: "Please fill in your email and name to continue.",
        variant: "destructive",
      });
      return;
    }

    // Create user account on first step completion
    if (currentStep === 1 && applicationData.email && applicationData.name) {
      await createUserAccount();
    }

    // Auto-save current step
    await saveProgress(applicationData, currentStep);
    
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const createUserAccount = async () => {
    try {
      const { data: existingUser } = await supabase.auth.getUser();
      
      if (!existingUser.user) {
        const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        
        const { data, error } = await supabase.auth.signUp({
          email: applicationData.email,
          password: tempPassword,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: applicationData.name,
            }
          }
        });

        if (error) {
          console.error("Error creating user account:", error);
          return;
        }

        if (data.user) {
          setApplicationData(prev => ({ ...prev, user_id: data.user.id }));
          
          toast({
            title: "Account created!",
            description: "We've created your partner account. Check your email to verify it.",
          });
        }
      }
    } catch (error) {
      console.error("Error in createUserAccount:", error);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const submitApplication = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("partner_applications")
        .update({ status: "completed", current_step: TOTAL_STEPS })
        .eq("id", applicationData.id);
      
      if (error) throw error;
      
      toast({
        title: "Application submitted!",
        description: "We'll review your application and get back to you soon.",
      });
      
      // Redirect to success page instead of closing
      window.location.href = '/partner/success';
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Welcome!</h3>
              <p className="text-muted-foreground">
                Let's start your partnership journey with {productName}
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="flex items-center gap-2 text-base font-medium">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={applicationData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="your@email.com"
                  className="mt-2 h-12"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="name" className="flex items-center gap-2 text-base font-medium">
                  <User className="w-4 h-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={applicationData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="John Doe"
                  className="mt-2 h-12"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Partnership Roles</h3>
              <p className="text-muted-foreground">
                What type of partner do you want to be? You can select multiple roles.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {partnerRoleOptions.map((role) => (
                <div 
                  key={role.value} 
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    applicationData.partner_roles.includes(role.value) 
                      ? 'border-primary bg-primary/5 shadow-sm' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => {
                    const isSelected = applicationData.partner_roles.includes(role.value);
                    if (isSelected) {
                      updateField("partner_roles", applicationData.partner_roles.filter(r => r !== role.value));
                    } else {
                      updateField("partner_roles", [...applicationData.partner_roles, role.value]);
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center mt-1">
                      <Checkbox
                        checked={applicationData.partner_roles.includes(role.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{role.label}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">About You</h3>
              <p className="text-muted-foreground">
                Tell us whether you're applying as an individual or representing a company.
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">Are you applying as:</Label>
                <RadioGroup 
                  value={applicationData.entity_type} 
                  onValueChange={(value: 'individual' | 'company') => {
                    updateField("entity_type", value);
                    // Clear fields that are specific to the other type
                    if (value === 'individual') {
                      updateField("company_description", "");
                    } else {
                      updateField("individual_type", "");
                    }
                  }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    applicationData.entity_type === 'individual' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual" className="cursor-pointer font-medium">
                        Individual/Personal
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 ml-6">
                      Freelancer, consultant, or personal brand
                    </p>
                  </div>
                  
                  <div className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    applicationData.entity_type === 'company' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="company" />
                      <Label htmlFor="company" className="cursor-pointer font-medium">
                        Company/Business
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 ml-6">
                      Agency, consultancy, or established business
                    </p>
                  </div>
                </RadioGroup>
              </div>

              {applicationData.entity_type === 'company' && (
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <Label htmlFor="company_name" className="text-base font-medium">
                      Company Name *
                    </Label>
                    <Input
                      id="company_name"
                      value={applicationData.company_name}
                      onChange={(e) => updateField("company_name", e.target.value)}
                      placeholder="Your Company Ltd."
                      className="mt-2 h-12"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website_url" className="text-base font-medium">
                      Company Website *
                    </Label>
                    <Input
                      id="website_url"
                      type="url"
                      value={applicationData.website_url}
                      onChange={(e) => updateField("website_url", e.target.value)}
                      placeholder="https://yourcompany.com"
                      className="mt-2 h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company_description" className="text-base font-medium">
                      What does your company do? (1-2 sentences)
                    </Label>
                    <Textarea
                      id="company_description"
                      value={applicationData.company_description}
                      onChange={(e) => updateField("company_description", e.target.value)}
                      placeholder="Briefly describe what your company does and what services you provide..."
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                </div>
              )}

              {applicationData.entity_type === 'individual' && (
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <Label htmlFor="company_name" className="text-base font-medium">
                      Business/Brand Name (Optional)
                    </Label>
                    <Input
                      id="company_name"
                      value={applicationData.company_name}
                      onChange={(e) => updateField("company_name", e.target.value)}
                      placeholder="Your Personal Brand"
                      className="mt-2 h-12"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website_url" className="text-base font-medium">
                      Personal Website (Optional)
                    </Label>
                    <Input
                      id="website_url"
                      type="url"
                      value={applicationData.website_url}
                      onChange={(e) => updateField("website_url", e.target.value)}
                      placeholder="https://yoursite.com"
                      className="mt-2 h-12"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-base font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={applicationData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="mt-2 h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="country" className="text-base font-medium">
                    Country
                  </Label>
                  <Input
                    id="country"
                    value={applicationData.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    placeholder="United States"
                    className="mt-2 h-12"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Professional Background</h3>
              <p className="text-muted-foreground">
                Help us understand your experience and business profile.
              </p>
            </div>
            
            <div className="space-y-6">
              {applicationData.entity_type === 'individual' && (
                <div>
                  <Label htmlFor="individual_type" className="text-base font-medium">
                    How do you best describe yourself?
                  </Label>
                  <Select value={applicationData.individual_type} onValueChange={(value) => updateField("individual_type", value)}>
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Select what best describes you" />
                    </SelectTrigger>
                    <SelectContent>
                      {individualTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {applicationData.entity_type === 'company' && (
                <div>
                  <Label htmlFor="business_model" className="text-base font-medium">
                    Business Model
                  </Label>
                  <Select value={applicationData.business_model} onValueChange={(value) => updateField("business_model", value)}>
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Select your business model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B2B">B2B</SelectItem>
                      <SelectItem value="B2C">B2C</SelectItem>
                      <SelectItem value="B2B2C">B2B2C</SelectItem>
                      <SelectItem value="Agency">Agency</SelectItem>
                      <SelectItem value="Consultancy">Consultancy</SelectItem>
                      <SelectItem value="SaaS">SaaS</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label htmlFor="industry" className="text-base font-medium">
                  Industries You Work In
                </Label>
                <Select value={applicationData.industry} onValueChange={(value) => updateField("industry", value)}>
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue placeholder="Select your primary industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="E-commerce">E-commerce</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience_years" className="text-base font-medium">
                    Years of Experience *
                  </Label>
                  <Select value={applicationData.experience_years?.toString() || ""} onValueChange={(value) => updateField("experience_years", parseInt(value))}>
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Less than 1 year</SelectItem>
                      <SelectItem value="1">1-2 years</SelectItem>
                      <SelectItem value="3">3-5 years</SelectItem>
                      <SelectItem value="6">6-10 years</SelectItem>
                      <SelectItem value="11">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="team_size" className="text-base font-medium">
                    Team Size
                  </Label>
                  <Select value={applicationData.team_size?.toString() || ""} onValueChange={(value) => updateField("team_size", parseInt(value))}>
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Team size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Only me</SelectItem>
                      <SelectItem value="2">2-5 people</SelectItem>
                      <SelectItem value="6">6-10 people</SelectItem>
                      <SelectItem value="11">11-25 people</SelectItem>
                      <SelectItem value="26">25+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Marketing Strategy</h3>
              <p className="text-muted-foreground">
                How do you plan to promote and sell this product?
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">
                  Marketing Channels You'll Use (Select all that apply)
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {marketingChannelsOptions.map((channel) => (
                    <div 
                      key={channel} 
                      className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-sm ${
                        applicationData.marketing_channels.includes(channel) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => {
                        const isSelected = applicationData.marketing_channels.includes(channel);
                        if (isSelected) {
                          updateField("marketing_channels", applicationData.marketing_channels.filter(c => c !== channel));
                        } else {
                          updateField("marketing_channels", [...applicationData.marketing_channels, channel]);
                        }
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={applicationData.marketing_channels.includes(channel)}
                        />
                        <Label className="text-sm font-normal cursor-pointer">
                          {channel}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="audience_size" className="text-base font-medium">
                  Total Audience Size/Monthly Reach
                </Label>
                <Input
                  id="audience_size"
                  value={applicationData.audience_size}
                  onChange={(e) => updateField("audience_size", e.target.value)}
                  placeholder="e.g., 10,000 social followers, 500 monthly website visitors"
                  className="mt-2 h-12"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Goals & Finalization</h3>
              <p className="text-muted-foreground">
                Let's finalize your application with goals and additional details.
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="revenue_goals" className="flex items-center gap-2 text-base font-medium">
                  <DollarSign className="w-4 h-4" />
                  Monthly Revenue Goal from This Product
                </Label>
                <Select value={applicationData.revenue_goals?.toString() || ""} onValueChange={(value) => updateField("revenue_goals", parseFloat(value))}>
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue placeholder="Select your monthly revenue goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500">$500 - $1,000</SelectItem>
                    <SelectItem value="1000">$1,000 - $2,500</SelectItem>
                    <SelectItem value="2500">$2,500 - $5,000</SelectItem>
                    <SelectItem value="5000">$5,000 - $10,000</SelectItem>
                    <SelectItem value="10000">$10,000 - $25,000</SelectItem>
                    <SelectItem value="25000">$25,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">
                  Partnership Goals (Select all that apply)
                </Label>
                <div className="grid grid-cols-1 gap-3">
                  {partnershipGoalsOptions.map((goal) => (
                    <div 
                      key={goal}
                      className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-sm ${
                        applicationData.partnership_goals.includes(goal) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => {
                        const isSelected = applicationData.partnership_goals.includes(goal);
                        if (isSelected) {
                          updateField("partnership_goals", applicationData.partnership_goals.filter(g => g !== goal));
                        } else {
                          updateField("partnership_goals", [...applicationData.partnership_goals, goal]);
                        }
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={applicationData.partnership_goals.includes(goal)}
                        />
                        <Label className="text-sm font-normal cursor-pointer">
                          {goal}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="social_profiles" className="text-base font-medium">
                  Social Media Profiles & Links
                </Label>
                <Textarea
                  id="social_profiles"
                  value={applicationData.social_profiles}
                  onChange={(e) => updateField("social_profiles", e.target.value)}
                  placeholder="LinkedIn: linkedin.com/in/yourname&#10;Twitter: @yourhandle&#10;Website: yoursite.com"
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="why_interested" className="text-base font-medium">
                  Why are you interested in partnering with {productName}?
                </Label>
                <Textarea
                  id="why_interested"
                  value={applicationData.why_interested}
                  onChange={(e) => updateField("why_interested", e.target.value)}
                  placeholder="What specifically interests you about this product and how do you see it fitting into your business?"
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="previous_partnerships" className="text-base font-medium">
                  Previous Partnership Experience (Optional)
                </Label>
                <Textarea
                  id="previous_partnerships"
                  value={applicationData.previous_partnerships}
                  onChange={(e) => updateField("previous_partnerships", e.target.value)}
                  placeholder="Tell us about any previous partnerships or reseller programs you've been part of..."
                  rows={3}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Crown className="w-5 h-5 text-primary" />
            Partner Application - {productName}
          </DialogTitle>
          <DialogDescription className="text-base">
            Step {currentStep} of {TOTAL_STEPS}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-6">
          <Progress value={progress} className="w-full h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </div>

        <Card className="border-0 shadow-none">
          <CardContent className="pt-6 px-0">
            {renderStep()}
          </CardContent>
        </Card>

        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="h-12 px-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === TOTAL_STEPS ? (
            <Button onClick={submitApplication} disabled={isLoading} className="h-12 px-8">
              {isLoading ? "Submitting..." : "Submit Application"}
              <Check className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={nextStep} className="h-12 px-8">
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};