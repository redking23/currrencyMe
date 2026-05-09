import { useQuery } from "@tanstack/react-query";

const API_KEY = import.meta.env.VITE_API_KEY;

function usePastRate(date, fromCurrency, toCurrency) {
    return useQuery({
        queryKey: ['pastRate', date, fromCurrency, toCurrency],
        queryFn: async () => {
            if (!date || !fromCurrency || !toCurrency || fromCurrency === toCurrency) {
                return null;
            }

            try {
                // Historical BTC price from Binance (Daily closing)
                let btcPriceInUSD = null;
                if (fromCurrency === 'BTC' || toCurrency === 'BTC') {
                    const timestamp = new Date(date).getTime();
                    const binanceRes = await fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&startTime=${timestamp}&limit=1`);
                    const binanceData = await binanceRes.json();
                    if (binanceData && binanceData[0]) {
                        btcPriceInUSD = parseFloat(binanceData[0][4]); 
                    }
                }

                // Calculation logic: "How much Source currency for 1 unit of Target currency?"
                
                if (toCurrency === 'BTC') {
                    // Convert BTC/USD to BTC/Base (e.g. BTC/TRY)
                    let usdToFromRate = 1;
                    if (fromCurrency !== 'USD') {
                        const fcaRes = await fetch(`https://api.freecurrencyapi.com/v1/historical?apikey=${API_KEY}&date=${date}&base_currency=USD&currencies=${fromCurrency}`);
                        const fcaData = await fcaRes.json();
                        usdToFromRate = fcaData.data[date][fromCurrency];
                    }
                    return btcPriceInUSD * usdToFromRate;
                }

                if (fromCurrency === 'BTC') {
                    let usdToToRate = 1;
                    if (toCurrency !== 'USD') {
                        const fcaRes = await fetch(`https://api.freecurrencyapi.com/v1/historical?apikey=${API_KEY}&date=${date}&base_currency=USD&currencies=${toCurrency}`);
                        const fcaData = await fcaRes.json();
                        usdToToRate = fcaData.data[date][toCurrency];
                    }
                    return 1 / (btcPriceInUSD * usdToToRate);
                }

                // Standard Fiat historical rate
                const url = `https://api.freecurrencyapi.com/v1/historical?apikey=${API_KEY}&date=${date}&base_currency=${toCurrency}&currencies=${fromCurrency}`;
                const response = await fetch(url);
                const data = await response.json();
                
                if (data && data.data && data.data[date]) {
                    return data.data[date][fromCurrency];
                }
                
                return null;

            } catch (err) {
                console.error("Historical Rate Error:", err);
                return null;
            }
        },
        enabled: false,
        staleTime: Infinity,
    });
}

export default usePastRate;
