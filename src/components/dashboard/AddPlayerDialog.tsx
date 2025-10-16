import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlayerAdded: () => void;
}

const AddPlayerDialog = ({ open, onOpenChange, onPlayerAdded }: AddPlayerDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "Batsman",
    jersey_number: "",
    batting_style: "",
    bowling_style: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("players").insert([
        {
          name: formData.name,
          role: formData.role,
          jersey_number: formData.jersey_number ? parseInt(formData.jersey_number) : null,
          batting_style: formData.batting_style || null,
          bowling_style: formData.bowling_style || null,
        },
      ]);

      if (error) throw error;

      toast.success("Player added successfully!");
      onPlayerAdded();
      onOpenChange(false);
      setFormData({
        name: "",
        role: "Batsman",
        jersey_number: "",
        batting_style: "",
        bowling_style: "",
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
          <DialogTitle>Add New Player</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Player Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Batsman">Batsman</SelectItem>
                  <SelectItem value="Bowler">Bowler</SelectItem>
                  <SelectItem value="All-rounder">All-rounder</SelectItem>
                  <SelectItem value="Wicket-keeper">Wicket-keeper</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jersey">Jersey Number</Label>
              <Input
                id="jersey"
                type="number"
                min="1"
                max="99"
                value={formData.jersey_number}
                onChange={(e) => setFormData({ ...formData, jersey_number: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="batting">Batting Style</Label>
            <Select
              value={formData.batting_style}
              onValueChange={(value) => setFormData({ ...formData, batting_style: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select batting style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Right-handed">Right-handed</SelectItem>
                <SelectItem value="Left-handed">Left-handed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bowling">Bowling Style</Label>
            <Select
              value={formData.bowling_style}
              onValueChange={(value) => setFormData({ ...formData, bowling_style: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bowling style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Right-arm Fast">Right-arm Fast</SelectItem>
                <SelectItem value="Left-arm Fast">Left-arm Fast</SelectItem>
                <SelectItem value="Right-arm Spin">Right-arm Spin</SelectItem>
                <SelectItem value="Left-arm Spin">Left-arm Spin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Adding..." : "Add Player"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlayerDialog;