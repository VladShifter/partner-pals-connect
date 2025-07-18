import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, DollarSign, Star, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PricingTier {
  id: string;
  tier_name: string;
  monthly_fee: number;
  commission_rate: number;
  description: string | null;
  is_most_popular: boolean;
  tier_order: number;
}

interface PricingTiersSectionProps {
  productId: string;
  setupFee?: number;
  sidebarOnly?: boolean;
}

export const PricingTiersSection: React.FC<PricingTiersSectionProps> = ({ 
  productId, 
  setupFee,
  sidebarOnly = false 
}) => {
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [calculatorValues, setCalculatorValues] = useState({
    dealsPerMonth: 5,
    averageDealValue: 1000
  });

  useEffect(() => {
    fetchPricingTiers();
  }, [productId]);

  const fetchPricingTiers = async () => {
    try {
      const { data, error } = await supabase
        .from('product_pricing_tiers')
        .select('*')
        .eq('product_id', productId)
        .order('tier_order');

      if (error) {
        console.error('Error fetching pricing tiers:', error);
        return;
      }

      if (data && data.length > 0) {
        setPricingTiers(data);
        setSelectedTier(data[0]);
      }
    } catch (error) {
      console.error('Error fetching pricing tiers:', error);
    }
  };

  const calculateEarnings = (tier: PricingTier) => {
    const monthlyRevenue = calculatorValues.dealsPerMonth * calculatorValues.averageDealValue;
    const monthlyCommission = (monthlyRevenue * tier.commission_rate) / 100;
    const monthlyCosts = tier.monthly_fee;
    const monthlyProfit = monthlyCommission - monthlyCosts;
    const annualProfit = monthlyProfit * 12;

    return {
      monthlyRevenue,
      monthlyCommission,
      monthlyCosts,
      monthlyProfit,
      annualProfit
    };
  };

  const scrollToSection = () => {
    const element = document.getElementById('pricing-tiers-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (pricingTiers.length === 0) {
    return null;
  }

  const priceRange = pricingTiers.length > 1 
    ? `$${Math.min(...pricingTiers.map(t => t.monthly_fee))} - $${Math.max(...pricingTiers.map(t => t.monthly_fee))}/month`
    : `$${pricingTiers[0].monthly_fee}/month`;

  // If sidebar only, return compact version
  if (sidebarOnly) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Monthly License</span>
            <span className="font-bold">{priceRange}</span>
          </div>
          {setupFee && setupFee > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Setup Fee</span>
              <span className="font-medium">${setupFee.toLocaleString()}</span>
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={scrollToSection}
        >
          View Full Pricing
        </Button>
      </div>
    );
  }

  return (
    <>

      {/* Full Pricing Section */}
      <Card id="pricing-tiers-section" className="scroll-mt-8">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <DollarSign className="w-6 h-6 mr-2" />
            Reseller Business Pricing & Terms
          </CardTitle>
          <CardDescription className="text-base">
            Monthly subscription options for operating this business as a reseller
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pricing Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {pricingTiers.map((tier) => (
              <Card 
                key={tier.id} 
                className={`relative cursor-pointer transition-all duration-200 ${
                  tier.is_most_popular 
                    ? 'border-primary shadow-lg scale-105' 
                    : 'hover:shadow-md'
                } ${
                  selectedTier?.id === tier.id 
                    ? 'ring-2 ring-primary ring-offset-2' 
                    : ''
                }`}
                onClick={() => setSelectedTier(tier)}
              >
                {tier.is_most_popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{tier.tier_name}</CardTitle>
                  <div className="text-3xl font-bold">
                    ${tier.monthly_fee}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                  <div className="text-sm font-medium text-primary">
                    {tier.commission_rate}% Commission
                  </div>
                </CardHeader>
                <CardContent>
                  {tier.description && (
                    <p className="text-sm text-muted-foreground text-center">
                      {tier.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Setup Fee Information */}
          {setupFee && setupFee > 0 && (
            <Card className="mb-8 bg-accent/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-lg">White Label Setup</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Setup fee applies only when you're ready to rebrand the solution under your domain. 
                      You can start with subscription-only and add white label later.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${setupFee}</div>
                    <div className="text-sm text-muted-foreground">one-time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        </CardContent>
      </Card>
    </>
  );
};