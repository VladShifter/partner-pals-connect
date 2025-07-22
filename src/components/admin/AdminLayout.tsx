import { Link, useLocation, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  FileText, 
  Tags, 
  LogOut,
  Settings
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/admin/overview', icon: LayoutDashboard },
  { name: 'Vendors', href: '/admin/vendors', icon: Users },
  { name: 'Partners', href: '/admin/partners', icon: UserCheck },
  { name: 'Applications', href: '/admin/applications', icon: FileText },
  { name: 'Tags', href: '/admin/tags', icon: Tags },
];

export function AdminLayout() {
  const location = useLocation();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      // Clear temporary admin session
      localStorage.removeItem('temp_admin_email');
      
      // Also sign out from Supabase if signed in
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully"
      });
      
      // Redirect to admin login
      window.location.href = '/admin/login';
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6">
          <div className="mb-2">
            <img 
              src="/lovable-uploads/3aa30cb7-3c3c-46bb-802c-e23b01b0aceb.png" 
              alt="Rezollo"
              className="h-8 w-auto"
            />
          </div>
          <p className="text-sm text-muted-foreground">Staff Console</p>
        </div>
        
        <nav className="flex-1 space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}