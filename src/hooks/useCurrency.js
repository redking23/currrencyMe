import { useQuery } from "@tanstack/react-query";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.freecurrencyapi.com/v1/latest';

function useCurrency(baseCurrency) {
    return useQuery({
        queryKey: ['latestRates', baseCurrency],
        queryFn: async () => {
            if (!baseCurrency) return {};
            const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&base_currency=${baseCurrency}`);
            if (!response.ok) throw new Error('Latest rates fetch failed');
            const data = await response.json();
            return data.data;
        },
        enabled: !!baseCurrency,
    });
}

export default useCurrency;
