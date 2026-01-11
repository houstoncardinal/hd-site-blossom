import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pencil,
  Trash2,
  Clock,
  DollarSign,
  Star,
  MoreVertical,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
} from 'lucide-react';
import { Service, ServiceCategory } from './hooks/useServicesData';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
  categories: ServiceCategory[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  onTogglePopular: (id: string, isPopular: boolean) => void;
  onDuplicate: (service: Service) => void;
  isDragging?: boolean;
}

const ServiceCard = ({
  service,
  categories,
  onEdit,
  onDelete,
  onToggleActive,
  onTogglePopular,
  onDuplicate,
  isDragging,
}: ServiceCardProps) => {
  const category = categories.find(c => c.name === service.category);

  return (
    <Card
      className={cn(
        'transition-all group',
        !service.is_active && 'opacity-60',
        isDragging && 'shadow-lg rotate-1 scale-105',
        service.is_popular && 'ring-2 ring-yellow-400/50'
      )}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity mt-1">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium truncate">{service.name}</h3>
                {service.is_popular && (
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                )}
              </div>
              <Badge variant="outline" className="text-xs mt-1">
                {category?.display_name || service.category}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Switch
              checked={service.is_active}
              onCheckedChange={() => onToggleActive(service.id, service.is_active)}
              className="data-[state=checked]:bg-green-500"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(service)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(service)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTogglePopular(service.id, service.is_popular)}>
                  <Star className="h-4 w-4 mr-2" />
                  {service.is_popular ? 'Remove Popular' : 'Mark Popular'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleActive(service.id, service.is_active)}>
                  {service.is_active ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(service.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Image Preview */}
        {service.image_url && (
          <div className="h-24 w-full rounded-md overflow-hidden mb-3 bg-muted">
            <img
              src={service.image_url}
              alt={service.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Description */}
        {service.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {service.description}
          </p>
        )}

        {/* Includes Preview */}
        {service.includes && service.includes.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1">Includes:</p>
            <div className="flex flex-wrap gap-1">
              {service.includes.slice(0, 3).map((item, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {item.length > 20 ? `${item.substring(0, 20)}...` : item}
                </Badge>
              ))}
              {service.includes.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{service.includes.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Footer Stats */}
        <div className="flex items-center justify-between text-sm pt-3 border-t border-border">
          <div className="flex items-center gap-1 font-medium">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span>${service.price}</span>
            {service.original_price && service.original_price > service.price && (
              <span className="text-muted-foreground line-through text-xs">
                ${service.original_price}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{service.duration || `${service.duration_minutes} min`}</span>
          </div>
        </div>

        {/* Deposit Info */}
        {service.deposit && (
          <div className="text-xs text-muted-foreground mt-2">
            Deposit: ${service.deposit} (Balance: ${service.price - service.deposit})
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
