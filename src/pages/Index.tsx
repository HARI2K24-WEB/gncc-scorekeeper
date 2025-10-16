import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, TrendingUp } from "lucide-react";
import gnccLogo from "@/assets/gncc-logo.png";
import heroImage from "@/assets/cricket-hero.jpg";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-secondary/70" />
        
        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <img 
            src={gnccLogo} 
            alt="GNCC Cricket Team" 
            className="w-32 h-32 md:w-40 md:h-40 mb-8 animate-slide-up"
          />
          
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-4 animate-slide-up">
            GNCC Cricket Team
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl animate-slide-up">
            Official Team Management Dashboard - Track matches, manage players, and celebrate victories
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
            >
              Sign In / Sign Up
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Everything You Need to Manage Your Team
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass p-6 rounded-lg text-center space-y-4 hover:shadow-lg transition-all animate-slide-up">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Match Management</h3>
              <p className="text-muted-foreground">
                Schedule, track, and update match details with live score updates
              </p>
            </div>

            <div className="glass p-6 rounded-lg text-center space-y-4 hover:shadow-lg transition-all animate-slide-up">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Player Profiles</h3>
              <p className="text-muted-foreground">
                Manage player information, stats, and performance tracking
              </p>
            </div>

            <div className="glass p-6 rounded-lg text-center space-y-4 hover:shadow-lg transition-all animate-slide-up">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Sunday Matches</h3>
              <p className="text-muted-foreground">
                Special section for Sunday matches with dedicated tracking
              </p>
            </div>

            <div className="glass p-6 rounded-lg text-center space-y-4 hover:shadow-lg transition-all animate-slide-up">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Live Updates</h3>
              <p className="text-muted-foreground">
                Real-time score updates and match history tracking
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 bg-muted/30 text-center">
        <p className="text-muted-foreground">
          © 2025 GNCC Cricket Team. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Index;
