<script setup lang="ts">
import { computed } from 'vue';
import { Wind, Droplets, Cloud } from 'lucide-vue-next';
import type { WeatherData } from '../types/weather';
import { useWeather } from '../composables/useWeather';

const props = defineProps<{
  weather: WeatherData;
  locationName: string;
}>();

const { getWeatherDescription } = useWeather();
const weatherDesc = computed(() => getWeatherDescription(props.weather.current.weatherCode));

// Simple logic to choose an icon or we could pass it down
// Ideally we map codes to Lucide icons
</script>

<template>
  <div class="current-weather">
    <div class="location-header">
      <h2>{{ locationName }}</h2>
      <p class="date">{{ new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) }}</p>
    </div>

    <div class="main-stats">
      <div class="temp-container">
        <span class="temp">{{ Math.round(weather.current.temp) }}°</span>
        <span class="condition">{{ weatherDesc }}</span>
      </div>
      
      <!-- Placeholder for large dynamic icon -->
      <div class="weather-visual">
         <!-- Would implement dynamic icon here -->
      </div>
    </div>

    <div class="glass-card grid-details">
      <div class="detail-item">
        <Wind :size="24" class="icon" />
        <div class="info">
          <span class="label">Wind</span>
          <span class="value">{{ weather.current.windSpeed }} km/h</span>
        </div>
      </div>
      
      <div class="detail-item">
        <Droplets :size="24" class="icon" />
        <div class="info">
          <span class="label">Humidity</span>
          <span class="value">{{ weather.current.humidity }}%</span>
        </div>
      </div>

      <div class="detail-item">
        <Cloud :size="24" class="icon" />
        <div class="info">
          <span class="label">Code</span>
          <span class="value">{{ weather.current.weatherCode }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.current-weather {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  color: white;
  width: 100%;
}

.location-header {
  text-align: center;
}

.location-header h2 {
  font-size: 3rem;
  font-weight: 700;
  text-shadow: 0 4px 10px rgba(0,0,0,0.2);
  margin-bottom: 0.5rem;
}

.date {
  font-size: 1.2rem;
  color: var(--color-text-muted);
}

.main-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.temp-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.temp {
  font-size: 8rem;
  font-weight: 800;
  line-height: 1;
  text-shadow: 0 4px 20px rgba(0,0,0,0.2);
  background: -webkit-linear-gradient(#fff, #eee);
  -webkit-background-clip: text;
  background-clip: text;
}

.condition {
  font-size: 1.5rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 0;
}

.grid-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  max-width: 600px;
  justify-content: center;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.icon {
  color: var(--color-accent);
}

.info {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.value {
  font-weight: 600;
  font-size: 1.1rem;
}

@media (max-width: 600px) {
  .temp {
    font-size: 6rem;
  }
  
  .grid-details {
    gap: 1rem;
  }
}
</style>
