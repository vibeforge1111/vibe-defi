import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RiskBadge, ILRiskBadge } from '@/components/farms/RiskBadge';
import { ChainBadge } from '@/components/farms/ChainBadge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useFarm } from '@/hooks/useFarms';
import { formatTVL, formatAPY } from '@/types/farm';
import { shortenAddress } from '@/lib/utils';

export function FarmDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useFarm(id || '');
  const [copied, setCopied] = useState(false);

  const farm = data?.data;

  const copyAddress = () => {
    if (farm?.poolAddress) {
      navigator.clipboard.writeText(farm.poolAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !farm) {
    return (
      <div className="text-center py-12">
        <p className="text-danger">
          {error ? `Error: ${error.message}` : 'Farm not found'}
        </p>
        <Link to="/">
          <Button variant="secondary" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-primary">
                {farm.tokens.join('-')}
              </h1>
              <ChainBadge chain={farm.chain} showName />
            </div>
            <p className="text-text-secondary">{farm.protocol}</p>
          </div>
        </div>
        <a href={farm.farmUrl} target="_blank" rel="noopener noreferrer">
          <Button className="gap-2">
            Farm Now
            <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-text-secondary">Total APY</p>
            <p className="text-3xl font-bold text-text-primary mt-1">
              {formatAPY(farm.totalAPY)}
            </p>
            <div className="flex gap-2 mt-2 text-sm text-text-secondary">
              <span>Base: {formatAPY(farm.baseAPY)}</span>
              <span>+</span>
              <span>Rewards: {formatAPY(farm.rewardAPY)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-text-secondary">Total Value Locked</p>
            <p className="text-3xl font-bold text-text-primary mt-1">
              {formatTVL(farm.tvl)}
            </p>
            {farm.tvlChange24h !== 0 && (
              <p className={`text-sm mt-2 ${farm.tvlChange24h > 0 ? 'text-success' : 'text-danger'}`}>
                {farm.tvlChange24h > 0 ? '+' : ''}{farm.tvlChange24h.toFixed(2)}% 24h
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-text-secondary">Risk Score</p>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-3xl font-bold text-text-primary">{farm.riskScore}</p>
              <RiskBadge score={farm.riskScore} />
            </div>
            <div className="mt-2">
              <ILRiskBadge risk={farm.ilRisk} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Breakdown */}
      {farm.riskFactors && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(farm.riskFactors).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-text-primary">{value}/100</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      value <= 30 ? 'bg-success' : value <= 60 ? 'bg-warning' : 'bg-danger'
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Warnings */}
      {farm.warnings && farm.warnings.length > 0 && (
        <Card className="border-warning/30">
          <CardHeader>
            <CardTitle className="text-warning">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {farm.warnings.map((warning, i) => (
                <li key={i} className="flex items-center gap-2 text-text-secondary">
                  <span className="text-warning">⚠️</span>
                  {warning}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Pool Details */}
      <Card>
        <CardHeader>
          <CardTitle>Pool Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-text-secondary">Contract Address</dt>
              <dd className="flex items-center gap-2 mt-1">
                <code className="text-text-primary font-mono">
                  {shortenAddress(farm.poolAddress, 8)}
                </code>
                <Button variant="ghost" size="sm" onClick={copyAddress}>
                  {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </Button>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-text-secondary">Protocol</dt>
              <dd className="text-text-primary mt-1">{farm.protocol}</dd>
            </div>
            <div>
              <dt className="text-sm text-text-secondary">Chain</dt>
              <dd className="mt-1">
                <ChainBadge chain={farm.chain} showName />
              </dd>
            </div>
            <div>
              <dt className="text-sm text-text-secondary">Pool Type</dt>
              <dd className="mt-1">
                <Badge variant="secondary">{farm.poolType}</Badge>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
