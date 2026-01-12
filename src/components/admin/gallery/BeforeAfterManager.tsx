import { Card } from '@/components/ui/card';
import { ArrowRight, AlertCircle } from 'lucide-react';

// Placeholder component - gallery_images table needs to be created first
export const BeforeAfterManager = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Before & After Gallery
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Showcase transformations with before and after image pairs
          </p>
        </div>
      </div>

      <Card className="p-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Feature Coming Soon</h3>
          <p className="text-muted-foreground mt-2">
            The before/after gallery requires additional database setup.
            Contact support to enable this feature.
          </p>
        </div>
      </Card>
    </div>
  );
};
