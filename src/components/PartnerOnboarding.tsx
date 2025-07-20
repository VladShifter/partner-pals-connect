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
import { ArrowLeft, ArrowRight, Check, Mail, User, Building2, Target, DollarSign, Users, Briefcase, MessageSquare } from "lucide-react";
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
  company_name: string;
  phone: string;
  website_url: string;
  country: string;
  business_model: string;
  industry: string;
  experience_years: number | null;
  target_market: string;
  monthly_revenue: number | null;
  team_size: number | null;
  marketing_channels: string[];
  partnership_goals: string[];
  active_marketing_channels: string;
  audience_size: string;
  social_profiles: string;
  previous_partnerships: string;
  why_interested: string;
  partner_roles: string[];
  current_step: number;
  completed_steps: number[];
  product_id: string;
  user_id?: string;
}

const TOTAL_STEPS = 8;

const partnerRoleOptions = [
  "Affiliate Marketer",
  "Agency Partner", 
  "Influencer",
  "Managed Service Provider (MSP)",
  "Publisher",
  "Referral Partner",
  "Reseller Partner",
  "System Integrator (SI)",
  "Value Added Reseller (VAR)",
  "Other"
];

const marketingChannelsOptions = [
  "Social Media",
  "Email Marketing",
  "Content Marketing",
  "SEO",
  "Paid Advertising",
  "Networking Events",
  "Cold Outreach",
  "Referrals",
  "Webinars",
  "Other"
];

