
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Users, Building, Shield } from "lucide-react";

interface HeaderProps {
  user?: {
    id: string;
    role: string;
    name: string;
  } | null;
}

const Header = ({ user }: HeaderProps) => {
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "vendor": return "/dashboard/vendor";
      case "partner": return "/dashboard/partner";
      case "admin": return "/admin";
      default: return "/marketplace";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Rezollo</span>
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
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {user.role === "vendor" && <Building className="w-4 h-4 text-blue-600" />}
                  {user.role === "partner" && <Users className="w-4 h-4 text-green-600" />}
                  {user.role === "admin" && <Shield className="w-4 h-4 text-purple-600" />}
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // TODO: Implement logout
                    console.log("Logout clicked");
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/signup")}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
