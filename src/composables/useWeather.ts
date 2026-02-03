import axios from 'axios';
import { ref } from 'vue';
import type { WeatherData } from '../types/weather';

export function useWeather() {
  const weather = ref<WeatherData | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchWeather = async (lat: number, lon: number) => {
    loading.value = true;
    error.value = null;
    try {
      // Using Open-Meteo API (Free, no key)
      const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: lat,
          longitude: lon,
          current: 'temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m',
          daily: 'weather_code,temperature_2m_max,temperature_2m_min',
          timezone: 'auto'
        }
      });

      const data = response.data;
      
      weather.value = {
        timezone: data.timezone,
        current: {
          temp: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          isDay: data.current.is_day,
          weatherCode: data.current.weather_code,
          windSpeed: data.current.wind_speed_10m
        },
        daily: {
          time: data.daily.time,
          weatherCode: data.daily.weather_code,
          tempMax: data.daily.temperature_2m_max,
          tempMin: data.daily.temperature_2m_min
        }
      };
    } catch (e: any) {
      console.error(e);
      error.value = 'Failed to fetch weather data. Please try again.';
    } finally {
      loading.value = false;
    }
  };

  /**
   * Helper to map WMO Weather Codes to descriptions or icon names
   */
  const getWeatherDescription = (code: number): string => {
    const codes: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Thunderstorm with heavy hail'
    };
    return codes[code] || 'Unknown';
  };

  return {
    weather,
    loading,
    error,
    fetchWeather,
    getWeatherDescription
  };
}
