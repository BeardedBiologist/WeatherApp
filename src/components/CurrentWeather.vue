<script setup lang="ts">
import { computed } from 'vue';
import { Wind, Droplets, Eye, Gauge } from 'lucide-vue-next';
import type { WeatherData } from '../types/weather';
import { useWeather } from '../composables/useWeather';
import WeatherIcon from './WeatherIcon.vue';

const props = defineProps<{
  weather: WeatherData;
  locationName: string;
}>();

const { getWeatherDescription } = useWeather();
const weatherDesc = computed(() => getWeatherDescription(props.weather.current.weatherCode));

// Format date nicely
const formattedDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
});

// Get temperature color (for visual flair)
const tempColor = computed(() => {
  const temp = props.weather.current.temp;
  if (temp <= 0) return '#87CEEB'; // Ice blue
  if (temp <= 10) return '#64B5F6'; // Cool blue
  if (temp <= 20) return '#81C784'; // Pleasant green
  if (temp <= 30) return '#FFB74D'; // Warm orange
  return '#FF7043'; // Hot red
});
</script>

<template>
  <div class="current-weather">
    <!-- Location Header -->
    <div class="location-header">
      <h2 class="location-name">{{ locationName }}</h2>
      <p class="date">{{ formattedDate }}</p>
    </div>

    <!-- Main Weather Display -->
    <div class="main-display">
      <!-- Animated Weather Icon -->
      <div class="icon-section">
        <WeatherIcon 
          :weather-code="weather.current.weatherCode" 
          :is-day="weather.current.isDay ?? 1"
          size="xl"
        />
      </div>

      <!-- Temperature Section -->
      <div class="temp-section">
        <div class="temp-value" :style="{ color: tempColor }">
          {{ Math.round(weather.current.temp) }}°
        </div>
        <div class="condition">{{ weatherDesc }}</div>
        <div class="temp-range">
          <span class="high">H: {{ Math.round(weather.daily.tempMax[0] ?? 0) }}°</span>
          <span class="low">L: {{ Math.round(weather.daily.tempMin[0] ?? 0) }}°</span>
        </div>
      </div>
    </div>

    <!-- Weather Details Grid -->
    <div class="details-grid glass-card">
      <div class="detail-item">
        <div class="detail-icon-wrapper wind">
          <Wind :size="24" />
        </div>
        <div class="detail-info">
          <span class="detail-label">Wind</span>
          <span class="detail-value">{{ weather.current.windSpeed }} <small>km/h</small></span>
        </div>
      </div>
      
      <div class="detail-item">
        <div class="detail-icon-wrapper humidity">
          <Droplets :size="24" />
        </div>
        <div class="detail-info">
          <span class="detail-label">Humidity</span>
          <span class="detail-value">{{ weather.current.humidity }}<small>%</small></span>
        </div>
      </div>

      <div class="detail-item">
        <div class="detail-icon-wrapper visibility">
          <Eye :size="24" />
        </div>
        <div class="detail-info">
          <span class="detail-label">Feels Like</span>
          <span class="detail-value">{{ Math.round(weather.current.temp - 2 + weather.current.windSpeed * 0.1) }}°</span>
        </div>
      </div>

      <div class="detail-item">
        <div class="detail-icon-wrapper pressure">
          <Gauge :size="24" />
        </div>
        <div class="detail-info">
          <span class="detail-label">UV Index</span>
          <span class="detail-value">{{ weather.current.isDay ? Math.max(1, Math.round((100 - weather.current.weatherCode) / 10)) : 0 }}</span>
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
  width: 100%;
  max-width: 600px;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

/* Location Header */
.location-header {
  text-align: center;
}

.location-name {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.date {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0.5rem 0 0;
  font-weight: 400;
  letter-spacing: 0.5px;
}

/* Main Display */
.main-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.icon-section {
  filter: drop-shadow(0 10px 30px rgba(0,0,0,0.3));
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.temp-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.temp-value {
  font-size: 7rem;
  font-weight: 800;
  line-height: 1;
  text-shadow: 0 4px 20px rgba(0,0,0,0.2);
  transition: color 0.5s ease;
}

.condition {
  font-size: 1.5rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  margin-top: 0.5rem;
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.temp-range {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.75rem;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
}

.high {
  font-weight: 600;
}

.low {
  opacity: 0.7;
}

/* Details Grid */
.details-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  width: 100%;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  padding: 0.75rem 0.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.detail-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.detail-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  color: white;
  transition: all 0.3s ease;
}

.detail-icon-wrapper.wind {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
}

.detail-icon-wrapper.humidity {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  box-shadow: 0 4px 15px rgba(67, 233, 123, 0.4);
}

.detail-icon-wrapper.visibility {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  box-shadow: 0 4px 15px rgba(250, 112, 154, 0.4);
}

.detail-icon-wrapper.pressure {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  box-shadow: 0 4px 15px rgba(168, 237, 234, 0.4);
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-weight: 700;
  font-size: 1.1rem;
  color: white;
}

.detail-value small {
  font-size: 0.75rem;
  opacity: 0.8;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 600px) {
  .location-name {
    font-size: 1.75rem;
  }
  
  .temp-value {
    font-size: 5rem;
  }
  
  .main-display {
    flex-direction: column;
    gap: 1rem;
  }
  
  .details-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    padding: 1rem;
  }
  
  .detail-icon-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .detail-value {
    font-size: 1rem;
  }
}

@media (max-width: 400px) {
  .details-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
