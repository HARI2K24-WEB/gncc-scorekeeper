import { Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import gnccLogo from "@/assets/gncc-logo.png";
import heroImage from "@/assets/cricket-hero.jpg";
import MatchesSection from "./MatchesSection";
import PlayersSection from "./PlayersSection";

interface PlayerDashboardProps {
  profile: {
    id: string;
    full_name: string;
    role: "captain" | "player";
  };
}

const PlayerDashboard = ({ profile }: PlayerDashboardProps) => {
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
        <div className="absolute inset-0 bg-gradient-to-r from-accent/90 to-secondary/70" />
        <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={gnccLogo} alt="GNCC" className="w-16 h-16 md:w-20 md:h-20" />
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-accent-foreground mb-2">
                Player Dashboard
              </h1>
              <p className="text-accent-foreground/90 text-lg md:text-xl flex items-center gap-2">
                <Users className="w-5 h-5" />
                Welcome, {profile.full_name}
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
        <MatchesSection isCaptain={false} />
        <PlayersSection isCaptain={false} />
      </div>
    </div>
  );
};

export default PlayerDashboard;