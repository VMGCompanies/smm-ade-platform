import React, { useEffect, useRef, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: number | string;
  format?: 'currency' | 'number' | 'text';
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: { value: number; label: string; positive?: boolean };
  subtitle?: string;
  accent?: string;
  delay?: number;
}

function animateValue(start: number, end: number, duration: number, callback: (val: number) => void) {
  const startTime = performance.now();
  function update(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    callback(Math.round(start + (end - start) * eased));
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function formatValue(val: number, format: string): string {
  if (format === 'currency') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  }
  if (format === 'number') {
    return new Intl.NumberFormat('en-US').format(val);
  }
  return String(val);
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  format = 'currency',
  icon: Icon,
  iconColor = 'text-accent-blue',
  iconBg = 'bg-accent-blue-light',
  trend,
  subtitle,
  accent,
  delay = 0,
}) => {
  const numericValue = typeof value === 'number' ? value : 0;
  const [displayValue, setDisplayValue] = useState(0);
  const animated = useRef(false);

  useEffect(() => {
    if (animated.current) return;
    animated.current = true;
    const timer = setTimeout(() => {
      animateValue(0, numericValue, 800, setDisplayValue);
    }, delay);
    return () => clearTimeout(timer);
  }, [numericValue, delay]);

  return (
    <div className="bg-bg-card rounded-xl border border-border-base p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-text-secondary font-sans">{title}</span>
        {Icon && (
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
            <Icon size={16} className={iconColor} />
          </span>
        )}
      </div>
      <div>
        <span className={`text-2xl font-bold font-mono tracking-tight text-text-primary`}>
          {typeof value === 'string' ? value : formatValue(displayValue, format)}
        </span>
        {subtitle && (
          <p className="text-xs text-text-muted mt-1 font-sans">{subtitle}</p>
        )}
      </div>
      {trend && (
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-medium ${trend.positive !== false ? 'text-accent-green' : 'text-accent-red'}`}>
            {trend.positive !== false ? '↑' : '↓'} {trend.value}%
          </span>
          <span className="text-xs text-text-muted">{trend.label}</span>
        </div>
      )}
      {accent && (
        <p className="text-xs text-text-muted border-t border-border-base pt-2 mt-1">{accent}</p>
      )}
    </div>
  );
};

export default KpiCard;
