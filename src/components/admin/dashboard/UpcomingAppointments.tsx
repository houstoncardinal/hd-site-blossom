import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface UpcomingAppointmentsProps {
  appointments: any[];
  onNavigate: (tab: string) => void;
}

export const UpcomingAppointments = ({ appointments, onNavigate }: UpcomingAppointmentsProps) => {
  // Filter upcoming appointments (today and future, pending or confirmed)
  const upcomingAppointments = appointments
    .filter(apt => {
      const aptDate = parseISO(apt.appointment_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return aptDate >= today && (apt.status === 'pending' || apt.status === 'confirmed');
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
      const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 6);

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE, MMM d');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-blue-500" />
            </div>
            Upcoming Schedule
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('appointments')}
            className="text-primary hover:text-primary"
          >
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {upcomingAppointments.length === 0 ? (
          <div className="py-12 text-center">
            <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No upcoming appointments</p>
            <Button
              variant="link"
              size="sm"
              onClick={() => onNavigate('appointments')}
              className="mt-2"
            >
              Create one now →
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {upcomingAppointments.map((apt, index) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-muted/30 transition-colors cursor-pointer group"
                onClick={() => onNavigate('appointments')}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-11 w-11 border-2 border-border group-hover:border-primary/50 transition-colors">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {apt.client_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium text-sm truncate">{apt.client_name}</p>
                      <Badge variant="outline" className={`text-xs shrink-0 ${getStatusColor(apt.status)}`}>
                        {apt.status || 'pending'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        {apt.service_name}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={`text-sm font-medium ${isToday(parseISO(apt.appointment_date)) ? 'text-primary' : ''}`}>
                      {getDateLabel(apt.appointment_date)}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                      <Clock className="h-3 w-3" />
                      {apt.appointment_time}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;
