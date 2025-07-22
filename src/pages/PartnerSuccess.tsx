import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Mail, Calendar, Gift, FileText, Users, ExternalLink, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PartnerSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <div className="max-w-4xl mx-auto space-y-8 pt-8">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="relative inline-flex">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-xl">
              <CheckCircle className="h-10 w-10 text-white" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-lg">✨</span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Congratulations!</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your partnership application has been successfully submitted and is now under review
          </p>
        </div>

        {/* Next Steps */}
        <Card className="border-2 border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Clock className="h-6 w-6 text-primary" />
              Next Steps
            </CardTitle>
            <p className="text-muted-foreground">
              Complete these actions to finalize your partnership setup
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Check Email */}
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">Check Your Email</h3>
                  <Badge variant="destructive" className="text-xs">Action Required</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  We've sent a confirmation email with program details and next steps
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/50 hover:bg-white/80"
                  onClick={() => window.open('mailto:', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Email
                </Button>
              </div>
            </div>

            {/* Schedule Meeting */}
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">Schedule a Meeting</h3>
                  <Badge variant="destructive" className="text-xs">Action Required</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Book a call with your dedicated partner manager to discuss details
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/50 hover:bg-white/80"
                  onClick={() => window.open('https://calendly.com', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Schedule Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partnership Benefits */}
        <Card className="border-2 border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Gift className="h-6 w-6 text-primary" />
              Your Partnership Benefits
            </CardTitle>
            <p className="text-muted-foreground">
              Exclusive perks available to you as a new partner
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Welcome Bonus */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">Welcome Bonus</h4>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Available Now</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Extra 5% commission boost for your first 3 months
                </p>
              </div>
            </div>

            {/* Marketing Materials */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">Marketing Materials</h4>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Available Now</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ready-made presentations, brochures, and landing pages
                </p>
              </div>
            </div>

            {/* Dedicated Manager */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">Dedicated Manager</h4>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Available Now</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Personal support throughout your partnership journey
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="border border-border/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Need Help Getting Started?</h3>
              <p className="text-muted-foreground">
                Our partner success team is here to support you every step of the way
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => window.open('mailto:partners@company.com', '_blank')}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  partners@company.com
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/marketplace')}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Partner Community
                </Button>
              </div>
              
              <div className="pt-4 border-t border-border/50">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/partner-dashboard')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Start New Application
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerSuccess;