import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";
import PlayerCard from "./PlayerCard";
import AddPlayerDialog from "./AddPlayerDialog";

interface Player {
  id: string;
  name: string;
  role: string;
  jersey_number: number | null;
  avatar_url: string | null;
  batting_style: string | null;
  bowling_style: string | null;
  total_matches: number;
  total_runs: number;
  total_wickets: number;
  best_score: string | null;
  best_bowling: string | null;
}

interface PlayersSectionProps {
  isCaptain: boolean;
}

const PlayersSection = ({ isCaptain }: PlayersSectionProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      setPlayers(data || []);
    } catch (error: any) {
      toast.error("Failed to load players");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Users className="w-8 h-8 text-primary" />
          Team Players
        </h2>
        {isCaptain && (
          <Button onClick={() => setShowAddDialog(true)} variant="secondary" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Player
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {players.length > 0 ? (
          players.map((player) => (
            <PlayerCard key={player.id} player={player} isCaptain={isCaptain} onUpdate={fetchPlayers} />
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center text-muted-foreground">
              No players added yet
            </CardContent>
          </Card>
        )}
      </div>

      {isCaptain && (
        <AddPlayerDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onPlayerAdded={fetchPlayers}
        />
      )}
    </div>
  );
};

export default PlayersSection;