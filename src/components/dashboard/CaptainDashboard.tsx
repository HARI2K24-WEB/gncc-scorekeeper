import { Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import gnccLogo from "@/assets/gncc-logo.png";
import heroImage from "@/assets/cricket-hero.jpg";
import MatchesSection from "./MatchesSection";
import PlayersSection from "./PlayersSection";

interface CaptainDashboardProps {
  profile: {
    id: string;
    full_name: string;
    role: "captain" | "player";
  };
}

const CaptainDashboard = ({ profile }: CaptainDashboardProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div 
        className="relative h-64 md:h-80 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={gnccLogo} alt="GNCC" className="w-16 h-16 md:w-20 md:h-20" />
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-2">
                Captain Dashboard
              </h1>
              <p className="text-primary-foreground/90 text-lg md:text-xl flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Welcome back, {profile.full_name}
              </p>
            </div>
          </div>
          <Button variant="secondary" onClick={handleSignOut} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        <MatchesSection isCaptain={true} />
        <PlayersSection isCaptain={true} />
      </div>
    </div>
  );
};

export default CaptainDashboard;