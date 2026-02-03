<script setup lang="ts">
import { computed } from 'vue';
import type { WeatherData } from '../types/weather';
import { useWeather } from '../composables/useWeather';
import WeatherIcon from './WeatherIcon.vue';

const props = defineProps<{
  weather: WeatherData;
}>();

const { getWeatherDescription } = useWeather();

// Helper to format daily items
const dailyForecast = computed(() => {
  if (!props.weather.daily) return [];
  
  return props.weather.daily.time.map((t, index) => {
    return {
      date: new Date(t),
      dayName: new Date(t).toLocaleDateString('en-US', { weekday: 'short' }),
      fullDate: new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      tempMax: Math.round(props.weather.daily.tempMax[index] ?? 0),
      tempMin: Math.round(props.weather.daily.tempMin[index] ?? 0),
      code: props.weather.daily.weatherCode[index] ?? 0,
      desc: getWeatherDescription(props.weather.daily.weatherCode[index] ?? 0)
    };
  }).slice(1, 6); // Take next 5 days
});

// Get gradient for temperature bar
const getTempGradient = (min: number, max: number, currentMin: number, currentMax: number) => {
  const range = currentMax - currentMin || 1;
  const leftPercent = ((min - currentMin) / range) * 100;
  const widthPercent = ((max - min) / range) * 100;
  return {
    left: `${Math.max(0, leftPercent)}%`,
    width: `${Math.max(10, widthPercent)}%`
  };
};

const allTemps = computed(() => {
  return dailyForecast.value.flatMap(d => [d.tempMin, d.tempMax]);
});

const minTemp = computed(() => Math.min(...allTemps.value));
const maxTemp = computed(() => Math.max(...allTemps.value));
</script>

<template>
  <div class="forecast-container">
    <h3 class="forecast-title">
      <span class="title-icon">📅</span>
      5-Day Forecast
    </h3>
    
    <div class="forecast-list">
      <div 
        v-for="(day, index) in dailyForecast" 
        :key="day.dayName" 
        class="forecast-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <!-- Day Info -->
        <div class="day-header">
          <span class="day-name">{{ day.dayName }}</span>
          <span class="day-date">{{ day.fullDate }}</span>
        </div>

        <!-- Weather Icon -->
        <div class="day-icon">
          <WeatherIcon :weather-code="day.code" :is-day="1" size="sm" />
        </div>

        <!-- Temperature Display -->
        <div class="day-temps">
          <span class="temp-high">{{ day.tempMax }}°</span>
          <div class="temp-bar-container">
            <div 
              class="temp-bar"
              :style="getTempGradient(day.tempMin, day.tempMax, minTemp, maxTemp)"
            ></div>
          </div>
          <span class="temp-low">{{ day.tempMin }}°</span>
        </div>

        <!-- Weather Description -->
        <span class="day-desc" :title="day.desc">{{ day.desc }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.forecast-container {
  width: 100%;
  max-width: 900px;
  animation: slideUp 0.6s ease-out 0.2s both;
}

@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.forecast-title {
  color: white;
  margin-bottom: 1.25rem;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.title-icon {
  font-size: 1.1rem;
}

.forecast-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.forecast-card {
  display: grid;
  grid-template-columns: 80px 50px 1fr 100px;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-out both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.forecast-card:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: translateX(8px);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* Day Header */
.day-header {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.day-name {
  font-weight: 700;
  font-size: 1.1rem;
  color: white;
}

.day-date {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Icon */
.day-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
}

/* Temperature Row */
.day-temps {
  display: grid;
  grid-template-columns: 35px 1fr 35px;
  align-items: center;
  gap: 0.75rem;
}

.temp-high {
  font-weight: 700;
  font-size: 1.1rem;
  color: white;
  text-align: right;
}

.temp-low {
  font-weight: 500;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: left;
}

.temp-bar-container {
  position: relative;
  height: 6px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
  overflow: hidden;
}

.temp-bar {
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%);
  border-radius: 3px;
  transition: all 0.5s ease;
  box-shadow: 0 0 10px rgba(79, 172, 254, 0.5);
}

/* Description */
.day-desc {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* Responsive */
@media (max-width: 700px) {
  .forecast-card {
    grid-template-columns: 70px 45px 1fr;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
  }
  
  .day-desc {
    display: none;
  }
  
  .day-temps {
    grid-template-columns: 30px 1fr 30px;
    gap: 0.5rem;
  }
  
  .temp-high, .temp-low {
    font-size: 1rem;
  }
}

@media (max-width: 400px) {
  .forecast-card {
    grid-template-columns: 60px 40px 1fr;
    gap: 0.5rem;
    padding: 0.75rem;
  }
  
  .day-name {
    font-size: 0.95rem;
  }
  
  .day-date {
    font-size: 0.7rem;
  }
  
  .temp-high, .temp-low {
    font-size: 0.9rem;
  }
}
</style>
