import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CurrencyChart = ({ data, from, to }) => {
    if (!data || data.length === 0) {
       return (
         <div className="text-center text-gray-400 text-sm py-10 bg-white/5 rounded-2xl border border-white/5">
            No trend data available.
         </div>
       )
    }

  return (
    <div className='w-full mt-6 relative'>
        <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-gray-500 text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                7-Day Market Trend
            </h3>
        </div>
        
        <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#4b5563', fontSize: 9, fontWeight: 600}} 
                        dy={10}
                    />
                    <YAxis 
                        domain={['auto', 'auto']} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#4b5563', fontSize: 9, fontWeight: 600}} 
                        tickFormatter={(value) => value.toFixed(2)}
                    />
                    <Tooltip 
                        cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                        contentStyle={{ 
                            backgroundColor: 'rgba(17, 24, 39, 0.8)', 
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.1)', 
                            borderRadius: '12px', 
                            padding: '8px 12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' 
                        }}
                        itemStyle={{ color: '#60a5fa', fontSize: '12px', fontWeight: 'bold' }}
                        labelStyle={{ color: '#9ca3af', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase' }}
                        formatter={(value) => [value.toFixed(4), 'Rate']}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="rate" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        fill="url(#chartGradient)" 
                        animationDuration={2000}
                        dot={{ r: 0 }}
                        activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}

export default CurrencyChart;
