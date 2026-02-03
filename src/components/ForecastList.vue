<script setup lang="ts">
import { computed } from 'vue';
import type { WeatherData } from '../types/weather';
import { useWeather } from '../composables/useWeather';

const props = defineProps<{
  weather: WeatherData;
}>();

const { getWeatherDescription } = useWeather();

// Helper to format daily items
const dailyForecast = computed(() => {
  if (!props.weather.daily) return [];
  
  return props.weather.daily.time.map((t, index) => {
    // Skip today (index 0) if we want, but letting user see today again is fine. 
    // Usually forecast is next 5 days.
    // OpenMeteo returns 7 days by default if not specified, 
    // but in request we didn't specify forecast_days, default is 7.
    
    return {
      date: new Date(t),
      dayName: new Date(t).toLocaleDateString('en-US', { weekday: 'short' }),
      tempMax: Math.round(props.weather.daily.tempMax[index] ?? 0),
      tempMin: Math.round(props.weather.daily.tempMin[index] ?? 0),
      code: props.weather.daily.weatherCode[index] ?? 0,
      desc: getWeatherDescription(props.weather.daily.weatherCode[index] ?? 0)
    };
  }).slice(1, 6); // Take next 5 days
});
</script>

<template>
  <div class="forecast-container">
    <h3 class="forecast-title">5-Day Forecast</h3>
    <div class="forecast-grid">
      <div 
        v-for="day in dailyForecast" 
        :key="day.dayName" 
        class="forecast-card glass-card"
      >
        <span class="day-name">{{ day.dayName }}</span>
        <!-- Icon would go here -->
        <div class="temps">
          <span class="max">{{ day.tempMax }}°</span>
          <span class="min">{{ day.tempMin }}°</span>
        </div>
        <span class="desc">{{ day.desc }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.forecast-container {
  width: 100%;
  max-width: 800px;
  margin-top: 2rem;
}

.forecast-title {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  padding-left: 0.5rem;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.forecast-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  text-align: center;
  transition: transform 0.2s;
}

.forecast-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.2);
}

.day-name {
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.temps {
  display: flex;
  gap: 0.8rem;
  font-size: 1.1rem;
}

.max {
  font-weight: 600;
}

.min {
  color: var(--color-text-muted);
}

.desc {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
