import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PackageForm } from './PackageForm';
import { usePackages } from './hooks/usePackages';
import { Package, Plus, MoreVertical, Edit, Trash2, Search, Eye, EyeOff, DollarSign, Clock, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ServicePackage } from '@/types/services';
import { formatPrice, formatDuration } from '@/types/services';

export const PackagesManager = () => {
  const [packageDialogOpen, setPackageDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { packages, loading, updatePackage, deletePackage, refetch } = usePackages();
  const { toast } = useToast();

  const filteredPackages = packages.filter((pkg) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      pkg.name.toLowerCase().includes(query) ||
      pkg.description?.toLowerCase().includes(query)
    );
  });

  const handleOpenDialog = (pkg?: ServicePackage) => {
    setEditingPackage(pkg || null);
    setPackageDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setPackageDialogOpen(false);
    setEditingPackage(null);
  };

  const handleToggleActive = async (pkg: ServicePackage) => {
    const success = await updatePackage(pkg.id, { is_active: !pkg.is_active });
    if (success) {
      toast({
        title: 'Success',
        description: `Package ${pkg.is_active ? 'deactivated' : 'activated'}`,
      });
    }
  };

  const handleDelete = async (pkg: ServicePackage) => {
    if (
      !confirm(
        `Are you sure you want to delete "${pkg.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    const success = await deletePackage(pkg.id);
    if (success) {
      toast({
        title: 'Success',
        description: 'Package deleted successfully',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-light flex items-center gap-2">
            <Package className="h-6 w-6" />
            Service Packages
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Create bundled service packages with special pricing
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus size={16} className="mr-2" />
          Create Package
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{packages.length} total</Badge>
          <Badge variant="default">
            {packages.filter((p) => p.is_active).length} active
          </Badge>
        </div>
      </div>

      {/* Packages Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground mt-4">Loading packages...</p>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No packages found</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {searchQuery ? 'Try a different search term' : 'Create your first package to get started'}
          </p>
          {!searchQuery && (
            <Button onClick={() => handleOpenDialog()}>
              <Plus size={16} className="mr-2" />
              Create Package
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPackages.map((pkg) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="p-4 space-y-3 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{pkg.name}</h4>
                    <p className="text-xs text-muted-foreground">/{pkg.slug}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {!pkg.is_active && (
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
                        <DropdownMenuItem onClick={() => handleOpenDialog(pkg)}>
                          <Edit size={16} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(pkg)}>
                          {pkg.is_active ? (
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
                          onClick={() => handleDelete(pkg)}
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
                {pkg.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {pkg.description}
                  </p>
                )}

                {/* Package Info */}
                <div className="text-sm text-muted-foreground">
                  Bundled package
                </div>

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Package Price:</span>
                    <span className="font-semibold text-lg">{formatPrice(pkg.package_price)}</span>
                  </div>

                  {pkg.savings_amount && pkg.savings_amount > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <TrendingDown size={14} className="text-green-600 dark:text-green-400" />
                      <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                        Save {formatPrice(pkg.savings_amount)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Duration and Deposit */}
                <div className="flex items-center gap-4 text-sm pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-muted-foreground" />
                    <span>{formatDuration(pkg.total_duration_minutes || 0)}</span>
                  </div>
                  {pkg.deposit_percentage && pkg.deposit_percentage > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {pkg.deposit_percentage}% deposit
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Package Form Dialog */}
      <PackageForm
        open={packageDialogOpen}
        onClose={handleCloseDialog}
        package={editingPackage}
        onSuccess={refetch}
      />
    </motion.div>
  );
};
