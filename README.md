# Rezollo Marketplace

A modern marketplace platform connecting vendors and partners built with React, TypeScript, and Supabase.

## Features

- **Marketplace**: Browse and discover products from various vendors
- **Vendor Dashboard**: Manage products, view analytics, and track partnerships  
- **Partner Dashboard**: Find partnership opportunities and manage applications
- **Admin Console**: Private staff console for platform management
- **Real-time Updates**: Live notifications and data synchronization
- **Authentication**: Secure login with magic links

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Routing**: React Router v6
- **State Management**: TanStack Query
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173`

## Admin Console Setup

The admin console is a private interface for Rezollo staff to manage the platform.

### Creating Your First Admin

1. **Sign up as a regular user** through the main app at `/signup`

2. **Promote to admin role** via Supabase dashboard:
   - Go to your Supabase project dashboard
   - Navigate to **Table Editor** → **profiles**
   - Find your user record and edit the `role` field
   - Change from `user` to `admin`

3. **Access admin console** at `/admin/login`
   - Use the same email you signed up with
   - Click "Send Magic Link" 
   - Check your email and click the login link
   - You'll be redirected to `/admin/overview`

### Admin Console Features

- **Overview**: Dashboard with pending items count
- **Vendors**: Approve/reject vendor profiles, inline editing
- **Partners**: Manage partner accounts and subtypes  
- **Applications**: Review partnership requests with bulk actions
- **Tags**: Create and manage global tags with color coding

### Admin Permissions

- Admins can bypass all Row Level Security policies
- Only users with `role = 'admin'` can access admin routes
- Admin actions are logged in the `audit_logs` table

## Database Schema

The platform uses several core tables:

- `profiles` - User profiles with roles
- `vendors` - Vendor company information  
- `partners` - Partner company information
- `products` - Product listings
- `partnership_requests` - Partnership applications
- `tags` - Global tags for categorization
- `audit_logs` - Admin action tracking

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a3a0018b-0866-42f8-b788-0df492afa6fa) and click on Share -> Publish.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and proprietary to Rezollo.
