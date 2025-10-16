import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Edit, Trophy } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import UpdateScoreDialog from "./UpdateScoreDialog";

interface MatchCardProps {
  match: {
    id: string;
    match_date: string;
    match_time: string;
    opponent_team: string;
    venue: string;
    match_type: string;
    status: string;
    gncc_score: string | null;
    gncc_wickets: number | null;
    gncc_overs: number | null;
    opponent_score: string | null;
    opponent_wickets: number | null;
    opponent_overs: number | null;
    result: string | null;
  };
  isCaptain: boolean;
  isLive?: boolean;
}

const MatchCard = ({ match, isCaptain, isLive }: MatchCardProps) => {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const getStatusBadge = () => {
    switch (match.status) {
      case "live":
        return <Badge className="bg-destructive pulse-glow">Live</Badge>;
      case "upcoming":
        return <Badge variant="secondary">Upcoming</Badge>;
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className={`glass hover:shadow-lg transition-all duration-300 ${isLive ? 'pulse-glow' : ''}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">
              GNCC vs {match.opponent_team}
            </CardTitle>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {format(new Date(match.match_date), "PPP")} at {match.match_time}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {match.venue}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Trophy className="w-4 h-4" />
              {match.match_type}
            </div>
          </div>

          {(match.status === "live" || match.status === "completed") && (
            <div className="space-y-3 pt-3 border-t">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary">GNCC</span>
                  <span className="font-bold text-lg">
                    {match.gncc_score || "0"}/{match.gncc_wickets || "0"}
                    <span className="text-sm text-muted-foreground ml-1">
                      ({match.gncc_overs || "0"} ov)
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{match.opponent_team}</span>
                  <span className="font-bold text-lg">
                    {match.opponent_score || "0"}/{match.opponent_wickets || "0"}
                    <span className="text-sm text-muted-foreground ml-1">
                      ({match.opponent_overs || "0"} ov)
                    </span>
                  </span>
                </div>
              </div>
              
              {match.result && (
                <div className="text-sm font-medium text-center p-2 bg-muted rounded">
                  {match.result}
                </div>
              )}
            </div>
          )}

          {isCaptain && match.status !== "completed" && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2"
              onClick={() => setShowUpdateDialog(true)}
            >
              <Edit className="w-4 h-4" />
              Update Score
            </Button>
          )}
        </CardContent>
      </Card>

      {isCaptain && (
        <UpdateScoreDialog
          match={match}
          open={showUpdateDialog}
          onOpenChange={setShowUpdateDialog}
        />
      )}
    </>
  );
};

export default MatchCard;