import { useState } from 'react';
import { getPublicSupabaseClient } from '@/integrations/supabase/publicClient';
import { ServiceConfig, AddOnService } from '@/config/services';

interface CheckoutData {
  service: ServiceConfig;
  addOns?: AddOnService[];
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  notes?: string;
}

export const useDepositCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiateCheckout = async (data: CheckoutData) => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = getPublicSupabaseClient();

      // Calculate totals with add-ons
      const addOnsTotal = data.addOns?.reduce((sum, addon) => sum + addon.price, 0) || 0;
      const fullPrice = data.service.price + addOnsTotal;
      const depositAmount = data.service.deposit + (addOnsTotal * 0.5);
      const remainingBalance = fullPrice - depositAmount;

      const { data: response, error: functionError } = await supabase.functions.invoke(
        'create-deposit-checkout',
        {
          body: {
            priceId: data.service.stripePriceId,
            serviceName: data.service.name,
            fullPrice,
            depositAmount,
            remainingBalance,
            customerEmail: data.customerEmail,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            appointmentDate: data.appointmentDate,
            appointmentTime: data.appointmentTime,
            notes: data.notes,
            addOns: data.addOns?.map(a => ({ name: a.name, price: a.price })),
          },
        }
      );

      if (functionError) {
        throw new Error(functionError.message || 'Failed to create checkout session');
      }

      if (response?.url) {
        window.open(response.url, '_blank');
        return { success: true, url: response.url };
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initiateCheckout,
    isLoading,
    error,
  };
};
