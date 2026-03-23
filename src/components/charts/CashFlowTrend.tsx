import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
  { month: 'Apr \'25', invoiced: 890000, collected: 820000 },
  { month: 'May \'25', invoiced: 920000, collected: 875000 },
  { month: 'Jun \'25', invoiced: 1040000, collected: 960000 },
  { month: 'Jul \'25', invoiced: 980000, collected: 910000 },
  { month: 'Aug \'25', invoiced: 1100000, collected: 1020000 },
  { month: 'Sep \'25', invoiced: 1150000, collected: 1080000 },
  { month: 'Oct \'25', invoiced: 1080000, collected: 990000 },
  { month: 'Nov \'25', invoiced: 1200000, collected: 1120000 },
  { month: 'Dec \'25', invoiced: 1350000, collected: 1280000 },
  { month: 'Jan \'26', invoiced: 1180000, collected: 1090000 },
  { month: 'Feb \'26', invoiced: 1220000, collected: 1140000 },
  { month: 'Mar \'26', invoiced: 1247340, collected: 487200 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-card border border-border-base rounded-xl p-3 shadow-lg">
        <p className="text-xs font-semibold text-text-primary mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2 text-xs mb-1">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.stroke }} />
            <span className="text-text-secondary">{p.name}:</span>
            <span className="font-mono font-semibold text-text-primary">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CashFlowTrend: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <defs>
          <linearGradient id="invoicedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0F52BA" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#0F52BA" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="collectedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1A7A4A" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#1A7A4A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#9E9E96', fontFamily: 'Inter' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
          tick={{ fontSize: 11, fill: '#9E9E96', fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, fontFamily: 'Inter', paddingTop: 8 }}
          iconType="circle"
          iconSize={8}
        />
        <Area
          type="monotone"
          dataKey="invoiced"
          name="Invoiced"
          stroke="#0F52BA"
          strokeWidth={2}
          fill="url(#invoicedGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#0F52BA' }}
        />
        <Area
          type="monotone"
          dataKey="collected"
          name="Collected"
          stroke="#1A7A4A"
          strokeWidth={2}
          fill="url(#collectedGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#1A7A4A' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CashFlowTrend;