const partnershipGoalsOptions = [
  "Generate Additional Revenue",
  "Expand Service Offerings",
  "Serve Existing Clients Better",
  "Enter New Markets",
  "Build Strategic Partnerships",
  "Access New Technology",
  "Scale Business Operations",
  "Other"
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
    company_name: "",
    phone: "",
    website_url: "",
    country: "",
    business_model: "",
    industry: "",
    experience_years: null,
    target_market: "",
    monthly_revenue: null,
    team_size: null,
    marketing_channels: [],
    partnership_goals: [],
    active_marketing_channels: "",
    audience_size: "",
    social_profiles: "",
    previous_partnerships: "",
    why_interested: "",
    partner_roles: [],
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
        // Update existing application
        const { error } = await supabase
          .from("partner_applications")
          .update(updateData)
          .eq("id", applicationData.id);
        
        if (error) throw error;
      } else {
        // Create new application
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

  // Load existing application if user returns
  useEffect(() => {
    if (isOpen && applicationData.email) {
      loadExistingApplication();
    }
  }, [isOpen, applicationData.email]);

  const loadExistingApplication = async () => {
    try {
      const { data, error } = await supabase
        .from("partner_applications")
        .select("*")
        .eq("email", applicationData.email)
        .eq("product_id", productId)
        .eq("status", "in_progress")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setApplicationData(data);
        setCurrentStep(data.current_step);
      }
    } catch (error) {
      console.error("Error loading application:", error);
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
      // Check if user already exists
      const { data: existingUser } = await supabase.auth.getUser();
      
      if (!existingUser.user) {
        // Generate a temporary password
        const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        
        // Create user account
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
      // Update application status to completed
      const { error } = await supabase
        .from("partner_applications")
        .update({ status: "completed", current_step: TOTAL_STEPS })
        .eq("id", applicationData.id);
      
      if (error) throw error;
      
      toast({
        title: "Application submitted!",
        description: "We'll review your application and get back to you soon.",
      });
      
      onClose();
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
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Let's get started!</h3>
              <p className="text-muted-foreground">
                First, we need some basic information to create your partner profile.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={applicationData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={applicationData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Partnership Roles</h3>
              <p className="text-muted-foreground">
                What type of partner are you? (You can select multiple)
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {partnerRoleOptions.map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    id={role}
                    checked={applicationData.partner_roles.includes(role)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateField("partner_roles", [...applicationData.partner_roles, role]);
                      } else {
                        updateField("partner_roles", applicationData.partner_roles.filter(r => r !== role));
                      }
                    }}
                  />
                  <Label htmlFor={role} className="text-sm font-normal cursor-pointer">
                    {role}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Business Information</h3>
              <p className="text-muted-foreground">
                Tell us about your business details.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="company_name" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Company Name
                </Label>
                <Input
                  id="company_name"
                  value={applicationData.company_name}
                  onChange={(e) => updateField("company_name", e.target.value)}
                  placeholder="Your Company Ltd."
                />
              </div>
              
              <div>
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={applicationData.website_url}
                  onChange={(e) => updateField("website_url", e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={applicationData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={applicationData.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  placeholder="United States"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Business Model & Industry</h3>
              <p className="text-muted-foreground">
                Help us understand your business better.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="business_model">Business Model</Label>
                <Select value={applicationData.business_model} onValueChange={(value) => updateField("business_model", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your business model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B2B">B2B</SelectItem>
                    <SelectItem value="B2C">B2C</SelectItem>
                    <SelectItem value="B2B2C">B2B2C</SelectItem>
                    <SelectItem value="Marketplace">Marketplace</SelectItem>
                    <SelectItem value="SaaS">SaaS</SelectItem>
                    <SelectItem value="Agency">Agency</SelectItem>
                    <SelectItem value="Consultancy">Consultancy</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={applicationData.industry} onValueChange={(value) => updateField("industry", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
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

              <div>
                <Label htmlFor="experience_years" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Years of Business Experience
                </Label>
                <Select value={applicationData.experience_years?.toString() || ""} onValueChange={(value) => updateField("experience_years", parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
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
                <Label htmlFor="team_size" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Team Size
                </Label>
                <Select value={applicationData.team_size?.toString() || ""} onValueChange={(value) => updateField("team_size", parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Just me</SelectItem>
                    <SelectItem value="2">2-5 people</SelectItem>
                    <SelectItem value="6">6-10 people</SelectItem>
                    <SelectItem value="11">11-25 people</SelectItem>
                    <SelectItem value="26">25+ people</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Marketing Channels</h3>
              <p className="text-muted-foreground">
                How do you currently reach customers? (Select all that apply)
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {marketingChannelsOptions.map((channel) => (
                <div key={channel} className="flex items-center space-x-2">
                  <Checkbox
                    id={channel}
                    checked={applicationData.marketing_channels.includes(channel)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateField("marketing_channels", [...applicationData.marketing_channels, channel]);
                      } else {
                        updateField("marketing_channels", applicationData.marketing_channels.filter(c => c !== channel));
                      }
                    }}
                  />
                  <Label htmlFor={channel} className="text-sm font-normal cursor-pointer">
                    {channel}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Partnership Goals</h3>
              <p className="text-muted-foreground">
                What do you hope to achieve through this partnership? (Select all that apply)
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {partnershipGoalsOptions.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal}
                    checked={applicationData.partnership_goals.includes(goal)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateField("partnership_goals", [...applicationData.partnership_goals, goal]);
                      } else {
                        updateField("partnership_goals", applicationData.partnership_goals.filter(g => g !== goal));
                      }
                    }}
                  />
                  <Label htmlFor={goal} className="text-sm font-normal cursor-pointer">
                    {goal}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Marketing Details</h3>
              <p className="text-muted-foreground">
                Tell us about your marketing reach and channels.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="active_marketing_channels">Active Marketing Channels</Label>
                <Textarea
                  id="active_marketing_channels"
                  value={applicationData.active_marketing_channels}
                  onChange={(e) => updateField("active_marketing_channels", e.target.value)}
                  placeholder="e.g., LinkedIn, Email, PPC..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="audience_size">Audience Size</Label>
                <Input
                  id="audience_size"
                  value={applicationData.audience_size}
                  onChange={(e) => updateField("audience_size", e.target.value)}
                  placeholder="Total monthly reach"
                />
              </div>

              <div>
                <Label htmlFor="social_profiles">Links to Social Profiles</Label>
                <Textarea
                  id="social_profiles"
                  value={applicationData.social_profiles}
                  onChange={(e) => updateField("social_profiles", e.target.value)}
                  placeholder="LinkedIn, Twitter, etc."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="target_market" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Target Market
                </Label>
                <Textarea
                  id="target_market"
                  value={applicationData.target_market}
                  onChange={(e) => updateField("target_market", e.target.value)}
                  placeholder="Describe your target customers and market (e.g., small businesses, e-commerce, healthcare, etc.)"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="monthly_revenue" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Current Monthly Revenue
                </Label>
                <Select value={applicationData.monthly_revenue?.toString() || ""} onValueChange={(value) => updateField("monthly_revenue", parseFloat(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select revenue range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Less than $1,000</SelectItem>
                    <SelectItem value="1000">$1,000 - $5,000</SelectItem>
                    <SelectItem value="5000">$5,000 - $10,000</SelectItem>
                    <SelectItem value="10000">$10,000 - $25,000</SelectItem>
                    <SelectItem value="25000">$25,000 - $50,000</SelectItem>
                    <SelectItem value="50000">$50,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Final Details</h3>
              <p className="text-muted-foreground">
                Just a few more questions to complete your application.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="previous_partnerships">Previous Partnership Experience</Label>
                <Textarea
                  id="previous_partnerships"
                  value={applicationData.previous_partnerships}
                  onChange={(e) => updateField("previous_partnerships", e.target.value)}
                  placeholder="Tell us about any previous partnerships or reseller programs you've been part of..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="why_interested" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Why are you interested in {productName}?
                </Label>
                <Textarea
                  id="why_interested"
                  value={applicationData.why_interested}
                  onChange={(e) => updateField("why_interested", e.target.value)}
                  placeholder="What specifically interests you about this product and how do you see it fitting into your business?"
                  rows={4}
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Partner Application - {productName}
          </DialogTitle>
          <DialogDescription>
            Step {currentStep} of {TOTAL_STEPS}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-6">
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            {renderStep()}
          </CardContent>
        </Card>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === TOTAL_STEPS ? (
            <Button onClick={submitApplication} disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Application"}
              <Check className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};