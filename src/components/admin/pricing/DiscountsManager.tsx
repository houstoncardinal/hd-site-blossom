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
import { DiscountCodeForm } from './DiscountCodeForm';
import { useDiscountCodes } from './hooks/useDiscountCodes';
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Search,
  Eye,
  EyeOff,
  Tag,
  Calendar,
  Users,
  Copy,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { DiscountCode } from '@/types/pricing';
import { formatDiscount, isDiscountCodeValid } from '@/types/pricing';

export const DiscountsManager = () => {
  const [discountDialogOpen, setDiscountDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { discounts, loading, updateDiscount, deleteDiscount, refetch } = useDiscountCodes();
  const { toast } = useToast();

  const filteredDiscounts = discounts.filter((discount) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      discount.code.toLowerCase().includes(query) ||
      discount.name.toLowerCase().includes(query) ||
      discount.description?.toLowerCase().includes(query)
    );
  });

  const handleOpenDialog = (discount?: DiscountCode) => {
    setEditingDiscount(discount || null);
    setDiscountDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDiscountDialogOpen(false);
    setEditingDiscount(null);
  };

  const handleToggleActive = async (discount: DiscountCode) => {
    const success = await updateDiscount(discount.id, { is_active: !discount.is_active });
    if (success) {
      toast({
        title: 'Success',
        description: `Discount code ${discount.is_active ? 'deactivated' : 'activated'}`,
      });
    }
  };

  const handleDelete = async (discount: DiscountCode) => {
    if (!confirm(`Are you sure you want to delete discount code "${discount.code}"?`)) {
      return;
    }

    const success = await deleteDiscount(discount.id);
    if (success) {
      toast({
        title: 'Success',
        description: 'Discount code deleted successfully',
      });
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: 'Copied',
      description: `Code "${code}" copied to clipboard`,
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDateRange = (discount: DiscountCode) => {
    const from = new Date(discount.valid_from).toLocaleDateString();
    const until = new Date(discount.valid_until).toLocaleDateString();
    return `${from} - ${until}`;
  };

  const getUsageText = (discount: DiscountCode) => {
    if (discount.usage_limit) {
      return `${discount.usage_count}/${discount.usage_limit} used`;
    }
    return `${discount.usage_count} used`;
  };

  const isValid = (discount: DiscountCode) => isDiscountCodeValid(discount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Discount Codes & Promotions
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage promotional discount codes
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus size={16} className="mr-2" />
          Create Code
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search discount codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{discounts.length} total</Badge>
          <Badge variant="default">
            {discounts.filter((d) => d.is_active && isValid(d)).length} active
          </Badge>
        </div>
      </div>

      {/* Discounts Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground mt-4">Loading discount codes...</p>
        </div>
      ) : filteredDiscounts.length === 0 ? (
        <div className="text-center py-12">
          <Tag size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No discount codes found</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {searchQuery ? 'Try a different search term' : 'Create your first discount code'}
          </p>
          {!searchQuery && (
            <Button onClick={() => handleOpenDialog()}>
              <Plus size={16} className="mr-2" />
              Create Code
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDiscounts.map((discount) => {
            const valid = isValid(discount);
            return (
              <motion.div
                key={discount.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card
                  className={`p-4 space-y-3 hover:shadow-lg transition-shadow ${
                    !valid ? 'opacity-60' : ''
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{discount.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="font-mono text-xs cursor-pointer hover:bg-accent"
                          onClick={() => handleCopyCode(discount.code)}
                        >
                          {discount.code}
                          {copiedCode === discount.code ? (
                            <CheckCircle2 size={12} className="ml-1" />
                          ) : (
                            <Copy size={12} className="ml-1" />
                          )}
                        </Badge>
                        {valid ? (
                          <Badge variant="default" className="text-xs">
                            <CheckCircle2 size={12} className="mr-1" />
                            Valid
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            <XCircle size={12} className="mr-1" />
                            Expired
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!discount.is_active && (
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
                          <DropdownMenuItem onClick={() => handleCopyCode(discount.code)}>
                            <Copy size={16} className="mr-2" />
                            Copy Code
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleOpenDialog(discount)}>
                            <Edit size={16} className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(discount)}>
                            {discount.is_active ? (
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
                            onClick={() => handleDelete(discount)}
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
                  {discount.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {discount.description}
                    </p>
                  )}

                  {/* Discount Value */}
                  <div className="flex items-center justify-center py-2 border-y">
                    <span className="text-2xl font-bold text-primary">
                      {formatDiscount(discount.discount_type, discount.discount_value)}
                    </span>
                  </div>

                  {/* Usage Stats */}
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground">{getUsageText(discount)}</span>
                  </div>

                  {/* Date Range */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={14} />
                    <span className="text-xs">{formatDateRange(discount)}</span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Discount Code Form Dialog */}
      <DiscountCodeForm
        open={discountDialogOpen}
        onClose={handleCloseDialog}
        discount={editingDiscount}
        onSuccess={refetch}
      />
    </div>
  );
};
