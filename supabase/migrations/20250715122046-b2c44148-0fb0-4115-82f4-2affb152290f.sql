-- Add fields for product content sections that should be editable
ALTER TABLE public.products 
ADD COLUMN features TEXT[], 
ADD COLUMN reseller_benefits TEXT[], 
ADD COLUMN ideal_resellers TEXT[], 
ADD COLUMN getting_customers TEXT[], 
ADD COLUMN launch_steps TEXT[];

-- Update existing products with sample data (if needed)
UPDATE public.products 
SET 
  features = ARRAY[
    'Price Monitoring by Region - Track competitor prices on specific products across different cities',
    'Location Expansion - Advise brands on where to open new stores based on traffic flows, competition, and spending potential',
    'Market Share Tracking - Show a business their share of foot traffic or sales volume vs. competitors',
    'Brand Perception Insights - Compare brand strength across regions and uncover opportunities to reposition',
    'Product Benchmarking - Reveal gaps in the product mix compared to market leaders'
  ],
  reseller_benefits = ARRAY[
    'One of the very few platforms in the world offering this level of offline analytics',
    'Trusted by top global retail and F&B chains — already in use across 215+ countries',
    'Average deal size starts at $30K+',
    'Fully managed: you sell, the platform handles insights, dashboards, and support',
    'Enterprise-grade sales kits, demo access, and real use-case examples provided',
    'Up to 75% reseller discount = huge margin potential even on high-ticket sales'
  ],
  ideal_resellers = ARRAY[
    'FMCG, HORECA and Retail Experts and Sales Reps',
    'Retail Strategy Consultants',
    'Franchise Developers',
    'Market Research Agencies',
    'Data-Driven Business Advisors',
    'Expansion/Localization Experts'
  ],
  getting_customers = ARRAY[
    'Demo Calls – Show course generation on the first meeting',
    'Corporate Networks – Target companies investing in training',
    'Social Media – Share success stories and platform benefits',
    'Email Campaigns – Highlight 40% reduction in onboarding time',
    'Industry Events – Showcase capabilities to HR decision-makers'
  ],
  launch_steps = ARRAY[
    'Book a demo – see how the platform works',
    'Get materials – pitch decks, use cases, pricing logic',
    'Bring clients or pitch directly',
    'Earn up to 25% per deal'
  ]
WHERE name = 'CloudCRM Pro';