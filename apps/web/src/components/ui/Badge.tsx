import { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-accent-border bg-accent-muted text-accent',
        secondary: 'border-surface-border bg-surface text-text-secondary',
        success: 'border-success/30 bg-success-muted text-success',
        warning: 'border-warning/30 bg-warning-muted text-warning',
        danger: 'border-danger/30 bg-danger-muted text-danger',
        outline: 'border-surface-border bg-transparent text-text-secondary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
