import { Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useFilterStore } from '@/store/filterStore';
import { SUPPORTED_CHAINS, POOL_TYPES, MIN_TVL_OPTIONS, SORT_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Chain, PoolType } from '@/types/farm';

export function FarmFilters() {
  const {
    chains,
    poolType,
    minTvl,
    stablecoinOnly,
    sort,
    toggleChain,
    setPoolType,
    setMinTvl,
    setStablecoinOnly,
    setSort,
    resetFilters,
  } = useFilterStore();

  const hasActiveFilters = chains.length > 0 || poolType || minTvl > 0 || stablecoinOnly;

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-secondary">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-text-secondary hover:text-danger">
            <X className="h-3.5 w-3.5" />
            Clear all
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
        {/* Chain Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Chain</label>
          <div className="flex flex-wrap gap-1.5">
            {SUPPORTED_CHAINS.map((chain) => (
              <button
                key={chain.id}
                onClick={() => toggleChain(chain.id as Chain)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border',
                  chains.includes(chain.id as Chain)
                    ? 'bg-accent/10 text-accent border-accent/30'
                    : 'bg-surface/50 text-text-secondary border-surface-border hover:border-accent/30 hover:text-text-primary'
                )}
              >
                {chain.name}
              </button>
            ))}
          </div>
        </div>

        {/* Pool Type Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Type</label>
          <div className="flex flex-wrap gap-1.5">
            {POOL_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setPoolType(poolType === type ? null : type as PoolType)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border',
                  poolType === type
                    ? 'bg-accent/10 text-accent border-accent/30'
                    : 'bg-surface/50 text-text-secondary border-surface-border hover:border-accent/30 hover:text-text-primary'
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Min TVL */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Min TVL</label>
          <div className="relative">
            <select
              value={minTvl}
              onChange={(e) => setMinTvl(Number(e.target.value))}
              className="appearance-none px-3 py-1.5 pr-8 rounded-lg text-xs bg-surface/50 text-text-primary border border-surface-border hover:border-accent/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all cursor-pointer"
            >
              {MIN_TVL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted pointer-events-none" />
          </div>
        </div>

        {/* Stablecoin Only */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Options</label>
          <button
            onClick={() => setStablecoinOnly(!stablecoinOnly)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border',
              stablecoinOnly
                ? 'bg-accent/10 text-accent border-accent/30'
                : 'bg-surface/50 text-text-secondary border-surface-border hover:border-accent/30 hover:text-text-primary'
            )}
          >
            Stablecoin Only
          </button>
        </div>

        {/* Sort */}
        <div className="space-y-2 ml-auto">
          <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Sort by</label>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none px-3 py-1.5 pr-8 rounded-lg text-xs bg-surface/50 text-text-primary border border-surface-border hover:border-accent/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all cursor-pointer"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
