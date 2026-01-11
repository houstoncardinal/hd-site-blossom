import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Sparkles,
  Plus,
  Search,
  Filter,
  DollarSign,
  Clock,
  Star,
  Loader2,
  FolderPlus,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useServicesData, Service, ServiceFormData } from './hooks/useServicesData';
import ServiceFormDialog from './ServiceFormDialog';
import ServiceCard from './ServiceCard';
import { cn } from '@/lib/utils';

const ServicesManager = () => {
  const {
    services,
    categories,
    loading,
    saving,
    defaultFormData,
    createService,
    updateService,
    deleteService,
    toggleServiceActive,
    toggleServicePopular,
    duplicateService,
    createCategory,
  } = useServicesData();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && service.is_active) ||
        (statusFilter === 'inactive' && !service.is_active);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [services, searchQuery, categoryFilter, statusFilter]);

  const servicesByCategory = useMemo(() => {
    const grouped: Record<string, Service[]> = {};
    filteredServices.forEach(service => {
      if (!grouped[service.category]) grouped[service.category] = [];
      grouped[service.category].push(service);
    });
    return grouped;
  }, [filteredServices]);

  const stats = useMemo(() => ({
    total: services.length,
    active: services.filter(s => s.is_active).length,
    popular: services.filter(s => s.is_popular).length,
    priceRange: services.length > 0
      ? { min: Math.min(...services.map(s => s.price)), max: Math.max(...services.map(s => s.price)) }
      : { min: 0, max: 0 },
  }), [services]);

  const handleSave = async (formData: ServiceFormData): Promise<boolean> => {
    if (editingService) return updateService(editingService.id, formData);
    return createService(formData);
  };

  const handleConfirmDelete = async () => {
    if (serviceToDelete) {
      await deleteService(serviceToDelete);
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-serif font-light flex items-center gap-2">
          <Sparkles className="h-6 w-6" />Services Manager
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setCategoryDialogOpen(true)}>
            <FolderPlus size={16} className="mr-2" />Category
          </Button>
          <Button onClick={() => { setEditingService(null); setFormDialogOpen(true); }}>
            <Plus size={16} className="mr-2" />Add Service
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><Sparkles className="h-5 w-5 text-primary" /></div>
          <div><p className="text-2xl font-bold">{stats.active}/{stats.total}</p><p className="text-sm text-muted-foreground">Active Services</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center"><Star className="h-5 w-5 text-yellow-500" /></div>
          <div><p className="text-2xl font-bold">{stats.popular}</p><p className="text-sm text-muted-foreground">Popular</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center"><DollarSign className="h-5 w-5 text-green-500" /></div>
          <div><p className="text-2xl font-bold">${stats.priceRange.min}-${stats.priceRange.max}</p><p className="text-sm text-muted-foreground">Price Range</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center"><Clock className="h-5 w-5 text-blue-500" /></div>
          <div><p className="text-2xl font-bold">{categories.length}</p><p className="text-sm text-muted-foreground">Categories</p></div>
        </CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search services..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[140px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.display_name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | 'active' | 'inactive')}>
          <SelectTrigger className="w-[120px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredServices.length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No services found</h3>
          <p className="text-muted-foreground mb-4">{services.length === 0 ? 'Add your first service' : 'Adjust filters'}</p>
          {services.length === 0 && <Button onClick={() => { setEditingService(null); setFormDialogOpen(true); }}><Plus size={16} className="mr-2" />Add Service</Button>}
        </CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} categories={categories}
              onEdit={(s) => { setEditingService(s); setFormDialogOpen(true); }}
              onDelete={(id) => { setServiceToDelete(id); setDeleteDialogOpen(true); }}
              onToggleActive={toggleServiceActive} onTogglePopular={toggleServicePopular} onDuplicate={duplicateService} />
          ))}
        </div>
      )}

      <ServiceFormDialog open={formDialogOpen} onOpenChange={setFormDialogOpen} service={editingService}
        categories={categories} defaultFormData={defaultFormData} saving={saving} onSave={handleSave} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Service?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Add Category</AlertDialogTitle></AlertDialogHeader>
          <Input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Category name" />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => { await createCategory(newCategoryName, newCategoryName); setNewCategoryName(''); setCategoryDialogOpen(false); }}>Create</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default ServicesManager;