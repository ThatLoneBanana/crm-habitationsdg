import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  variant?: 'default' | 'warning' | 'danger';
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  variant = 'default',
}: MetricCardProps) {
  const variantClasses = {
    default: 'bg-blue-50 text-blue-700 border-blue-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
  };

  const iconBg = {
    default: 'bg-blue-100',
    warning: 'bg-amber-100',
    danger: 'bg-red-100',
  };

  return (
    <div
      className={cn(
        'border rounded-lg p-6 flex items-start justify-between',
        variantClasses[variant]
      )}
    >
      <div>
        <p className="text-sm font-medium opacity-75">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      {Icon && (
        <div className={cn('p-3 rounded-lg', iconBg[variant])}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
