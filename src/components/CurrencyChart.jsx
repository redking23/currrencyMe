import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function CurrencyChart({ data, from, to }) {
    if (!data || data.length === 0) {
       return (
         <div className="text-center text-gray-400 text-sm py-10 bg-gray-900/40 rounded-xl border border-white/5 mx-2">
            No chart data available for this pair.
         </div>
       )
    }

  return (
    <div className='w-full h-[200px] mt-6 relative'>
        <h3 className="text-white text-sm font-semibold mb-3 ml-2 flex items-center gap-2">
            <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs">7 Day Trend</span> 
            {from} to {to}
        </h3>
        
        <div className="bg-gray-900/40 rounded-xl border border-white/5 p-2 h-full backdrop-blur-sm">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                data={data}
                margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                }}
                >
                <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9ca3af', fontSize: 10}} 
                />
                <YAxis 
                    domain={['auto', 'auto']} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9ca3af', fontSize: 10}} 
                    tickFormatter={(value) => value.toFixed(2)}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#9ca3af', marginBottom: '0.25rem' }}
                    formatter={(value) => [value, 'Rate']}
                />
                <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fill="url(#colorRate)" 
                    animationDuration={1500}
                />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}

export default CurrencyChart;
