import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { SummaryCards } from '@/components/farms/SummaryCards';
import { FarmFilters } from '@/components/farms/FarmFilters';
import { FarmTable } from '@/components/farms/FarmTable';
import { Button } from '@/components/ui/Button';
import { useFarms } from '@/hooks/useFarms';
import { useFilterStore } from '@/store/filterStore';
import { ChevronLeft, ChevronRight, Sparkles, Shield, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const { data, isLoading, error } = useFarms();
  const { sort, setSort, page, setPage } = useFilterStore();

  // Calculate summary stats
  const summary = useMemo(() => {
    if (!data?.data) {
      return { totalPools: 0, totalTvl: 0, avgApy: 0, protocolCount: 0 };
    }

    const farms = data.data;
    const totalTvl = farms.reduce((sum, f) => sum + f.tvl, 0);
    const avgApy = farms.length > 0 ? farms.reduce((sum, f) => sum + f.totalAPY, 0) / farms.length : 0;
    const protocols = new Set(farms.map((f) => f.protocol));

    return {
      totalPools: data.meta?.total || farms.length,
      totalTvl,
      avgApy,
      protocolCount: protocols.size,
    };
  }, [data]);

  const handleSort = (column: string) => {
    const currentSort = sort.replace('-', '');
    const isDesc = sort.startsWith('-');

    if (currentSort === column) {
      // Toggle direction
      setSort(isDesc ? column : `-${column}`);
    } else {
      // Default to descending for new column
      setSort(`-${column}`);
    }
  };

  const totalPages = data?.meta?.totalPages || 1;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger">Error loading farms: {error.message}</p>
        <Button variant="secondary" className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative py-12 -mt-6 -mx-4 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Cross-chain DeFi Analytics
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-text-primary mb-4 leading-tight">
            Find the best <span className="text-accent italic">yield farms</span>
            <br />
            across all chains.
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            Analyze APY, TVL, and risk scores across 90+ protocols on Ethereum, Arbitrum, Base, BNB Chain, and Solana.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-text-secondary">
              <div className="p-1.5 rounded-md bg-accent/10 text-accent">
                <TrendingUp className="h-4 w-4" />
              </div>
              Real-time APY tracking
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <div className="p-1.5 rounded-md bg-accent/10 text-accent">
                <Shield className="h-4 w-4" />
              </div>
              Risk assessment engine
            </div>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <SummaryCards
        totalPools={summary.totalPools}
        totalTvl={summary.totalTvl}
        avgApy={summary.avgApy}
        protocolCount={summary.protocolCount}
        isLoading={isLoading}
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <FarmFilters />
        </CardContent>
      </Card>

      {/* Farm Table */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="font-sans text-lg font-semibold">Yield Farming Opportunities</CardTitle>
            <div className="text-sm text-text-secondary">
              {data?.meta?.total || 0} pools found
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <FarmTable
            farms={data?.data || []}
            isLoading={isLoading}
            sortColumn={sort}
            onSort={handleSort}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-surface-border">
              <div className="text-sm text-text-secondary">
                Page {page} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
