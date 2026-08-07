# WeathCionz - Premium Interactive Weather Forecast

A stunning, highly interactive weather application built with React, Vite, and MapLibre GL. It features a full 3D interactive globe with live weather data visualizations (temperature, precipitation, clouds, wind, and pressure) mapped globally. 

## Features
- **Dynamic 3D Map**: Interactive MapLibre GL globe with custom procedural heatmap layers.
- **Glassmorphism UI**: Beautiful frosted glass interface that adapts to the current weather condition.
- **Live Search & Geolocation**: Instantly find locations or use precise GPS geolocation.
- **Micro-Animations**: Fluid Framer Motion animations across all components.
- **Performance Optimized**: Built with `useMemo` caching, lazy loaded components, and Vite chunk splitting.
- **Accessibility**: Screen-reader ready with ARIA roles and labels.

## Tech Stack
- React 19
- Tailwind CSS v4
- Framer Motion
- Zustand (State Management)
- MapLibre GL (Maps)
- React Query (Data Fetching)
- Open-Meteo API (Weather Data)

## Running Locally
1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env` (optional, for OpenWeatherMap tiles)
4. Run `npm run dev`
