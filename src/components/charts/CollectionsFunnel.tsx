import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { stage: 'Total AR', amount: 1247340 },
  { stage: 'Identified', amount: 498500 },
  { stage: 'Active', amount: 312100 },
  { stage: 'Contacted', amount: 198400 },
  { stage: 'In Negotiation', amount: 94200 },
  { stage: 'Recovered', amount: 94200 },
];

const colors = ['#0F52BA', '#1A4480', '#B45309', '#C0392B', '#2D6A4F', '#1A7A4A'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-card border border-border-base rounded-xl p-3 shadow-lg">
        <p className="text-xs font-semibold text-text-primary">{label}</p>
        <p className="text-sm font-mono font-bold text-text-primary mt-1">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const CollectionsFunnel: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" vertical={false} />
        <XAxis
          dataKey="stage"
          tick={{ fontSize: 10, fill: '#9E9E96', fontFamily: 'Inter' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
          tick={{ fontSize: 10, fill: '#9E9E96', fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          width={50}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F5F4F1' }} />
        <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CollectionsFunnel;
