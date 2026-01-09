import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { GalleryCategory } from '@/types/gallery';
import { GALLERY_CATEGORY_LABELS } from '@/types/gallery';

interface CategoryFilterProps {
  selected: string | null;
  onChange: (category: string | null) => void;
}

export const CategoryFilter = ({ selected, onChange }: CategoryFilterProps) => {
  const categories: Array<{ value: GalleryCategory | null; label: string }> = [
    { value: null, label: 'All Categories' },
    ...Object.entries(GALLERY_CATEGORY_LABELS).map(([value, label]) => ({
      value: value as GalleryCategory,
      label,
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isSelected = selected === category.value;

        return (
          <Button
            key={category.value || 'all'}
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(category.value)}
            className="transition-all"
          >
            {category.label}
            {isSelected && category.value && (
              <Badge variant="secondary" className="ml-2 bg-white/20">
                Active
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
};
