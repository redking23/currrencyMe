import React, { useState, useEffect } from 'react'
import { FaArrowRight, FaRegCopy, FaCheck, FaStar, FaRegStar } from "react-icons/fa6";
import { IoSwapVerticalSharp } from "react-icons/io5";
import useCurrency from '../hooks/useCurrency';
import useHistoricalData from '../hooks/useHistoricalData';
import CurrencyChart from './CurrencyChart';

function Currency() {
    const [amount, setAmount] = useState(0)
    const [fromCurrency, setFromCurrency] = useState('USD')
    const [toCurrency, setToCurrency] = useState('TRY')
    const [result, setResult] = useState(0)
    const [copied, setCopied] = useState(false);
    const [favorites, setFavorites] = useState([]);

    // Using the custom hook
    const { data: currencyData, loading, error } = useCurrency(fromCurrency);
    // Historical Data Hook
    const { data: historicalData, loading: historyLoading } = useHistoricalData(fromCurrency, toCurrency);

    // Dynamic options
    const options = Object.keys(currencyData || {});

    // Load favorites from local storage
    useEffect(() => {
        const savedFavs = JSON.parse(localStorage.getItem('currencyFavorites')) || [];
        setFavorites(savedFavs);
    }, []);

    // Instant conversion effect
    useEffect(() => {
        if (options.length > 0 && amount >= 0) {
            const rate = currencyData[toCurrency];
            if (rate) {
                setResult((amount * rate).toFixed(2));
            }
        }
    }, [amount, fromCurrency, toCurrency, currencyData, options]);

    const swap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const toggleFavorite = () => {
        const currentPair = `${fromCurrency}-${toCurrency}`;
        let newFavs;
        if (favorites.includes(currentPair)) {
            newFavs = favorites.filter(f => f !== currentPair);
        } else {
            newFavs = [...favorites, currentPair];
        }
        setFavorites(newFavs);
        localStorage.setItem('currencyFavorites', JSON.stringify(newFavs));
    }

    const loadFavorite = (pair) => {
        const [from, to] = pair.split('-');
        setFromCurrency(from);
        setToCurrency(to);
    }

    const isFavorite = favorites.includes(`${fromCurrency}-${toCurrency}`);

    if (error) {
        return (
             <div className='bg-red-500/80 backdrop-blur-sm text-white p-4 rounded-xl text-center shadow-lg border border-red-400/30'>
                Error fetching data. Check your connection or API key.
             </div>
        )
    }

    return (
        <div className='w-full max-w-md mx-auto relative'>
            <div className='absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 animate-pulse'></div>
            
            <div className='relative bg-gray-900/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10 text-white'>
                <div className='flex justify-between items-center mb-8'>
                    <div className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight'> 
                        Currency
                    </div>
                    <button onClick={toggleFavorite} className='text-2xl text-yellow-400 hover:scale-110 transition-transform'>
                        {isFavorite ? <FaStar /> : <FaRegStar />}
                    </button>
                </div>
                
                {loading ? (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className='flex flex-col gap-6'>
                        <div className="flex flex-col gap-2">
                             <label className="text-xs text-gray-400 ml-1">From</label>
                             <div className='flex items-center gap-2 bg-gray-800/50 p-2 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-colors'>
                                <input 
                                    value={amount} 
                                    onChange={(e)=>{setAmount(e.target.value)}} 
                                    type="number" 
                                    className='bg-transparent text-white text-lg p-2 w-full outline-none font-medium' 
                                    placeholder='0' 
                                />
                                <div className="h-6 w-[1px] bg-gray-600 mx-2"></div>
                                <select 
                                    value={fromCurrency}
                                    onChange={(e)=>{setFromCurrency(e.target.value)}} 
                                    className='bg-transparent text-blue-400 font-bold p-2 outline-none cursor-pointer hover:text-blue-300 transition-colors'
                                >
                                    {options.length > 0 ? options.map((currency) => (
                                        <option key={currency} value={currency} className="bg-gray-800 text-white">{currency}</option>
                                    )) : <option className="bg-gray-800">{fromCurrency}</option>}
                                </select>
                            </div>
                        </div>

                        <div className='relative flex justify-center h-4'>
                             <button 
                                onClick={swap}
                                className='absolute -top-1 bg-blue-600 text-white p-3 rounded-full shadow-lg border-4 border-gray-900 hover:bg-blue-500 hover:scale-110 hover:rotate-180 transition-all duration-300 ease-out z-10'
                                title="Swap Currencies"
                             >
                                <IoSwapVerticalSharp className='text-lg transform' /> 
                             </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-gray-400 ml-1">To</label>
                            <div className='flex items-center gap-2 bg-gray-800/50 p-2 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-colors'>
                                <input 
                                    value={result} 
                                    readOnly
                                    type="text" 
                                    className='bg-transparent text-white text-lg p-2 w-full outline-none font-bold' 
                                />
                                <div className="h-6 w-[1px] bg-gray-600 mx-2"></div>
                                <select 
                                    value={toCurrency}
                                    onChange={(e) =>{setToCurrency(e.target.value)}}
                                    className='bg-transparent text-purple-400 font-bold p-2 outline-none cursor-pointer hover:text-purple-300 transition-colors'
                                >
                                    {options.length > 0 ? options.map((currency) => (
                                        <option key={currency} value={currency} className="bg-gray-800 text-white">{currency}</option>
                                    )) : <option className="bg-gray-800">{toCurrency}</option>}
                                </select>
                            </div>
                        </div>

                        <div className='flex items-center justify-between text-xs text-gray-400 mt-2 bg-gray-800/30 p-3 rounded-lg'>
                            <div>
                                Exchange Rate: <span className="text-white font-mono">1 {fromCurrency} ≈ {currencyData && currencyData[toCurrency] ? currencyData[toCurrency].toFixed(4) : '...'} {toCurrency}</span>
                            </div>
                            <button 
                                onClick={copyToClipboard}
                                className='flex items-center gap-1 text-gray-400 hover:text-white transition-colors'
                                title="Copy Result"
                            >
                                {copied ? <FaCheck className="text-green-400" /> : <FaRegCopy />}
                                <span className="ml-1">{copied ? 'Copied' : 'Copy'}</span>
                            </button>
                        </div>
                        
                        {!historyLoading && historicalData.length > 0 && (
                            <CurrencyChart data={historicalData} from={fromCurrency} to={toCurrency} />
                        )}
                        {favorites.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <h3 className="text-sm font-semibold mb-3 text-gray-300">Favorites</h3>
                                <div className="flex flex-wrap gap-2">
                                    {favorites.map(fav => (
                                        <button 
                                            key={fav}
                                            onClick={() => loadFavorite(fav)}
                                            className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-xs transition-colors border border-white/5"
                                        >
                                            {fav.replace('-', ' → ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
  )
}

export default Currency
