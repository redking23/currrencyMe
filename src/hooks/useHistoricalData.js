import { useEffect, useState } from "react";
import axios from "axios";

function useHistoricalData(fromCurrency, toCurrency) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) {
            setData([]);
            return;
        }

        const fetchHistory = async () => {
            setLoading(true);
            const endDate = new Date().toISOString().split('T')[0];
            const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            try {
                // Using frankfurter.app which is free and open
                const response = await axios.get(
                    `https://api.frankfurter.app/${startDate}..${endDate}?from=${fromCurrency}&to=${toCurrency}`
                );

                if (response.data && response.data.rates) {
                    const formattedData = Object.keys(response.data.rates).map(date => ({
                        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), // Mon, Tue
                        rate: response.data.rates[date][toCurrency]
                    }));
                    setData(formattedData);
                    setError(null);
                }
            } catch (err) {
                console.error("Error fetching historical data:", err);
                setError(err);
                // Fallback dummy data if API fails (common with free APIs sometimes)
                // setData([]); 
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [fromCurrency, toCurrency]);

    return { data, loading, error };
}

export default useHistoricalData;
