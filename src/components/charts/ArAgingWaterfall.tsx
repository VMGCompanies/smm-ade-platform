import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { bucket: '0–30 Days', MAI: 287400, NATALIA: 412000 },
  { bucket: '31–60 Days', MAI: 94200, NATALIA: 156800 },
  { bucket: '61–90 Days', MAI: 41500, NATALIA: 89300 },
  { bucket: '90+ Days', MAI: 25400, NATALIA: 108200 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, p: any) => sum + p.value, 0);
    return (
      <div className="bg-bg-card border border-border-base rounded-xl p-3 shadow-lg">
        <p className="text-xs font-semibold text-text-primary mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.fill }} />
            <span className="text-text-secondary">{p.name}:</span>
            <span className="font-mono font-semibold text-text-primary">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p.value)}
            </span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-border-base text-xs flex justify-between">
          <span className="text-text-muted">Total</span>
          <span className="font-mono font-bold text-text-primary">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(total)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const ArAgingWaterfall: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
          tick={{ fontSize: 11, fill: '#9E9E96', fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="bucket"
          tick={{ fontSize: 12, fill: '#6B6B65', fontFamily: 'Inter' }}
          axisLine={false}
          tickLine={false}
          width={80}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F5F4F1' }} />
        <Legend
          wrapperStyle={{ fontSize: 12, fontFamily: 'Inter', paddingTop: 8 }}
          iconType="circle"
          iconSize={8}
        />
        <Bar dataKey="MAI" name="MAI" stackId="a" fill="#1A4480" radius={[0, 0, 0, 0]} />
        <Bar dataKey="NATALIA" name="NATALIA" stackId="a" fill="#2D6A4F" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ArAgingWaterfall;
