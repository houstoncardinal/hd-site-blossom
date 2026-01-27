import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Instagram } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  instagram_handle: string | null;
  years_experience: number | null;
  specialties: string[] | null;
  is_active: boolean | null;
}

const emptyMember: Partial<TeamMember> = {
  name: '',
  role: '',
  bio: '',
  image_url: '',
  instagram_handle: '',
  years_experience: 0,
  specialties: [],
  is_active: true,
};

const TeamManager = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [specialtiesInput, setSpecialtiesInput] = useState('');
  const { toast } = useToast();

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch team members',
        variant: 'destructive',
      });
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openCreateDialog = () => {
    setEditingMember(emptyMember);
    setSpecialtiesInput('');
    setIsDialogOpen(true);
  };

  const openEditDialog = (member: TeamMember) => {
    setEditingMember(member);
    setSpecialtiesInput(member.specialties?.join(', ') || '');
    setIsDialogOpen(true);
  };

  const saveMember = async () => {
    if (!editingMember?.name || !editingMember?.role) {
      toast({
        title: 'Missing fields',
        description: 'Name and role are required',
        variant: 'destructive',
      });
      return;
    }

    const specialtiesArray = specialtiesInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const memberData = {
      name: editingMember.name,
      role: editingMember.role,
      bio: editingMember.bio || null,
      image_url: editingMember.image_url || null,
      instagram_handle: editingMember.instagram_handle || null,
      years_experience: editingMember.years_experience || 0,
      specialties: specialtiesArray,
      is_active: editingMember.is_active ?? true,
    };

    if (editingMember.id) {
      const { error } = await supabase
        .from('team_members')
        .update(memberData)
        .eq('id', editingMember.id);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update team member',
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Team member updated' });
        setIsDialogOpen(false);
        fetchMembers();
      }
    } else {
      const { error } = await supabase
        .from('team_members')
        .insert(memberData);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to create team member',
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Team member added' });
        setIsDialogOpen(false);
        fetchMembers();
      }
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete team member',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Team member deleted' });
      fetchMembers();
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('team_members')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    } else {
      fetchMembers();
    }
  };

  if (loading) {
    return <div className="text-muted-foreground animate-pulse">Loading team members...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-light">Team Members</h2>
        <Button onClick={openCreateDialog}>
          <Plus size={16} className="mr-2" />
          Add Member
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No team members yet
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="border border-border rounded-lg p-4 bg-card space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={member.is_active ?? true}
                    onCheckedChange={(checked) => toggleActive(member.id, checked)}
                  />
                </div>
              </div>

              {member.bio && (
                <p className="text-sm text-muted-foreground line-clamp-2">{member.bio}</p>
              )}

              {member.specialties && member.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {member.specialties.slice(0, 3).map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {member.instagram_handle && (
                    <span className="flex items-center gap-1">
                      <Instagram size={14} />
                      @{member.instagram_handle}
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(member)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMember(member.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMember?.id ? 'Edit Team Member' : 'Add Team Member'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={editingMember?.name || ''}
                  onChange={(e) =>
                    setEditingMember((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  value={editingMember?.role || ''}
                  onChange={(e) =>
                    setEditingMember((prev) => ({ ...prev, role: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editingMember?.bio || ''}
                onChange={(e) =>
                  setEditingMember((prev) => ({ ...prev, bio: e.target.value }))
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={editingMember?.image_url || ''}
                  onChange={(e) =>
                    setEditingMember((prev) => ({ ...prev, image_url: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram Handle</Label>
                <Input
                  id="instagram"
                  placeholder="username"
                  value={editingMember?.instagram_handle || ''}
                  onChange={(e) =>
                    setEditingMember((prev) => ({
                      ...prev,
                      instagram_handle: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Years Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={editingMember?.years_experience || 0}
                  onChange={(e) =>
                    setEditingMember((prev) => ({
                      ...prev,
                      years_experience: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-2 flex items-end">
                <div className="flex items-center gap-2">
                  <Switch
                    id="active"
                    checked={editingMember?.is_active ?? true}
                    onCheckedChange={(checked) =>
                      setEditingMember((prev) => ({ ...prev, is_active: checked }))
                    }
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">Specialties (comma-separated)</Label>
              <Input
                id="specialties"
                placeholder="Bridal, Editorial, Special FX"
                value={specialtiesInput}
                onChange={(e) => setSpecialtiesInput(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveMember}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManager;
