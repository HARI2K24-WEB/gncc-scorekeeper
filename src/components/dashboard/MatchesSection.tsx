import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, CalendarDays, Trophy, History, Sun } from "lucide-react";
import { toast } from "sonner";
import MatchCard from "./MatchCard";
import AddMatchDialog from "./AddMatchDialog";

interface Match {
  id: string;
  match_date: string;
  match_time: string;
  opponent_team: string;
  opponent_logo_url: string | null;
  venue: string;
  match_type: string;
  is_sunday_match: boolean;
  status: string;
  gncc_score: string | null;
  gncc_wickets: number | null;
  gncc_overs: number | null;
  opponent_score: string | null;
  opponent_wickets: number | null;
  opponent_overs: number | null;
  result: string | null;
}

interface MatchesSectionProps {
  isCaptain: boolean;
}

const MatchesSection = ({ isCaptain }: MatchesSectionProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    fetchMatches();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('matches-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches'
        },
        () => {
          fetchMatches();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("match_date", { ascending: true });

      if (error) throw error;

      setMatches(data || []);
    } catch (error: any) {
      toast.error("Failed to load matches");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingMatches = matches.filter((m) => m.status === "upcoming");
  const liveMatches = matches.filter((m) => m.status === "live");
  const completedMatches = matches.filter((m) => m.status === "completed");
  const sundayMatches = matches.filter((m) => m.is_sunday_match);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Trophy className="w-8 h-8 text-primary" />
          Matches
        </h2>
        {isCaptain && (
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Match
          </Button>
        )}
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="upcoming" className="gap-2">
            <CalendarDays className="w-4 h-4" />
            <span className="hidden sm:inline">Upcoming</span>
            <span className="sm:hidden">Up</span>
          </TabsTrigger>
          <TabsTrigger value="live" className="gap-2">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
            <span className="hidden sm:inline">Live</span>
            <span className="sm:hidden">Live</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
            <span className="sm:hidden">Hist</span>
          </TabsTrigger>
          <TabsTrigger value="sunday" className="gap-2">
            <Sun className="w-4 h-4" />
            <span className="hidden sm:inline">Sunday</span>
            <span className="sm:hidden">Sun</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map((match) => (
                <MatchCard key={match.id} match={match} isCaptain={isCaptain} />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center text-muted-foreground">
                  No upcoming matches scheduled
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="live" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {liveMatches.length > 0 ? (
              liveMatches.map((match) => (
                <MatchCard key={match.id} match={match} isCaptain={isCaptain} isLive />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center text-muted-foreground">
                  No live matches at the moment
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedMatches.length > 0 ? (
              completedMatches.map((match) => (
                <MatchCard key={match.id} match={match} isCaptain={isCaptain} />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center text-muted-foreground">
                  No match history yet
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sunday" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sundayMatches.length > 0 ? (
              sundayMatches.map((match) => (
                <MatchCard key={match.id} match={match} isCaptain={isCaptain} />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center text-muted-foreground">
                  No Sunday matches scheduled
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {isCaptain && (
        <AddMatchDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onMatchAdded={fetchMatches}
        />
      )}
    </div>
  );
};

export default MatchesSection;