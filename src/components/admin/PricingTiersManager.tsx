import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, X, Star, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PricingTier {
  id?: string;
  tier_name: string;
  monthly_fee: number;
  commission_rate: number;
  description: string;
  is_most_popular: boolean;
  tier_order: number;
}

interface PricingTiersManagerProps {
  productId?: string;
}

export const PricingTiersManager: React.FC<PricingTiersManagerProps> = ({ productId }) => {
  const { toast } = useToast();
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchTiers();
    }
  }, [productId]);

  const fetchTiers = async () => {
    if (!productId) return;

    try {
      const { data, error } = await supabase
        .from('product_pricing_tiers')
        .select('*')
        .eq('product_id', productId)
        .order('tier_order');

      if (error) {
        console.error('Error fetching tiers:', error);
        return;
      }

      setTiers(data || []);
    } catch (error) {
      console.error('Error fetching tiers:', error);
    }
  };

  const addTier = () => {
    const newTier: PricingTier = {
      tier_name: '',
      monthly_fee: 0,
      commission_rate: 0,
      description: '',
      is_most_popular: false,
      tier_order: tiers.length
    };
    setTiers([...tiers, newTier]);
  };

  const removeTier = async (index: number) => {
    const tier = tiers[index];
    
    if (tier.id) {
      try {
        const { error } = await supabase
          .from('product_pricing_tiers')
          .delete()
          .eq('id', tier.id);

        if (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete pricing tier"
          });
          return;
        }
      } catch (error) {
        console.error('Error deleting tier:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete pricing tier"
        });
        return;
      }
    }

    const newTiers = tiers.filter((_, i) => i !== index);
    // Update tier orders
    const updatedTiers = newTiers.map((tier, i) => ({ ...tier, tier_order: i }));
    setTiers(updatedTiers);

    toast({
      title: "Success",
      description: "Pricing tier removed"
    });
  };

  const updateTier = (index: number, field: keyof PricingTier, value: any) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    
    // If setting most_popular to true, set all others to false
    if (field === 'is_most_popular' && value === true) {
      newTiers.forEach((tier, i) => {
        if (i !== index) {
          tier.is_most_popular = false;
        }
      });
    }
    
    setTiers(newTiers);
  };

  const saveTiers = async () => {
    if (!productId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No product selected"
      });
      return;
    }

    setLoading(true);

    try {
      // Validate tiers
      for (const tier of tiers) {
        if (!tier.tier_name.trim()) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "All tiers must have a name"
          });
          setLoading(false);
          return;
        }
      }

      // Update existing tiers and create new ones
      for (const tier of tiers) {
        const tierData = {
          product_id: productId,
          tier_name: tier.tier_name,
          monthly_fee: tier.monthly_fee,
          commission_rate: tier.commission_rate,
          description: tier.description || null,
          is_most_popular: tier.is_most_popular,
          tier_order: tier.tier_order
        };

        if (tier.id) {
          // Update existing tier
          const { error } = await supabase
            .from('product_pricing_tiers')
            .update(tierData)
            .eq('id', tier.id);

          if (error) {
            throw error;
          }
        } else {
          // Create new tier
          const { data, error } = await supabase
            .from('product_pricing_tiers')
            .insert([tierData])
            .select()
            .single();

          if (error) {
            throw error;
          }

          // Update the tier with the new ID
          tier.id = data.id;
        }
      }

      toast({
        title: "Success",
        description: "Pricing tiers saved successfully"
      });

      fetchTiers(); // Refresh data
    } catch (error) {
      console.error('Error saving tiers:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save pricing tiers"
      });
    } finally {
      setLoading(false);
    }
  };

  const moveTier = (fromIndex: number, toIndex: number) => {
    const newTiers = [...tiers];
    const [movedTier] = newTiers.splice(fromIndex, 1);
    newTiers.splice(toIndex, 0, movedTier);
    
    // Update tier orders
    const updatedTiers = newTiers.map((tier, i) => ({ ...tier, tier_order: i }));
    setTiers(updatedTiers);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reseller Pricing Tiers</CardTitle>
        <CardDescription>
          Configure subscription plans for resellers operating this business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {tiers.map((tier, index) => (
            <Card key={index} className={tier.is_most_popular ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                    <Label className="text-sm font-medium">Tier {index + 1}</Label>
                    {tier.is_most_popular && (
                      <Badge variant="default">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTier(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor={`tier-name-${index}`}>Tier Name</Label>
                    <Input
                      id={`tier-name-${index}`}
                      value={tier.tier_name}
                      onChange={(e) => updateTier(index, 'tier_name', e.target.value)}
                      placeholder="e.g., Starter, Professional, Enterprise"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`monthly-fee-${index}`}>Monthly Fee ($)</Label>
                    <Input
                      id={`monthly-fee-${index}`}
                      type="number"
                      value={tier.monthly_fee}
                      onChange={(e) => updateTier(index, 'monthly_fee', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="mt-1"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor={`commission-rate-${index}`}>Commission Rate (%)</Label>
                    <Input
                      id={`commission-rate-${index}`}
                      type="number"
                      value={tier.commission_rate}
                      onChange={(e) => updateTier(index, 'commission_rate', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="mt-1"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id={`most-popular-${index}`}
                      checked={tier.is_most_popular}
                      onCheckedChange={(checked) => updateTier(index, 'is_most_popular', checked)}
                    />
                    <Label htmlFor={`most-popular-${index}`}>Mark as Most Popular</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Textarea
                    id={`description-${index}`}
                    value={tier.description}
                    onChange={(e) => updateTier(index, 'description', e.target.value)}
                    placeholder="Brief description of what's included in this tier"
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={addTier} variant="outline" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Add Pricing Tier
            </Button>
            <Button 
              onClick={saveTiers} 
              disabled={loading || tiers.length === 0}
              className="flex-1"
            >
              {loading ? 'Saving...' : 'Save Pricing Tiers'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};