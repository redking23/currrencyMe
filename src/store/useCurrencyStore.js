import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCurrencyStore = create(
    persist(
        (set) => ({
            favorites: [],
            toggleFavorite: (from, to) => {
                const pair = `${from}-${to}`;
                set((state) => {
                    const isFavorite = state.favorites.includes(pair);
                    const newFavorites = isFavorite
                        ? state.favorites.filter((f) => f !== pair)
                        : [...state.favorites, pair];
                    return { favorites: newFavorites };
                });
            },
            // You can add more global state here, like theme or default currencies
            lastFromCurrency: 'USD',
            lastToCurrency: 'TRY',
            setLastCurrencies: (from, to) => set({ lastFromCurrency: from, lastToCurrency: to }),
        }),
        {
            name: 'currency-storage', // name of the item in storage (must be unique)
        }
    )
);

export default useCurrencyStore;
