import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UpdateScoreDialogProps {
  match: {
    id: string;
    status: string;
    gncc_score: string | null;
    gncc_wickets: number | null;
    gncc_overs: number | null;
    opponent_score: string | null;
    opponent_wickets: number | null;
    opponent_overs: number | null;
    result: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UpdateScoreDialog = ({ match, open, onOpenChange }: UpdateScoreDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: match.status,
    gncc_score: match.gncc_score || "",
    gncc_wickets: match.gncc_wickets?.toString() || "",
    gncc_overs: match.gncc_overs?.toString() || "",
    opponent_score: match.opponent_score || "",
    opponent_wickets: match.opponent_wickets?.toString() || "",
    opponent_overs: match.opponent_overs?.toString() || "",
    result: match.result || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("matches")
        .update({
          status: formData.status,
          gncc_score: formData.gncc_score || null,
          gncc_wickets: formData.gncc_wickets ? parseInt(formData.gncc_wickets) : null,
          gncc_overs: formData.gncc_overs ? parseFloat(formData.gncc_overs) : null,
          opponent_score: formData.opponent_score || null,
          opponent_wickets: formData.opponent_wickets ? parseInt(formData.opponent_wickets) : null,
          opponent_overs: formData.opponent_overs ? parseFloat(formData.opponent_overs) : null,
          result: formData.result || null,
        })
        .eq("id", match.id);

      if (error) throw error;

      toast.success("Score updated successfully!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Match Score</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Match Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-primary">GNCC Score</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gncc-score">Runs</Label>
                <Input
                  id="gncc-score"
                  value={formData.gncc_score}
                  onChange={(e) => setFormData({ ...formData, gncc_score: e.target.value })}
                  placeholder="150"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gncc-wickets">Wickets</Label>
                <Input
                  id="gncc-wickets"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.gncc_wickets}
                  onChange={(e) => setFormData({ ...formData, gncc_wickets: e.target.value })}
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gncc-overs">Overs</Label>
                <Input
                  id="gncc-overs"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.gncc_overs}
                  onChange={(e) => setFormData({ ...formData, gncc_overs: e.target.value })}
                  placeholder="20.0"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Opponent Score</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="opp-score">Runs</Label>
                <Input
                  id="opp-score"
                  value={formData.opponent_score}
                  onChange={(e) => setFormData({ ...formData, opponent_score: e.target.value })}
                  placeholder="145"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="opp-wickets">Wickets</Label>
                <Input
                  id="opp-wickets"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.opponent_wickets}
                  onChange={(e) => setFormData({ ...formData, opponent_wickets: e.target.value })}
                  placeholder="8"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="opp-overs">Overs</Label>
                <Input
                  id="opp-overs"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.opponent_overs}
                  onChange={(e) => setFormData({ ...formData, opponent_overs: e.target.value })}
                  placeholder="20.0"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="result">Match Result</Label>
            <Textarea
              id="result"
              value={formData.result}
              onChange={(e) => setFormData({ ...formData, result: e.target.value })}
              placeholder="GNCC won by 5 runs"
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Updating..." : "Update Score"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateScoreDialog;