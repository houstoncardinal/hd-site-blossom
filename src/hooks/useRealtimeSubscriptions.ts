import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseRealtimeSubscriptionsOptions {
  onNewAppointment?: (appointment: any) => void;
  onAppointmentUpdate?: (appointment: any) => void;
  onNewReview?: (review: any) => void;
  onReviewUpdate?: (review: any) => void;
  enabled?: boolean;
}

export const useRealtimeSubscriptions = ({
  onNewAppointment,
  onAppointmentUpdate,
  onNewReview,
  onReviewUpdate,
  enabled = true,
}: UseRealtimeSubscriptionsOptions) => {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Create a single channel for all subscriptions
    const channel = supabase.channel('admin-realtime');

    // Subscribe to appointments changes
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'appointments',
      },
      (payload) => {
        console.log('New appointment:', payload);
        toast.success('New Appointment!', {
          description: `${payload.new.client_name} booked ${payload.new.service_name}`,
          duration: 5000,
        });
        onNewAppointment?.(payload.new);
      }
    );

    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'appointments',
      },
      (payload) => {
        console.log('Appointment updated:', payload);
        onAppointmentUpdate?.(payload.new);
      }
    );

    // Subscribe to reviews changes
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'reviews',
      },
      (payload) => {
        console.log('New review:', payload);
        toast.success('New Review!', {
          description: `${payload.new.client_name} left a ${payload.new.rating}-star review`,
          duration: 5000,
        });
        onNewReview?.(payload.new);
      }
    );

    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'reviews',
      },
      (payload) => {
        console.log('Review updated:', payload);
        onReviewUpdate?.(payload.new);
      }
    );

    // Subscribe to the channel
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Realtime subscriptions active');
      } else if (status === 'CHANNEL_ERROR') {
        console.error('Realtime subscription error');
      }
    });

    channelRef.current = channel;

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [enabled, onNewAppointment, onAppointmentUpdate, onNewReview, onReviewUpdate]);

  return {
    isConnected: !!channelRef.current,
  };
};

export default useRealtimeSubscriptions;
