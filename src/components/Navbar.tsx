import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Plane, Menu, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NavbarProps {
  user?: any;
}

const Navbar = ({ user }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/");
      toast({
        title: "Signed out successfully",
      });
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-lg border-b z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EasyTravel India
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/explore" className="hover:text-primary transition-colors">
              Explore India
            </Link>
            {user && (
              <>
                <Link to="/plan" className="hover:text-primary transition-colors">
                  Plan Trip
                </Link>
                <Link to="/dashboard" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </>
            )}
            {user ? (
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            ) : (
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fade-in">
            <Link
              to="/"
              className="block hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className="block hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore India
            </Link>
            {user && (
              <>
                <Link
                  to="/plan"
                  className="block hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Plan Trip
                </Link>
                <Link
                  to="/dashboard"
                  className="block hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            )}
            {user ? (
              <Button onClick={handleLogout} variant="outline" className="w-full">
                Logout
              </Button>
            ) : (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-primary to-accent text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
