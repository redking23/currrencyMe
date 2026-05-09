import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClockRotateLeft, FaHourglassHalf, FaArrowTrendUp, FaArrowTrendDown, FaBolt } from "react-icons/fa6";
import usePastRate from '../hooks/usePastRate';
import useCurrency from '../hooks/useCurrency';

const TimeMachine = () => {
    const [amount, setAmount] = useState(1000);
    const [date, setDate] = useState(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 5);
        return d.toISOString().split('T')[0];
    });
    const [fromCurrency, setFromCurrency] = useState('TRY');
    const [toCurrency, setToCurrency] = useState('USD');
    const [isCalculating, setIsCalculating] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const { data: pastRate, refetch: fetchPastRate, isFetching: isPastLoading } = usePastRate(date, fromCurrency, toCurrency);
    const { data: currentRates, isLoading: isCurrentLoading } = useCurrency(fromCurrency);

    const [btcCurrentPrice, setBtcCurrentPrice] = useState(null);

    const handleCalculate = async () => {
        setIsCalculating(true);
        setShowResult(false);
        
        if (toCurrency === 'BTC' || fromCurrency === 'BTC') {
            try {
                // Fetch current BTC price for real-time comparison
                const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,try,gbp`);
                const data = await res.json();
                setBtcCurrentPrice(data.bitcoin);
            } catch (e) {
                console.error("BTC price fetch error", e);
            }
        }

        await fetchPastRate();
        setIsCalculating(false);
        setShowResult(true);
    };

    const calculation = useMemo(() => {
        if (!pastRate || !showResult) return null;

        let currentRateInBase;

        // BTC calculation requires converting from USDT back to the user's base currency
        if (toCurrency === 'BTC') {
            const btcPriceInUSD = btcCurrentPrice?.usd || 0;
            const fromToUSDRate = currentRates?.['USD'] || 1;
            const oneUSDInFrom = 1 / fromToUSDRate;
            currentRateInBase = btcPriceInUSD * oneUSDInFrom;
        } else if (fromCurrency === 'BTC') {
            const btcPriceInUSD = btcCurrentPrice?.usd || 0;
            const toToUSDRate = currentRates?.['USD'] || 1;
            const oneUSDInTo = 1 / toToUSDRate;
            const btcPriceInTo = btcPriceInUSD * oneUSDInTo;
            currentRateInBase = 1 / btcPriceInTo;
        } else {
            // Standard inverse rate calculation for fiat
            currentRateInBase = 1 / (currentRates?.[toCurrency] || 1);
        }

        if (!currentRateInBase) return null;

        const amountInTargetCurrency = amount / pastRate;
        const currentValueInBaseCurrency = amountInTargetCurrency * currentRateInBase;
        const profit = currentValueInBaseCurrency - amount;
        const profitPercentage = (profit / amount) * 100;

        return {
            pastValue: amountInTargetCurrency.toLocaleString(undefined, { maximumFractionDigits: toCurrency === 'BTC' ? 8 : 2 }),
            currentValue: currentValueInBaseCurrency.toLocaleString(undefined, { maximumFractionDigits: 2 }),
            profit: profit.toLocaleString(undefined, { maximumFractionDigits: 2 }),
            profitPercentage: profitPercentage.toFixed(1),
            isProfit: profit > 0
        };
    }, [amount, pastRate, currentRates, toCurrency, fromCurrency, btcCurrentPrice, showResult]);

    const commonCurrencies = ['USD', 'EUR', 'TRY', 'GBP', 'BTC'];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto relative"
        >
            <div className='absolute -inset-1 bg-gradient-to-r from-orange-600 via-yellow-500 to-red-600 rounded-2xl blur-lg opacity-20'></div>
            
            <div className='relative bg-gray-900/40 backdrop-blur-2xl p-8 rounded-2xl shadow-2xl border border-white/10 text-white overflow-hidden'>
                <div className='flex items-center gap-3 mb-8'>
                    <h2 className='text-2xl font-black tracking-tighter uppercase italic'>What If?</h2>
                </div>

                <div className='flex flex-col gap-5'>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Past Date</label>
                        <input 
                            type="date" 
                            value={date}
                            onChange={(e) => { setDate(e.target.value); setShowResult(false); }}
                            max={new Date().toISOString().split('T')[0]}
                            className="bg-white/5 p-4 rounded-2xl border border-white/5 focus:border-orange-500/50 outline-none transition-all text-white font-mono"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Amount</label>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => { setAmount(Number(e.target.value)); setShowResult(false); }}
                                className="bg-white/5 p-4 rounded-2xl border border-white/5 focus:border-orange-500/50 outline-none transition-all text-xl font-bold"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Currency</label>
                            <select 
                                value={fromCurrency}
                                onChange={(e) => { setFromCurrency(e.target.value); setShowResult(false); }}
                                className="bg-white/5 p-4 rounded-2xl border border-white/5 focus:border-orange-500/50 outline-none transition-all text-xl font-bold appearance-none"
                            >
                                {commonCurrencies.map(c => <option key={c} value={c} className="bg-gray-800">{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">What if you bought...</label>
                        <select 
                            value={toCurrency}
                            onChange={(e) => { setToCurrency(e.target.value); setShowResult(false); }}
                            className="bg-white/5 p-4 rounded-2xl border border-white/5 focus:border-orange-500/50 outline-none transition-all text-xl font-bold appearance-none cursor-pointer"
                        >
                            {commonCurrencies.map(c => <option key={c} value={c} className="bg-gray-800">{c}</option>)}
                        </select>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(234, 88, 12, 0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCalculate}
                        disabled={isCalculating || isPastLoading}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 p-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all mt-2"
                    >
                        {isCalculating || isPastLoading ? (
                            <FaHourglassHalf className="animate-spin" />
                        ) : null}
                        {isCalculating || isPastLoading ? 'Traveling...' : 'Travel Through Time'}
                    </motion.button>

                    <div className="mt-2 min-h-[160px]">
                        <AnimatePresence mode="wait">
                            {showResult && calculation ? (
                                <motion.div 
                                    key="result"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-white/10 shadow-inner"
                                >
                                    <div className="flex flex-col gap-5">
                                         <div className="text-center border-b border-white/10 pb-4">
                                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">History Summary</p>
                                             <p className="text-sm text-gray-300 leading-relaxed">
                                                 In {new Date(date).getFullYear()}, with <span className="text-white font-bold">{amount.toLocaleString()} {fromCurrency}</span>, <br/>
                                                 you could have bought:
                                             </p>
                                             <h3 className="text-3xl font-black text-orange-400 mt-2">{calculation.pastValue} {toCurrency}</h3>
                                         </div>
                                         
                                         <div className="space-y-4">
                                             <div className="flex justify-between items-end">
                                                 <div>
                                                     <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">TODAY'S VALUE</p>
                                                     <p className="text-2xl font-black text-white">{calculation.currentValue} {fromCurrency}</p>
                                                 </div>
                                                 <div className="text-right">
                                                     <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">PERFORMANCE</p>
                                                     <p className={`text-xl font-bold flex items-center justify-end gap-1 ${calculation.isProfit ? 'text-green-400' : 'text-red-400'}`}>
                                                         {calculation.isProfit ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
                                                         %{Math.abs(calculation.profitPercentage)}
                                                     </p>
                                                 </div>
                                             </div>
                                             
                                             <div className={`p-4 rounded-xl text-center text-xs font-bold leading-relaxed ${calculation.isProfit ? 'bg-green-500/20 text-green-300 border border-green-500/20' : 'bg-red-500/20 text-red-300 border border-red-500/20'}`}>
                                                 {calculation.isProfit 
                                                     ? `🔥 Amazing! If you had held, you'd have gained ${calculation.profit} ${fromCurrency} more today.`
                                                     : `📉 Ouch! You avoided a loss of ${Math.abs(calculation.profit)} ${fromCurrency} by not holding.`
                                                 }
                                             </div>
                                         </div>
                                    </div>
                                </motion.div>
                            ) : !showResult && !isCalculating && !isPastLoading && (
                                <div className="h-40 flex flex-col items-center justify-center text-center p-6 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                    <FaClockRotateLeft className="text-2xl text-gray-600 mb-2" />
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                                        Enter details and click the button <br/> to see your opportunity cost
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TimeMachine;
