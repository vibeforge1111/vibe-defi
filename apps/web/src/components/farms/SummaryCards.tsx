import { BarChart3, DollarSign, Percent, Building } from 'lucide-react';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/lib/utils';

interface SummaryCardsProps {
  totalPools: number;
  totalTvl: number;
  avgApy: number;
  protocolCount: number;
  isLoading: boolean;
}

export function SummaryCards({ totalPools, totalTvl, avgApy, protocolCount, isLoading }: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Pools',
      value: totalPools.toLocaleString(),
      icon: BarChart3,
      gradient: 'from-accent/20 to-emerald-500/10',
      iconBg: 'bg-accent/10 border-accent/30',
      iconColor: 'text-accent',
    },
    {
      label: 'Total TVL',
      value: formatCurrency(totalTvl),
      icon: DollarSign,
      gradient: 'from-emerald-500/20 to-green-500/10',
      iconBg: 'bg-emerald-500/10 border-emerald-500/30',
      iconColor: 'text-emerald-400',
    },
    {
      label: 'Average APY',
      value: `${avgApy.toFixed(1)}%`,
      icon: Percent,
      gradient: 'from-amber-500/20 to-orange-500/10',
      iconBg: 'bg-amber-500/10 border-amber-500/30',
      iconColor: 'text-amber-400',
    },
    {
      label: 'Protocols',
      value: protocolCount.toLocaleString(),
      icon: Building,
      gradient: 'from-purple-500/20 to-violet-500/10',
      iconBg: 'bg-purple-500/10 border-purple-500/30',
      iconColor: 'text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, gradient, iconBg, iconColor }) => (
        <div
          key={label}
          className="relative overflow-hidden rounded-xl border border-surface-border bg-surface/60 backdrop-blur-sm p-5 transition-all duration-300 hover:border-accent/30 hover:shadow-glow group"
        >
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-70 transition-opacity`} />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm text-text-secondary font-medium">{label}</p>
              <p className="text-2xl font-bold text-text-primary mt-2 font-sans">{value}</p>
            </div>
            <div className={`p-2.5 rounded-lg border ${iconBg} ${iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
