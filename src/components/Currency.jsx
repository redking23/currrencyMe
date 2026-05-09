import React, { useState, useEffect, useMemo } from 'react'
import { FaRegCopy, FaCheck, FaStar, FaRegStar } from "react-icons/fa6";
import { IoSwapVerticalSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import useCurrency from '../hooks/useCurrency';
import useHistoricalData from '../hooks/useHistoricalData';
import useCurrencyStore from '../store/useCurrencyStore';
import useDebounce from '../hooks/useDebounce';
import CurrencyChart from './CurrencyChart';

const Currency = () => {
    const { favorites, toggleFavorite, lastFromCurrency, lastToCurrency, setLastCurrencies } = useCurrencyStore();
    
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState(lastFromCurrency || 'USD');
    const [toCurrency, setToCurrency] = useState(lastToCurrency || 'TRY');
    const [copied, setCopied] = useState(false);

    const debouncedAmount = useDebounce(amount, 300);

    const { data: currencyData, isLoading: isRatesLoading, isError } = useCurrency(fromCurrency);
    const { data: historicalData, isLoading: isHistoryLoading } = useHistoricalData(fromCurrency, toCurrency);

    const options = useMemo(() => Object.keys(currencyData || {}), [currencyData]);

    const result = useMemo(() => {
        if (!currencyData || !currencyData[toCurrency]) return 0;
        return (debouncedAmount * currencyData[toCurrency]).toFixed(2);
    }, [debouncedAmount, toCurrency, currencyData]);

    useEffect(() => {
        setLastCurrencies(fromCurrency, toCurrency);
    }, [fromCurrency, toCurrency, setLastCurrencies]);

    const swap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const isFavorite = favorites.includes(`${fromCurrency}-${toCurrency}`);

    if (isError) {
        return (
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='bg-red-500/80 backdrop-blur-sm text-white p-6 rounded-2xl text-center shadow-lg border border-red-400/30'
             >
                <h2 className="text-xl font-bold mb-2">Connection Error</h2>
                <p className="text-sm opacity-90">Could not fetch exchange rates. Please check your internet or API key.</p>
             </motion.div>
        )
    }

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className='w-full max-w-md mx-auto relative'
        >
            <div className='absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-25'></div>
            
            <div className='relative bg-gray-900/40 backdrop-blur-2xl p-8 rounded-2xl shadow-2xl border border-white/10 text-white overflow-hidden'>
                <div className='flex justify-between items-center mb-8'>
                    <motion.h1 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className='text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tighter'
                    > 
                        QUICK CURRENCY
                    </motion.h1>
                    <motion.button 
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleFavorite(fromCurrency, toCurrency)} 
                        className={`text-2xl transition-colors ${isFavorite ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`}
                    >
                        {isFavorite ? <FaStar /> : <FaRegStar />}
                    </motion.button>
                </div>
                
                <div className='flex flex-col gap-6'>
                    {/* From Input */}
                    <div className="flex flex-col gap-2">
                         <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Sell</label>
                         <div className='flex items-center gap-2 bg-white/5 p-4 rounded-2xl border border-white/5 focus-within:border-blue-500/50 focus-within:bg-white/10 transition-all'>
                            <input 
                                value={amount} 
                                onChange={(e)=>setAmount(e.target.value)} 
                                type="number" 
                                className='bg-transparent text-white text-2xl font-medium w-full outline-none' 
                                placeholder='0.00' 
                            />
                            <select 
                                value={fromCurrency}
                                onChange={(e)=>setFromCurrency(e.target.value)} 
                                className='bg-gray-800 text-blue-400 font-bold p-2 rounded-lg outline-none cursor-pointer hover:bg-gray-700 transition-colors'
                            >
                                {options.map((currency) => (
                                    <option key={currency} value={currency}>{currency}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Swap Button */}
                    <div className='relative flex justify-center -my-3 z-10'>
                         <motion.button 
                            whileHover={{ scale: 1.1, rotate: 180 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={swap}
                            className='bg-blue-600 text-white p-3 rounded-full shadow-xl border-4 border-gray-900 hover:bg-blue-500 transition-all duration-500'
                         >
                            <IoSwapVerticalSharp className='text-xl' /> 
                         </motion.button>
                    </div>

                    {/* To Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Buy</label>
                        <div className='flex items-center gap-2 bg-white/5 p-4 rounded-2xl border border-white/5 focus-within:border-purple-500/50 focus-within:bg-white/10 transition-all'>
                            <motion.div 
                                key={result}
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: 1 }}
                                className='text-white text-2xl font-bold w-full'
                            >
                                {isRatesLoading ? "..." : result}
                            </motion.div>
                            <select 
                                value={toCurrency}
                                onChange={(e) =>setToCurrency(e.target.value)}
                                className='bg-gray-800 text-purple-400 font-bold p-2 rounded-lg outline-none cursor-pointer hover:bg-gray-700 transition-colors'
                            >
                                {options.map((currency) => (
                                    <option key={currency} value={currency}>{currency}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Info Card */}
                    <motion.div 
                        layout
                        className='flex items-center justify-between text-xs text-gray-400 bg-white/5 p-4 rounded-xl border border-white/5'
                    >
                        <div>
                            Mid-market rate: <span className="text-blue-400 font-mono">1 {fromCurrency} = {currencyData?.[toCurrency]?.toFixed(4) || '...'} {toCurrency}</span>
                        </div>
                        <button 
                            onClick={copyToClipboard}
                            className='flex items-center gap-1 hover:text-white transition-colors'
                        >
                            {copied ? <FaCheck className="text-green-400" /> : <FaRegCopy />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                    </motion.div>
                    
                    {/* Chart Section */}
                    <AnimatePresence mode="wait">
                        {!isHistoryLoading && historicalData?.length > 0 ? (
                            <motion.div 
                                key="chart"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                            >
                                <CurrencyChart data={historicalData} from={fromCurrency} to={toCurrency} />
                            </motion.div>
                        ) : (
                            <div className="h-32 bg-white/5 rounded-xl animate-pulse"></div>
                        )}
                    </AnimatePresence>

                    {/* Favorites Section */}
                    {favorites.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Quick Pairs</h3>
                            <div className="flex flex-wrap gap-2">
                                <AnimatePresence>
                                    {favorites.map(fav => {
                                        const [f, t] = fav.split('-');
                                        return (
                                            <motion.button 
                                                key={fav}
                                                layout
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                onClick={() => { setFromCurrency(f); setToCurrency(t); }}
                                                className="bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full text-xs transition-all border border-white/5 hover:border-blue-500/30"
                                            >
                                                {f} → {t}
                                            </motion.button>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
  )
}

export default Currency
