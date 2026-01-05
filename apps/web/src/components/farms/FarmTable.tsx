import { Link } from 'react-router-dom';
import { ExternalLink, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RiskBadge } from './RiskBadge';
import { ChainBadge } from './ChainBadge';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { formatTVL, formatAPY } from '@/types/farm';
import { cn } from '@/lib/utils';
import type { Farm } from '@/types/farm';

interface FarmTableProps {
  farms: Farm[];
  isLoading: boolean;
  sortColumn: string;
  onSort: (column: string) => void;
}

const columns = [
  { key: 'name', label: 'Pool', sortable: false },
  { key: 'chain', label: 'Chain', sortable: false },
  { key: 'tvl', label: 'TVL', sortable: true },
  { key: 'totalAPY', label: 'APY', sortable: true },
  { key: 'riskScore', label: 'Risk', sortable: true },
  { key: 'actions', label: '', sortable: false },
];

export function FarmTable({ farms, isLoading, sortColumn, onSort }: FarmTableProps) {
  if (isLoading) {
    return <TableSkeleton rows={10} />;
  }

  if (farms.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-text-muted text-lg mb-2">No farms found</div>
        <p className="text-text-secondary text-sm">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface-border bg-background-secondary/50">
            {columns.map(({ key, label, sortable }) => (
              <th
                key={key}
                className={cn(
                  'px-5 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider',
                  sortable && 'cursor-pointer hover:text-accent transition-colors'
                )}
                onClick={() => sortable && onSort(key)}
              >
                <div className="flex items-center gap-1.5">
                  {label}
                  {sortable && (
                    <ArrowUpDown
                      className={cn(
                        'h-3.5 w-3.5',
                        sortColumn.replace('-', '') === key ? 'text-accent' : 'text-text-muted'
                      )}
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border/50">
          {farms.map((farm) => (
            <FarmRow key={farm.id} farm={farm} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FarmRow({ farm }: { farm: Farm }) {
  const tvlChange = farm.tvlChange24h;

  return (
    <tr className="hover:bg-surface/30 transition-colors group">
      {/* Pool */}
      <td className="px-5 py-4">
        <Link to={`/farm/${encodeURIComponent(farm.id)}`} className="block">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-surface to-surface-hover border border-surface-border flex items-center justify-center text-xs font-bold text-accent group-hover:border-accent/30 transition-colors">
              {farm.protocol.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                {farm.tokens.join(' - ')}
              </div>
              <div className="text-sm text-text-secondary">{farm.protocol}</div>
            </div>
          </div>
        </Link>
      </td>

      {/* Chain */}
      <td className="px-5 py-4">
        <ChainBadge chain={farm.chain} />
      </td>

      {/* TVL */}
      <td className="px-5 py-4">
        <div className="text-text-primary font-semibold">{formatTVL(farm.tvl)}</div>
        {tvlChange !== 0 && (
          <div className={cn('text-xs flex items-center gap-1 mt-0.5', tvlChange > 0 ? 'text-success' : 'text-danger')}>
            {tvlChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {tvlChange > 0 ? '+' : ''}{tvlChange.toFixed(1)}%
          </div>
        )}
      </td>

      {/* APY */}
      <td className="px-5 py-4">
        <div className="text-accent font-bold text-lg">{formatAPY(farm.totalAPY)}</div>
        <div className="text-xs text-text-muted mt-0.5">
          {formatAPY(farm.baseAPY)} base + {formatAPY(farm.rewardAPY)} rewards
        </div>
      </td>

      {/* Risk */}
      <td className="px-5 py-4">
        <RiskBadge score={farm.riskScore} />
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <a href={farm.farmUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            Farm
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </a>
      </td>
    </tr>
  );
}
