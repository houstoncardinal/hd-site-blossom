import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Save,
  Building2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface BusinessHours {
  day: string;
  isOpen: boolean;
  open: string;
  close: string;
}

const BusinessSettings = () => {
  const { toast } = useToast();
  
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Glamour Studio',
    tagline: 'Professional Makeup Artistry',
    email: 'hello@glamourstudio.com',
    phone: '+1 (555) 123-4567',
    address: '123 Beauty Lane, Suite 100',
    city: 'Los Angeles, CA 90001',
    website: 'https://glamourstudio.com',
    instagram: '@glamourstudio',
  });

  const [hours, setHours] = useState<BusinessHours[]>([
    { day: 'Monday', isOpen: true, open: '09:00', close: '18:00' },
    { day: 'Tuesday', isOpen: true, open: '09:00', close: '18:00' },
    { day: 'Wednesday', isOpen: true, open: '09:00', close: '18:00' },
    { day: 'Thursday', isOpen: true, open: '09:00', close: '20:00' },
    { day: 'Friday', isOpen: true, open: '09:00', close: '20:00' },
    { day: 'Saturday', isOpen: true, open: '10:00', close: '17:00' },
    { day: 'Sunday', isOpen: false, open: '10:00', close: '16:00' },
  ]);

  const [bookingSettings, setBookingSettings] = useState({
    allowOnlineBooking: true,
    requireDeposit: true,
    depositAmount: 50,
    cancellationHours: 24,
    maxAdvanceBookingDays: 90,
    autoConfirmBookings: false,
  });

  const updateHours = (index: number, field: keyof BusinessHours, value: any) => {
    const updated = [...hours];
    updated[index] = { ...updated[index], [field]: value };
    setHours(updated);
  };

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your business settings have been updated.',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-light flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Business Settings
        </h2>
        <Button onClick={handleSave}>
          <Save size={16} className="mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name</Label>
                <Input
                  id="name"
                  value={businessInfo.name}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={businessInfo.tagline}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, tagline: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </Label>
              <Input
                id="address"
                value={businessInfo.address}
                onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
              />
              <Input
                value={businessInfo.city}
                onChange={(e) => setBusinessInfo({ ...businessInfo, city: e.target.value })}
                placeholder="City, State ZIP"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={businessInfo.phone}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={businessInfo.email}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Website
                </Label>
                <Input
                  id="website"
                  value={businessInfo.website}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  value={businessInfo.instagram}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, instagram: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Business Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hours.map((day, index) => (
                <div 
                  key={day.day}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                >
                  <Switch
                    checked={day.isOpen}
                    onCheckedChange={(checked) => updateHours(index, 'isOpen', checked)}
                  />
                  <span className="w-24 text-sm font-medium">{day.day}</span>
                  {day.isOpen ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="time"
                        value={day.open}
                        onChange={(e) => updateHours(index, 'open', e.target.value)}
                        className="w-28"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={day.close}
                        onChange={(e) => updateHours(index, 'close', e.target.value)}
                        className="w-28"
                      />
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Closed
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Booking Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Booking Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-medium">Online Booking</p>
                  <p className="text-sm text-muted-foreground">Allow clients to book online</p>
                </div>
                <Switch
                  checked={bookingSettings.allowOnlineBooking}
                  onCheckedChange={(checked) => 
                    setBookingSettings({ ...bookingSettings, allowOnlineBooking: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-medium">Auto-Confirm</p>
                  <p className="text-sm text-muted-foreground">Automatically confirm bookings</p>
                </div>
                <Switch
                  checked={bookingSettings.autoConfirmBookings}
                  onCheckedChange={(checked) => 
                    setBookingSettings({ ...bookingSettings, autoConfirmBookings: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-medium">Require Deposit</p>
                  <p className="text-sm text-muted-foreground">Collect deposit on booking</p>
                </div>
                <Switch
                  checked={bookingSettings.requireDeposit}
                  onCheckedChange={(checked) => 
                    setBookingSettings({ ...bookingSettings, requireDeposit: checked })
                  }
                />
              </div>

              <div className="space-y-2 p-4 rounded-lg border border-border">
                <Label htmlFor="deposit">Deposit Amount ($)</Label>
                <Input
                  id="deposit"
                  type="number"
                  value={bookingSettings.depositAmount}
                  onChange={(e) => 
                    setBookingSettings({ ...bookingSettings, depositAmount: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2 p-4 rounded-lg border border-border">
                <Label htmlFor="cancellation">Cancellation Notice (hours)</Label>
                <Input
                  id="cancellation"
                  type="number"
                  value={bookingSettings.cancellationHours}
                  onChange={(e) => 
                    setBookingSettings({ ...bookingSettings, cancellationHours: parseInt(e.target.value) || 24 })
                  }
                />
              </div>

              <div className="space-y-2 p-4 rounded-lg border border-border">
                <Label htmlFor="advance">Max Advance Booking (days)</Label>
                <Input
                  id="advance"
                  type="number"
                  value={bookingSettings.maxAdvanceBookingDays}
                  onChange={(e) => 
                    setBookingSettings({ ...bookingSettings, maxAdvanceBookingDays: parseInt(e.target.value) || 90 })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default BusinessSettings;
