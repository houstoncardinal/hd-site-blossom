import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TiersManager } from './TiersManager';
import { AddOnsManager } from './AddOnsManager';
import { PricingRulesManager } from './PricingRulesManager';
import { DiscountsManager } from './DiscountsManager';
import { DollarSign, Layers, Plus, Zap, Tag } from 'lucide-react';

export const PricingManager = () => {
  const [activeTab, setActiveTab] = useState('tiers');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif font-light flex items-center gap-2">
          <DollarSign className="h-6 w-6" />
          Pricing Manager
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Manage tiered pricing, add-ons, dynamic rules, and discount codes
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tiers" className="gap-2">
            <Layers size={16} />
            <span className="hidden sm:inline">Pricing Tiers</span>
            <span className="sm:hidden">Tiers</span>
          </TabsTrigger>
          <TabsTrigger value="addons" className="gap-2">
            <Plus size={16} />
            <span className="hidden sm:inline">Add-Ons</span>
            <span className="sm:hidden">Add-Ons</span>
          </TabsTrigger>
          <TabsTrigger value="rules" className="gap-2">
            <Zap size={16} />
            <span className="hidden sm:inline">Dynamic Rules</span>
            <span className="sm:hidden">Rules</span>
          </TabsTrigger>
          <TabsTrigger value="discounts" className="gap-2">
            <Tag size={16} />
            <span className="hidden sm:inline">Discounts</span>
            <span className="sm:hidden">Codes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tiers" className="mt-6">
          <TiersManager />
        </TabsContent>

        <TabsContent value="addons" className="mt-6">
          <AddOnsManager />
        </TabsContent>

        <TabsContent value="rules" className="mt-6">
          <PricingRulesManager />
        </TabsContent>

        <TabsContent value="discounts" className="mt-6">
          <DiscountsManager />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default PricingManager;
