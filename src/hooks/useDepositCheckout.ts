import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ServiceConfig } from '@/config/services';

interface CheckoutData {
  service: ServiceConfig;
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
      const { data: response, error: functionError } = await supabase.functions.invoke(
        'create-deposit-checkout',
        {
          body: {
            priceId: data.service.stripePriceId,
            serviceName: data.service.name,
            fullPrice: data.service.price,
            depositAmount: data.service.deposit,
            remainingBalance: data.service.remainingBalance,
            customerEmail: data.customerEmail,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            appointmentDate: data.appointmentDate,
            appointmentTime: data.appointmentTime,
            notes: data.notes,
          },
        }
      );

      if (functionError) {
        throw new Error(functionError.message || 'Failed to create checkout session');
      }

      if (response?.url) {
        // Open Stripe checkout in new tab
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
