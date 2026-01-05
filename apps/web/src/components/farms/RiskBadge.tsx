import { getRiskLevel } from '@/types/farm';
import type { ILRisk } from '@/types/farm';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  score: number;
  showLabel?: boolean;
}

export function RiskBadge({ score, showLabel = true }: RiskBadgeProps) {
  const level = getRiskLevel(score);

  const config = {
    low: {
      label: 'Low Risk',
      icon: ShieldCheck,
      className: 'bg-success-muted text-success border-success/20',
    },
    medium: {
      label: 'Medium',
      icon: Shield,
      className: 'bg-warning-muted text-warning border-warning/20',
    },
    high: {
      label: 'High Risk',
      icon: ShieldAlert,
      className: 'bg-danger-muted text-danger border-danger/20',
    },
  };

  const { label, icon: Icon, className } = config[level];

  return (
    <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border', className)}>
      <Icon className="h-3.5 w-3.5" />
      {showLabel ? label : score}
    </div>
  );
}

interface ILRiskBadgeProps {
  risk: ILRisk;
}

export function ILRiskBadge({ risk }: ILRiskBadgeProps) {
  const config: Record<ILRisk, { className: string }> = {
    None: { className: 'bg-success-muted text-success border-success/20' },
    Low: { className: 'bg-success-muted text-success border-success/20' },
    Medium: { className: 'bg-warning-muted text-warning border-warning/20' },
    High: { className: 'bg-danger-muted text-danger border-danger/20' },
  };

  return (
    <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border', config[risk].className)}>
      {risk} IL
    </div>
  );
}
