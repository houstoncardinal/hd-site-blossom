import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  email_notifications: boolean;
  push_notifications: boolean;
  dashboard_layout: Record<string, unknown>;
  preferences: Record<string, unknown>;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  email_notifications: true,
  push_notifications: true,
  dashboard_layout: {},
  preferences: {},
};

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) {
        setSettings(DEFAULT_SETTINGS);
        return;
      }

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userData.user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          theme: (data.theme as UserSettings['theme']) || DEFAULT_SETTINGS.theme,
          email_notifications: data.email_notifications ?? DEFAULT_SETTINGS.email_notifications,
          push_notifications: data.push_notifications ?? DEFAULT_SETTINGS.push_notifications,
          dashboard_layout: (data.dashboard_layout as Record<string, unknown>) || DEFAULT_SETTINGS.dashboard_layout,
          preferences: (data.preferences as Record<string, unknown>) || DEFAULT_SETTINGS.preferences,
        });
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (updates: Partial<UserSettings>): Promise<boolean> => {
    try {
      setSaving(true);

      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) {
        toast({
          title: 'Error',
          description: 'You must be logged in to save settings.',
          variant: 'destructive',
        });
        return false;
      }

      const newSettings = { ...settings, ...updates };

      // Check if settings exist
      const { data: existing } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', userData.user.id)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('user_settings')
          .update({
            theme: newSettings.theme,
            email_notifications: newSettings.email_notifications,
            push_notifications: newSettings.push_notifications,
            dashboard_layout: newSettings.dashboard_layout as Json,
            preferences: newSettings.preferences as Json,
          })
          .eq('user_id', userData.user.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('user_settings')
          .insert([{
            user_id: userData.user.id,
            theme: newSettings.theme,
            email_notifications: newSettings.email_notifications,
            push_notifications: newSettings.push_notifications,
            dashboard_layout: newSettings.dashboard_layout as Json,
            preferences: newSettings.preferences as Json,
          }]);

        if (error) throw error;
      }

      setSettings(newSettings);

      toast({
        title: 'Settings saved',
        description: 'Your preferences have been updated.',
      });

      return true;
    } catch (error) {
      console.error('Error saving user settings:', error);
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

  return {
    settings,
    loading,
    saving,
    updateSettings,
    refetch: fetchSettings,
  };
}
