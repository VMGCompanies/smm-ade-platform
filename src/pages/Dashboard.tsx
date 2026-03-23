import React from 'react';
import { DollarSign, TrendingDown, TrendingUp, Clock, Zap, Calendar } from 'lucide-react';
import KpiCard from '../components/common/KpiCard';
import ArAgingWaterfall from '../components/charts/ArAgingWaterfall';
import CashFlowTrend from '../components/charts/CashFlowTrend';
import AdeActivityFeed from '../components/common/AdeActivityFeed';
import StatusPill from '../components/common/StatusPill';

const apUpcoming = [
  { vendor: 'AP Batch B-2026-12 (18 vendors)', amount: 67200, due: 'Mar 21', status: 'pending_approval' as const },
  { vendor: 'Allied Universal Security', amount: 12500, due: 'Mar 25', status: 'pending' as const },
  { vendor: 'Comfort Systems HVAC', amount: 5000, due: 'Mar 28', status: 'pending' as const },
  { vendor: 'Centrihouse Equipment', amount: 9300, due: 'Mar 31', status: 'pending' as const },
  { vendor: 'April Rent — 4 Properties', amount: 80500, due: 'Apr 1', status: 'pending' as const },
];

const priorityQueue = [
  { client: 'Truebeck Construction', amount: 72300, days: 50, agent: 'NATALIA', risk: 'retention' },
  { client: 'Capital Realty Group', amount: 39200, days: 50, agent: 'NATALIA', risk: 'normal' },
  { client: 'Surefire Supplies', amount: 9800, days: 67, agent: 'MAI', risk: 'escalated' },
  { client: 'SMP / UHA', amount: 15600, days: 51, agent: 'MAI', risk: 'normal' },
  { client: 'Aon Corp Real Estate', amount: 67200, days: 36, agent: 'NATALIA', risk: 'normal' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-display">Command Dashboard</h1>
          <p className="text-sm text-text-muted mt-0.5">SMM Facilities Accounting — ADE Platform · March 23, 2026</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-accent-green bg-accent-green-light px-3 py-1.5 rounded-full font-medium">
          <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse" />
          2 ADE Agents Active
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        <KpiCard
          title="Total AR Outstanding"
          value={1247340}
          format="currency"
          icon={DollarSign}
          iconColor="text-accent-blue"
          iconBg="bg-accent-blue-light"
          trend={{ value: 3.2, label: 'vs last month', positive: false }}
          delay={0}
        />
        <KpiCard
          title="Collected This Month"
          value={487200}
          format="currency"
          icon={TrendingUp}
          iconColor="text-accent-green"
          iconBg="bg-accent-green-light"
          trend={{ value: 8.4, label: 'vs last month', positive: true }}
          delay={100}
        />
        <KpiCard
          title="AP Due This Week"
          value={94500}
          format="currency"
          icon={TrendingDown}
          iconColor="text-accent-amber"
          iconBg="bg-accent-amber-light"
          subtitle="18 vendors · Batch B-2026-12"
          delay={200}
        />
        <KpiCard
          title="Aging 60+ Days"
          value={312100}
          format="currency"
          icon={Clock}
          iconColor="text-accent-red"
          iconBg="bg-accent-red-light"
          trend={{ value: 4.1, label: 'vs last month', positive: false }}
          delay={300}
        />
        <KpiCard
          title="ADE Actions Today"
          value="47 tasks"
          format="text"
          icon={Zap}
          iconColor="text-mai-accent"
          iconBg="bg-accent-blue-light"
          subtitle="MAI: 29 actions · NATALIA: 18 actions"
          delay={400}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-bg-card rounded-xl border border-border-base p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-text-primary font-display">AR Aging Waterfall</h2>
              <p className="text-xs text-text-muted mt-0.5">MAI vs NATALIA portfolio breakdown</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-text-secondary">
                <span className="w-2 h-2 rounded-full bg-mai-accent inline-block" /> MAI
              </span>
              <span className="flex items-center gap-1.5 text-text-secondary">
                <span className="w-2 h-2 rounded-full bg-natalia-accent inline-block" /> NATALIA
              </span>
            </div>
          </div>
          <ArAgingWaterfall />
        </div>

        <div className="bg-bg-card rounded-xl border border-border-base p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-text-primary font-display">Cash Collection Trend</h2>
              <p className="text-xs text-text-muted mt-0.5">12-month invoiced vs collected</p>
            </div>
          </div>
          <CashFlowTrend />
        </div>
      </div>

      {/* Activity + AP + Priority Row */}
      <div className="grid grid-cols-3 gap-5">
        {/* ADE Activity Feed */}
        <div className="col-span-1 bg-bg-card rounded-xl border border-border-base p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-text-primary font-display">ADE Activity Feed</h2>
            <span className="flex items-center gap-1.5 text-xs text-accent-green bg-accent-green-light px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse" />
              Live
            </span>
          </div>
          <AdeActivityFeed maxItems={8} compact />
        </div>

        {/* AP Upcoming */}
        <div className="bg-bg-card rounded-xl border border-border-base p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-text-primary font-display">AP Upcoming Obligations</h2>
            <Calendar size={16} className="text-text-muted" />
          </div>
          <div className="space-y-2">
            {apUpcoming.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-border-base last:border-0">
                <div className="flex-1 min-w-0 mr-2">
                  <p className="text-sm font-medium text-text-primary truncate">{item.vendor}</p>
                  <p className="text-xs text-text-muted">Due {item.due}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold text-text-primary">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.amount)}
                  </p>
                  <StatusPill status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collections Priority Queue */}
        <div className="bg-bg-card rounded-xl border border-border-base p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-text-primary font-display">Collections Priority Queue</h2>
            <span className="text-xs text-text-muted font-mono">Top 5</span>
          </div>
          <div className="space-y-2">
            {priorityQueue.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border-base last:border-0">
                <span className="w-5 h-5 rounded-full bg-bg-secondary text-text-muted text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-text-primary truncate">{item.client}</p>
                    {item.risk === 'retention' && <span className="text-xs bg-accent-amber-light text-accent-amber px-1.5 py-0.5 rounded font-medium">RETENTION</span>}
                    {item.risk === 'escalated' && <span className="text-xs bg-accent-red-light text-accent-red px-1.5 py-0.5 rounded font-medium">ESCALATED</span>}
                  </div>
                  <p className="text-xs text-text-muted">{item.days} days · {item.agent}</p>
                </div>
                <span className="text-sm font-mono font-bold text-text-primary flex-shrink-0">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADE ROI Estimator */}
      <div className="bg-gradient-to-r from-mai-accent to-natalia-accent rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold font-display">ADE ROI Estimator</h2>
            <p className="text-sm text-white/70 mt-0.5">Estimated value delivered by MAI + NATALIA this month</p>
          </div>
          <Zap size={24} className="text-white/50" />
        </div>
        <div className="grid grid-cols-4 gap-6 mt-5">
          <div>
            <p className="text-xs text-white/60 mb-1">Hours Automated</p>
            <p className="text-2xl font-bold font-mono">142 hrs</p>
            <p className="text-xs text-white/60 mt-0.5">vs 6.5 FTE-days</p>
          </div>
          <div>
            <p className="text-xs text-white/60 mb-1">Collections Accelerated</p>
            <p className="text-2xl font-bold font-mono">$94,200</p>
            <p className="text-xs text-white/60 mt-0.5">avg 8.3 days faster</p>
          </div>
          <div>
            <p className="text-xs text-white/60 mb-1">AP Errors Prevented</p>
            <p className="text-2xl font-bold font-mono">$2,100</p>
            <p className="text-xs text-white/60 mt-0.5">4 duplicate detections</p>
          </div>
          <div>
            <p className="text-xs text-white/60 mb-1">Est. Monthly Value</p>
            <p className="text-2xl font-bold font-mono text-yellow-300">$48,400</p>
            <p className="text-xs text-white/60 mt-0.5">vs $2,200 platform cost</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
