
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users, Building, Shield, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  console.log('Header: Current user:', user?.email || 'No user', 'Loading:', loading);

  // Helper function to get user role from metadata or database
  const getUserRole = () => {
    if (!user) return null;
    // For now, we'll default to 'partner' but this should be fetched from database
    return user?.user_metadata?.role || 'partner';
  };

  // Helper function to get user name
  const getUserName = () => {
    if (!user) return '';
    return user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  };

  const currentUser = user ? {
    id: user.id,
    role: getUserRole(),
    name: getUserName()
  } : null;

  const getDashboardPath = () => {
    if (!currentUser) return "/login";
    switch (currentUser.role) {
      case "vendor": return "/vendor/dashboard";
      case "partner": return "/partner/dashboard";
      case "admin": return "/admin/overview";
      default: return "/partner/dashboard"; // Default to partner dashboard
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "vendor": return <Building className="w-4 h-4" />;
      case "partner": return <Users className="w-4 h-4" />;
      case "admin": return <Shield className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "vendor": return "text-blue-600";
      case "partner": return "text-green-600";
      case "admin": return "text-purple-600";
      default: return "text-gray-600";
    }
  };

  const handleSignOut = async () => {
    console.log('Header: Signing out user');
    await signOut();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/3aa30cb7-3c3c-46bb-802c-e23b01b0aceb.png" 
                alt="Rezollo"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/marketplace" className="text-gray-600 hover:text-gray-900 transition-colors">
              Marketplace
            </Link>
            {user && (
              <Link to={getDashboardPath()} className="text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {!loading && currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={`${getRoleColor(currentUser.role)} bg-gray-100 font-medium`}>
                        {getUserInitials(currentUser.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={`${getRoleColor(currentUser.role)} bg-gray-100 text-xs font-medium`}>
                          {getUserInitials(currentUser.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                        <div className="flex items-center space-x-1">
                          <span className={getRoleColor(currentUser.role)}>
                            {getRoleIcon(currentUser.role)}
                          </span>
                          <p className="text-xs leading-none text-muted-foreground capitalize">
                            {currentUser.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(getDashboardPath())}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/marketplace')}>
                    <Search className="mr-2 h-4 w-4" />
                    <span>Marketplace</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !loading ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/signup")}>
                  Sign Up
                </Button>
              </>
            ) : (
              <div className="w-10 h-10 animate-pulse bg-gray-200 rounded-full"></div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
