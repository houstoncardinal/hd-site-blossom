import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddOnForm } from './AddOnForm';
import { useAddOns } from './hooks/useAddOns';
import { Plus, MoreVertical, Edit, Trash2, Search, Eye, EyeOff, DollarSign, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { AddOn } from '@/types/pricing';
import { formatPrice, formatDuration } from '@/types/services';

export const AddOnsManager = () => {
  const [addOnDialogOpen, setAddOnDialogOpen] = useState(false);
  const [editingAddOn, setEditingAddOn] = useState<AddOn | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { addOns, loading, updateAddOn, deleteAddOn, refetch } = useAddOns();
  const { toast } = useToast();

  const filteredAddOns = addOns.filter((addOn) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      addOn.name.toLowerCase().includes(query) ||
      addOn.description?.toLowerCase().includes(query)
    );
  });

  const handleOpenDialog = (addOn?: AddOn) => {
    setEditingAddOn(addOn || null);
    setAddOnDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setAddOnDialogOpen(false);
    setEditingAddOn(null);
  };

  const handleToggleActive = async (addOn: AddOn) => {
    const success = await updateAddOn(addOn.id, { is_active: !addOn.is_active });
    if (success) {
      toast({
        title: 'Success',
        description: `Add-on ${addOn.is_active ? 'deactivated' : 'activated'}`,
      });
    }
  };

  const handleDelete = async (addOn: AddOn) => {
    if (!confirm(`Are you sure you want to delete "${addOn.name}"?`)) {
      return;
    }

    const success = await deleteAddOn(addOn.id);
    if (success) {
      toast({
        title: 'Success',
        description: 'Add-on deleted successfully',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add-Ons Marketplace
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Manage additional services and enhancements
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus size={16} className="mr-2" />
          Add Service
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search add-ons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{addOns.length} total</Badge>
          <Badge variant="default">
            {addOns.filter((a) => a.is_active).length} active
          </Badge>
        </div>
      </div>

      {/* Add-Ons Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground mt-4">Loading add-ons...</p>
        </div>
      ) : filteredAddOns.length === 0 ? (
        <div className="text-center py-12">
          <Plus size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No add-ons found</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {searchQuery ? 'Try a different search term' : 'Create your first add-on service'}
          </p>
          {!searchQuery && (
            <Button onClick={() => handleOpenDialog()}>
              <Plus size={16} className="mr-2" />
              Add Service
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAddOns.map((addOn) => (
            <motion.div
              key={addOn.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="p-4 space-y-3 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{addOn.name}</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    {!addOn.is_active && (
                      <Badge variant="secondary" className="text-xs">
                        Inactive
                      </Badge>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(addOn)}>
                          <Edit size={16} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(addOn)}>
                          {addOn.is_active ? (
                            <>
                              <EyeOff size={16} className="mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Eye size={16} className="mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(addOn)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Description */}
                {addOn.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {addOn.description}
                  </p>
                )}

                {/* Pricing and Duration */}
                <div className="flex items-center gap-4 text-sm pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} className="text-muted-foreground" />
                    <span className="font-medium">{formatPrice(addOn.price)}</span>
                  </div>
                  {addOn.duration_minutes && (
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-muted-foreground" />
                      <span>{formatDuration(addOn.duration_minutes)}</span>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add-On Form Dialog */}
      <AddOnForm
        open={addOnDialogOpen}
        onClose={handleCloseDialog}
        addOn={editingAddOn}
        onSuccess={refetch}
      />
    </div>
  );
};
