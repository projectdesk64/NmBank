import React, { useState, useRef, useEffect } from 'react';
import { Smartphone, Radio, Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

export const QuickRecharge = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [fastagNumber, setFastagNumber] = useState('');
  const [dthNumber, setDthNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleRecharge = async (type: 'mobile' | 'fastag' | 'dth') => {
    setLoading(true);
    try {
      // Simulate API call
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setLoading(false);
        toast({
          title: "Recharge Initiated",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} recharge has been initiated successfully.`,
        });
        timeoutRef.current = null;
      }, 1000);
    } catch (error: unknown) {
      setLoading(false);
      const errorMessage = error instanceof Error ? error.message : 'Recharge failed. Please try again.';
      toast({
        title: "Recharge Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-large mb-8 max-w-[500px]">
      <h3 className="text-xl font-heading font-bold text-nmb-charcoal mb-6">Quick Recharge</h3>
      
      <Tabs defaultValue="mobile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="mobile" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">Mobile</span>
          </TabsTrigger>
          <TabsTrigger value="fastag" className="flex items-center gap-2">
            <Radio className="h-4 w-4" />
            <span className="hidden sm:inline">FASTag</span>
          </TabsTrigger>
          <TabsTrigger value="dth" className="flex items-center gap-2">
            <Tv className="h-4 w-4" />
            <span className="hidden sm:inline">DTH</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mobile" className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Mobile Number</label>
            <Input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter mobile number"
              className="h-12 bg-nmb-smoke border-nmb-mist rounded-lg"
              maxLength={10}
            />
          </div>
          <Button
            onClick={() => handleRecharge('mobile')}
            disabled={loading || mobileNumber.length !== 10}
            className="w-full h-12 bg-nmb-maroon hover:bg-[#6e0e00] text-white font-semibold rounded-lg"
          >
            {loading ? 'Processing...' : 'Proceed'}
          </Button>
        </TabsContent>

        <TabsContent value="fastag" className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">FASTag Number</label>
            <Input
              type="text"
              value={fastagNumber}
              onChange={(e) => setFastagNumber(e.target.value)}
              placeholder="Enter FASTag number"
              className="h-12 bg-nmb-smoke border-nmb-mist rounded-lg"
            />
          </div>
          <Button
            onClick={() => handleRecharge('fastag')}
            disabled={loading || !fastagNumber}
            className="w-full h-12 bg-nmb-maroon hover:bg-[#6e0e00] text-white font-semibold rounded-lg"
          >
            {loading ? 'Processing...' : 'Proceed'}
          </Button>
        </TabsContent>

        <TabsContent value="dth" className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">DTH Number</label>
            <Input
              type="text"
              value={dthNumber}
              onChange={(e) => setDthNumber(e.target.value)}
              placeholder="Enter DTH number"
              className="h-12 bg-nmb-smoke border-nmb-mist rounded-lg"
            />
          </div>
          <Button
            onClick={() => handleRecharge('dth')}
            disabled={loading || !dthNumber}
            className="w-full h-12 bg-nmb-maroon hover:bg-[#6e0e00] text-white font-semibold rounded-lg"
          >
            {loading ? 'Processing...' : 'Proceed'}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

