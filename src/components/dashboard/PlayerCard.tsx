import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PlayerCardProps {
  player: {
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
  };
  isCaptain: boolean;
  onUpdate: () => void;
}

const PlayerCard = ({ player, isCaptain, onUpdate }: PlayerCardProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to remove ${player.name}?`)) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", player.id);

      if (error) throw error;

      toast.success("Player removed successfully");
      onUpdate();
    } catch (error: any) {
      toast.error("Failed to remove player");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="glass hover:shadow-lg transition-all duration-300 animate-slide-up">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-16 h-16 border-2 border-primary/20">
            <AvatarImage src={player.avatar_url || undefined} alt={player.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {getInitials(player.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg">{player.name}</h3>
                {player.jersey_number && (
                  <Badge variant="secondary" className="text-xs">
                    #{player.jersey_number}
                  </Badge>
                )}
              </div>
              {isCaptain && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">{player.role}</p>
              {player.batting_style && (
                <p className="text-xs">Bat: {player.batting_style}</p>
              )}
              {player.bowling_style && (
                <p className="text-xs">Bowl: {player.bowling_style}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t text-xs">
              <div className="text-center">
                <div className="font-bold text-primary">{player.total_matches}</div>
                <div className="text-muted-foreground">Matches</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-primary">{player.total_runs}</div>
                <div className="text-muted-foreground">Runs</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-primary">{player.total_wickets}</div>
                <div className="text-muted-foreground">Wickets</div>
              </div>
            </div>

            {(player.best_score || player.best_bowling) && (
              <div className="text-xs space-y-1 pt-2 border-t">
                {player.best_score && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Best Score:</span>
                    <span className="font-semibold">{player.best_score}</span>
                  </div>
                )}
                {player.best_bowling && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Best Bowling:</span>
                    <span className="font-semibold">{player.best_bowling}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;