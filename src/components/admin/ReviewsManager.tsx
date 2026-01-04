import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Check, X, Trash2, Star } from 'lucide-react';

interface Review {
  id: string;
  client_name: string;
  client_email: string;
  rating: number;
  review_text: string | null;
  service_name: string | null;
  is_approved: boolean | null;
  created_at: string;
}

const ReviewsManager = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch reviews',
        variant: 'destructive',
      });
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateApproval = async (id: string, isApproved: boolean) => {
    const { error } = await supabase
      .from('reviews')
      .update({ is_approved: isApproved })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update review',
        variant: 'destructive',
      });
    } else {
      toast({ title: isApproved ? 'Review approved' : 'Review rejected' });
      fetchReviews();
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Review deleted' });
      fetchReviews();
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="text-muted-foreground animate-pulse">Loading reviews...</div>;
  }

  const pendingCount = reviews.filter((r) => !r.is_approved).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-light">Reviews</h2>
        <div className="flex gap-2">
          {pendingCount > 0 && (
            <Badge variant="outline" className="bg-primary/10">
              {pendingCount} pending
            </Badge>
          )}
          <Badge variant="secondary">{reviews.length} total</Badge>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No reviews yet
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="max-w-xs">Review</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{review.client_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(review.created_at), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{renderStars(review.rating)}</TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate text-sm">{review.review_text || 'No comment'}</p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {review.service_name || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={review.is_approved ? 'default' : 'outline'}>
                      {review.is_approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {!review.is_approved && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateApproval(review.id, true)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Check size={16} />
                        </Button>
                      )}
                      {review.is_approved && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateApproval(review.id, false)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X size={16} />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteReview(review.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ReviewsManager;
