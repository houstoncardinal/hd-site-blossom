import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

interface BusinessInfo {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  website: string;
  instagram: string;
}

interface BusinessHours {
  day: string;
  isOpen: boolean;
  open: string;
  close: string;
}

interface BookingSettings {
  allowOnlineBooking: boolean;
  requireDeposit: boolean;
  depositAmount: number;
  cancellationHours: number;
  maxAdvanceBookingDays: number;
  autoConfirmBookings: boolean;
}

const DEFAULT_BUSINESS_INFO: BusinessInfo = {
  name: 'HDA Studio',
  tagline: 'Professional Makeup Artistry',
  email: 'hello@hdastudio.com',
  phone: '+1 (555) 123-4567',
  address: '123 Beauty Lane, Suite 100',
  city: 'Houston, TX 77001',
  website: 'https://hdastudio.com',
  instagram: '@hdastudio',
};

const DEFAULT_HOURS: BusinessHours[] = [
  { day: 'Monday', isOpen: true, open: '09:00', close: '18:00' },
  { day: 'Tuesday', isOpen: true, open: '09:00', close: '18:00' },
  { day: 'Wednesday', isOpen: true, open: '09:00', close: '18:00' },
  { day: 'Thursday', isOpen: true, open: '09:00', close: '20:00' },
  { day: 'Friday', isOpen: true, open: '09:00', close: '20:00' },
  { day: 'Saturday', isOpen: true, open: '10:00', close: '17:00' },
  { day: 'Sunday', isOpen: false, open: '10:00', close: '16:00' },
];

const DEFAULT_BOOKING_SETTINGS: BookingSettings = {
  allowOnlineBooking: true,
  requireDeposit: true,
  depositAmount: 50,
  cancellationHours: 24,
  maxAdvanceBookingDays: 90,
  autoConfirmBookings: false,
};

export function useBusinessSettings() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(DEFAULT_BUSINESS_INFO);
  const [hours, setHours] = useState<BusinessHours[]>(DEFAULT_HOURS);
  const [bookingSettings, setBookingSettings] = useState<BookingSettings>(DEFAULT_BOOKING_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('business_settings')
        .select('setting_key, setting_value');

      if (error) throw error;

      if (data) {
        data.forEach((setting) => {
          const value = setting.setting_value as Record<string, unknown>;
          switch (setting.setting_key) {
            case 'business_info':
              setBusinessInfo({ ...DEFAULT_BUSINESS_INFO, ...value } as BusinessInfo);
              break;
            case 'business_hours':
              if (Array.isArray(value)) {
                setHours(value as BusinessHours[]);
              }
              break;
            case 'booking_settings':
              setBookingSettings({ ...DEFAULT_BOOKING_SETTINGS, ...value } as BookingSettings);
              break;
          }
        });
      }
    } catch (error) {
      console.error('Error fetching business settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async (): Promise<boolean> => {
    try {
      setSaving(true);

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id || null;

      const settings: Array<{
        setting_key: string;
        setting_value: unknown;
        category: string;
        updated_by: string | null;
      }> = [
        {
          setting_key: 'business_info',
          setting_value: businessInfo,
          category: 'general',
          updated_by: userId,
        },
        {
          setting_key: 'business_hours',
          setting_value: hours,
          category: 'hours',
          updated_by: userId,
        },
        {
          setting_key: 'booking_settings',
          setting_value: bookingSettings,
          category: 'booking',
          updated_by: userId,
        },
      ];

      for (const setting of settings) {
        // Check if setting exists
        const { data: existing } = await supabase
          .from('business_settings')
          .select('id')
          .eq('setting_key', setting.setting_key)
          .maybeSingle();

        if (existing) {
          // Update existing
          const { error } = await supabase
            .from('business_settings')
            .update({
              setting_value: setting.setting_value as Json,
              category: setting.category,
              updated_by: setting.updated_by,
            })
            .eq('setting_key', setting.setting_key);

          if (error) throw error;
        } else {
          // Insert new
          const { error } = await supabase
            .from('business_settings')
            .insert([{
              setting_key: setting.setting_key,
              setting_value: setting.setting_value as Json,
              category: setting.category,
              updated_by: setting.updated_by,
            }]);

          if (error) throw error;
        }
      }

      toast({
        title: 'Settings saved',
        description: 'Your business settings have been updated.',
      });

      return true;
    } catch (error) {
      console.error('Error saving business settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateHours = (index: number, field: keyof BusinessHours, value: unknown) => {
    const updated = [...hours];
    updated[index] = { ...updated[index], [field]: value };
    setHours(updated);
  };

  return {
    businessInfo,
    setBusinessInfo,
    hours,
    updateHours,
    bookingSettings,
    setBookingSettings,
    loading,
    saving,
    saveSettings,
    refetch: fetchSettings,
  };
}
