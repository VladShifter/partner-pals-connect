import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp } from 'lucide-react';

interface ROICalculatorProps {
  commissionRate?: number;
  monthlyFee?: number;
}

export const ROICalculator: React.FC<ROICalculatorProps> = ({ 
  commissionRate = 25, 
  monthlyFee = 99 
}) => {
  const [calculatorValues, setCalculatorValues] = useState({
    dealsPerMonth: 5,
    averageDealValue: 1000
  });

  const calculateEarnings = () => {
    const monthlyRevenue = calculatorValues.dealsPerMonth * calculatorValues.averageDealValue;
    const monthlyCommission = (monthlyRevenue * commissionRate) / 100;
    const monthlyCosts = monthlyFee;
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

  const earnings = calculateEarnings();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="w-5 h-5 mr-2" />
          ROI Calculator
        </CardTitle>
        <CardDescription>
          Calculate your potential earnings as a reseller
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="deals">Expected deals per month</Label>
            <Input
              id="deals"
              type="number"
              value={calculatorValues.dealsPerMonth}
              onChange={(e) => setCalculatorValues({
                ...calculatorValues, 
                dealsPerMonth: parseInt(e.target.value) || 0
              })}
              className="mt-1"
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="deal-value">Average deal value ($)</Label>
            <Input
              id="deal-value"
              type="number"
              value={calculatorValues.averageDealValue}
              onChange={(e) => setCalculatorValues({
                ...calculatorValues, 
                averageDealValue: parseInt(e.target.value) || 0
              })}
              className="mt-1"
              min="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-sm text-green-600 mb-1">Monthly Revenue</div>
                <div className="text-xl font-bold text-green-700">
                  ${earnings.monthlyRevenue.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-sm text-blue-600 mb-1">Monthly Commission</div>
                <div className="text-xl font-bold text-blue-700">
                  ${earnings.monthlyCommission.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-sm text-orange-600 mb-1">Monthly Costs</div>
                <div className="text-xl font-bold text-orange-700">
                  ${earnings.monthlyCosts.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4 bg-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm font-medium text-primary">Net Profit</span>
              </div>
              <div className="text-2xl font-bold text-primary mb-1">
                ${earnings.monthlyProfit.toLocaleString()}/month
              </div>
              <div className="text-lg text-primary/80">
                ${earnings.annualProfit.toLocaleString()}/year
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};