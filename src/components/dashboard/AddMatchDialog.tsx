import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddMatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMatchAdded: () => void;
}

const AddMatchDialog = ({ open, onOpenChange, onMatchAdded }: AddMatchDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    match_date: "",
    match_time: "",
    opponent_team: "",
    venue: "",
    match_type: "Regular",
    is_sunday_match: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("matches").insert([
        {
          ...formData,
          status: "upcoming",
        },
      ]);

      if (error) throw error;

      toast.success("Match added successfully!");
      onMatchAdded();
      onOpenChange(false);
      setFormData({
        match_date: "",
        match_time: "",
        opponent_team: "",
        venue: "",
        match_type: "Regular",
        is_sunday_match: false,
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Match</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="opponent">Opponent Team</Label>
            <Input
              id="opponent"
              value={formData.opponent_team}
              onChange={(e) => setFormData({ ...formData, opponent_team: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Match Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.match_date}
                onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Match Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.match_time}
                onChange={(e) => setFormData({ ...formData, match_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Match Type</Label>
            <Select
              value={formData.match_type}
              onValueChange={(value) => setFormData({ ...formData, match_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="T20">T20</SelectItem>
                <SelectItem value="ODI">ODI</SelectItem>
                <SelectItem value="Test">Test</SelectItem>
                <SelectItem value="Tournament">Tournament</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sunday"
              checked={formData.is_sunday_match}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_sunday_match: checked as boolean })
              }
            />
            <Label htmlFor="sunday" className="cursor-pointer">
              Sunday Match
            </Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Adding..." : "Add Match"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMatchDialog;