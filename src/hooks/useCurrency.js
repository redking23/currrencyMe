import { useEffect, useState } from "react";
import axios from "axios";

// Accessing environment variable in Vite
const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.freecurrencyapi.com/v1/latest';

function useCurrency(baseCurrency) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Prevent fetching if no base currency or API key is missing (though API key checks might be better done elsewhere or assumed)
        if (!baseCurrency) return;

        console.log("Fetching data for base:", baseCurrency);
        setLoading(true);
        
        axios.get(`${BASE_URL}?apikey=${API_KEY}&base_currency=${baseCurrency}`)
            .then((response) => {
                setData(response.data.data);
                setError(null);
            })
            .catch((err) => {
                console.error("Error fetching currency data:", err);
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [baseCurrency]);

    return { data, loading, error };
}

export default useCurrency;
