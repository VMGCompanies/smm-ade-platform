import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Oct', generated: 28, sent: 25, paid: 22 },
  { month: 'Nov', generated: 32, sent: 30, paid: 27 },
  { month: 'Dec', generated: 35, sent: 33, paid: 30 },
  { month: 'Jan', generated: 29, sent: 28, paid: 25 },
  { month: 'Feb', generated: 31, sent: 30, paid: 28 },
  { month: 'Mar', generated: 34, sent: 29, paid: 14 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-card border border-border-base rounded-xl p-3 shadow-lg">
        <p className="text-xs font-semibold text-text-primary mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2 text-xs mb-1">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.fill }} />
            <span className="text-text-secondary">{p.name}:</span>
            <span className="font-mono font-bold text-text-primary">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const BillingVelocity: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#9E9E96', fontFamily: 'Inter' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9E9E96', fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          width={30}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F5F4F1' }} />
        <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Inter' }} iconType="circle" iconSize={8} />
        <Bar dataKey="generated" name="Generated" fill="#E8EEFA" radius={[2, 2, 0, 0]} />
        <Bar dataKey="sent" name="Sent" fill="#0F52BA" radius={[2, 2, 0, 0]} />
        <Bar dataKey="paid" name="Paid" fill="#1A7A4A" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BillingVelocity;
