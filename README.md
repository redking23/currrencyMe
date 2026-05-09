# Currency & Crypto Time Machine

A high-performance currency converter and historical investment analysis tool. Built with a focus on modern UX, real-time data accuracy, and professional-grade state management.

## Core Features

- **Live Rates:** Real-time fiat currency conversion via FreeCurrencyAPI.
- **Crypto Integration:** Live Bitcoin (BTC) tracking and historical data from Binance.
- **Past Time Machine:** Calculate the opportunity cost of past investments. See exactly what your money could have bought years ago and its value today.
- **Visual Trends:** Interactive historical charts for the last 7 days.
- **API Optimization:** 1-hour persistent caching using TanStack Query & LocalStorage to minimize API calls and ensure instant data availability on refresh.
- **Premium UI:** Dark-mode first design with Framer Motion animations and glassmorphism.

## Tech Stack

- **Frontend:** React + Vite
- **State:** Zustand (Persistence enabled)
- **Data Fetching:** TanStack Query (React Query)
- **Styling:** Vanilla CSS + Tailwind
- **Animations:** Framer Motion
- **Icons:** React Icons

## Getting Started

1. **Environment Setup:**
   Create a `.env` file and add your API key:
   ```env
   VITE_API_KEY=your_freecurrencyapi_key
   ```

2. **Run Locally:**
   ```bash
   npm install
   npm run dev
   ```

## Development Philosophy

This project isn't just a converter; it's an exploration of data consistency across multiple APIs (Binance, FreeCurrencyAPI). The architecture emphasizes:
- **Resilience:** Multi-layered fallback logic for API failures.
- **Performance:** Optimized re-renders and smart caching.
- **UX:** Zero-flicker transitions and intuitive interaction patterns.
