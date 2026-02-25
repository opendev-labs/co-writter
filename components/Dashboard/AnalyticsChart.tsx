
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const salesDataDefault = [ 
  { name: 'Jan', sales: 12000 }, { name: 'Feb', sales: 19000 },
  { name: 'Mar', sales: 15000 }, { name: 'Apr', sales: 22000 },
  { name: 'May', sales: 28000 }, { name: 'Jun', sales: 24000 },
  { name: 'Jul', sales: 32000 }, { name: 'Aug', sales: 38000 },
];

interface AnalyticsChartProps {
    title?: string;
    data?: { name: string; sales: number }[]; 
    className?: string;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ title = "Revenue Trend", data = salesDataDefault, className = "" }) => {
  return (
    <div className={`flex flex-col h-full w-full ${className}`}>
      <div className="flex justify-between items-center mb-6 px-2 shrink-0">
          <h3 className="text-lg font-medium text-white">{title}</h3>
      </div>

      <div className="flex-1 w-full min-h-0 relative">
        <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#81c995" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#81c995" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                    dataKey="name" 
                    stroke="#666" 
                    tick={{ fill: '#999', fontSize: 11 }} 
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                />
                <YAxis 
                    stroke="#666" 
                    tick={{ fill: '#999', fontSize: 11 }}
                    tickFormatter={(value) => `₹${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`} 
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip
                    cursor={{ stroke: '#81c995', strokeWidth: 1, strokeDasharray: '4 4' }} 
                    contentStyle={{ 
                        backgroundColor: '#1e1e1e', 
                        border: '1px solid #333', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                    }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                    labelStyle={{ color: '#888', fontSize: '10px', marginBottom: '4px' }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#81c995" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;
