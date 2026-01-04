import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BookingData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceName: string;
  servicePrice: number;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

export const useBookAppointment = () => {
  return useMutation({
    mutationFn: async (data: BookingData) => {
      // 1. Save appointment to database
      const { data: appointment, error: dbError } = await supabase
        .from('appointments')
        .insert({
          client_name: data.clientName,
          client_email: data.clientEmail,
          client_phone: data.clientPhone,
          service_name: data.serviceName,
          service_price: data.servicePrice,
          appointment_date: data.appointmentDate,
          appointment_time: data.appointmentTime,
          notes: data.notes || null,
          status: 'confirmed',
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save appointment');
      }

      // 2. Send confirmation email
      try {
        const { error: emailError } = await supabase.functions.invoke('send-booking-confirmation', {
          body: {
            clientName: data.clientName,
            clientEmail: data.clientEmail,
            serviceName: data.serviceName,
            servicePrice: data.servicePrice,
            appointmentDate: data.appointmentDate,
            appointmentTime: data.appointmentTime,
            notes: data.notes,
          },
        });

        if (emailError) {
          console.error('Email error:', emailError);
          // Don't throw - booking was still successful
        }
      } catch (emailErr) {
        console.error('Failed to send confirmation email:', emailErr);
        // Don't throw - booking was still successful
      }

      return appointment;
    },
  });
};
