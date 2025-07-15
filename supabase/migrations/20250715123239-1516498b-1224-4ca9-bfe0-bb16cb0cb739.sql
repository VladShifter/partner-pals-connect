-- Update EcomBoost Suite with the content that should be displayed
UPDATE public.products 
SET 
  features = ARRAY[
    'Real-time competitor price tracking across multiple channels',
    'AI-powered product recommendation engine',
    'Conversion rate optimization tools and A/B testing',
    'Inventory management with automated reordering',
    'Customer behavior analytics and segmentation',
    'Multi-channel sales integration (Amazon, Shopify, eBay)'
  ],
  reseller_benefits = ARRAY[
    'High-demand e-commerce solution in a growing market',
    'Proven ROI of 200-400% for client businesses',
    'Comprehensive training and certification program included',
    'Dedicated account manager for enterprise deals',
    'Flexible pricing tiers to match different client needs',
    'Strong brand recognition in the e-commerce space'
  ],
  ideal_resellers = ARRAY[
    'E-commerce Consultants and Agencies',
    'Digital Marketing Specialists',
    'Business Development Representatives',
    'SaaS Sales Professionals',
    'Technology Integration Partners',
    'Small Business Solution Providers'
  ],
  getting_customers = ARRAY[
    'Demo the ROI calculator during initial meetings',
    'Partner with e-commerce agencies and consultants',
    'Showcase case studies at industry trade shows',
    'Leverage social proof through customer testimonials',
    'Run targeted LinkedIn campaigns to decision makers',
    'Offer free e-commerce audits to generate leads'
  ],
  launch_steps = ARRAY[
    'Complete the online certification program (2-3 hours)',
    'Access sales materials and demo environment',
    'Identify your target market and create prospect list',
    'Schedule product training with our solutions team',
    'Start with pilot clients to build case studies'
  ]
WHERE name = 'EcomBoost Suite';