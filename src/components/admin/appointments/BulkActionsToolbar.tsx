import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Trash2,
  ChevronDown,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkConfirm: () => void;
  onBulkComplete: () => void;
  onBulkCancel: () => void;
  onBulkSendReminder: () => void;
  onBulkDelete: () => void;
  isLoading?: boolean;
}

const BulkActionsToolbar = ({
  selectedCount,
  onClearSelection,
  onBulkConfirm,
  onBulkComplete,
  onBulkCancel,
  onBulkSendReminder,
  onBulkDelete,
  isLoading = false,
}: BulkActionsToolbarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className={cn(
      'flex items-center justify-between gap-4 p-3 rounded-lg',
      'bg-primary/10 border border-primary/30 animate-in slide-in-from-top-2'
    )}>
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="bg-primary text-primary-foreground">
          {selectedCount} selected
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-8 px-2"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {/* Status Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isLoading}>
              Update Status
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onBulkConfirm}>
              <CheckCircle2 className="h-4 w-4 mr-2 text-blue-500" />
              Confirm All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBulkComplete}>
              <Clock className="h-4 w-4 mr-2 text-green-500" />
              Mark Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBulkCancel}>
              <XCircle className="h-4 w-4 mr-2 text-red-500" />
              Cancel All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Send Reminder */}
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkSendReminder}
          disabled={isLoading}
        >
          <Send className="h-4 w-4 mr-1" />
          Send Reminders
        </Button>

        {/* Delete */}
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkDelete}
          disabled={isLoading}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default BulkActionsToolbar;
