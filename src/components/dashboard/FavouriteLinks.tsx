import React, { useState, useMemo } from 'react';
import { FileText, TrendingUp, Download, CreditCard, ArrowRight, Edit2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface FavouriteLink {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
}

export const FavouriteLinks = () => {
  const { t } = useLanguage();
  const favourites = useMemo<FavouriteLink[]>(() => [
    { id: '1', label: t.dashboard.favouriteLinks.accountStatement, icon: FileText },
    { id: '2', label: t.dashboard.favouriteLinks.openFD, icon: TrendingUp },
    { id: '3', label: t.dashboard.favouriteLinks.downloadFDSummary, icon: Download },
    { id: '4', label: t.dashboard.favouriteLinks.sweepInOD, icon: CreditCard },
    { id: '5', label: t.dashboard.favouriteLinks.casaCertificate, icon: FileText },
  ], [t.dashboard.favouriteLinks]);
  const [editing, setEditing] = useState(false);

  const handleRemove = (id: string) => {
    setFavourites(favourites.filter(fav => fav.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-large sticky top-[140px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-heading font-bold text-nmb-charcoal">{t.dashboard.favouriteLinks.title}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditing(!editing)}
          className="text-nmb-blue hover:text-nmb-blue/80"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {favourites.map((link) => {
          const Icon = link.icon;
          return (
            <div
              key={link.id}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-nmb-smoke transition-colors group"
            >
              <button
                onClick={() => link.path && (window.location.href = link.path)}
                className="flex items-center gap-3 flex-1 text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-nmb-maroon/10 text-nmb-maroon flex items-center justify-center group-hover:bg-nmb-maroon/20 transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-gray-900 group-hover:text-nmb-maroon transition-colors">
                  {link.label}
                </span>
              </button>
              {editing && (
                <button
                  onClick={() => handleRemove(link.id)}
                  className="p-1 hover:bg-red-50 rounded text-red-600 transition-colors"
                  aria-label={`Remove ${link.label}`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {!editing && (
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-nmb-maroon transition-colors" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

