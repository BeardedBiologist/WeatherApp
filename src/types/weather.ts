export interface WeatherCurrent {
  temp: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: number;
}

export interface WeatherDaily {
  time: string[];
  weatherCode: number[];
  tempMax: number[];
  tempMin: number[];
}

export interface WeatherData {
  current: WeatherCurrent;
  daily: WeatherDaily;
  timezone: string;
}

export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State/Region
}
