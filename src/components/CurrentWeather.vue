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

// Get gradient based on temperature
const tempGradient = computed(() => {
  const temp = props.weather.current.temp;
  if (temp <= 0) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  if (temp <= 10) return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
  if (temp <= 20) return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
  if (temp <= 30) return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
  return 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)';
});
</script>

<template>
  <div class="current-weather">
    <!-- Main Card -->
    <div class="weather-card">
      <!-- Location Header -->
      <div class="location-header">
        <div class="location-badge">
          <span class="location-dot"></span>
          <h2 class="location-name">{{ locationName }}</h2>
        </div>
        <p class="date">{{ formattedDate }}</p>
      </div>

      <!-- Main Weather Display -->
      <div class="main-display">
        <!-- Animated Weather Icon -->
        <div class="icon-section">
          <div class="icon-glow" :style="{ background: tempGradient }"></div>
          <WeatherIcon 
            :weather-code="weather.current.weatherCode" 
            :is-day="weather.current.isDay ?? 1"
            :temperature="weather.current.temp"
            size="xl"
          />
        </div>

        <!-- Temperature Section -->
        <div class="temp-section">
          <div class="temp-wrapper">
            <div class="temp-value" :style="{ 
              background: `linear-gradient(135deg, ${tempColor} 0%, white 100%)`,
              '-webkit-background-clip': 'text',
              '-webkit-text-fill-color': 'transparent'
            }">
              {{ Math.round(weather.current.temp) }}°
            </div>
            <div class="temp-unit">C</div>
          </div>
          <div class="condition">{{ weatherDesc }}</div>
          <div class="temp-range">
            <span class="temp-pill high">
              <span class="pill-icon">↑</span>
              {{ Math.round(weather.daily.tempMax[0] ?? 0) }}°
            </span>
            <span class="temp-pill low">
              <span class="pill-icon">↓</span>
              {{ Math.round(weather.daily.tempMin[0] ?? 0) }}°
            </span>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Weather Details Grid -->
      <div class="details-grid">
        <div class="detail-item">
          <div class="detail-icon-wrapper" style="--detail-color: #4facfe;">
            <Wind :size="22" />
          </div>
          <div class="detail-info">
            <span class="detail-label">Wind</span>
            <span class="detail-value">{{ Math.round(weather.current.windSpeed) }} <small>km/h</small></span>
          </div>
        </div>
        
        <div class="detail-item">
          <div class="detail-icon-wrapper" style="--detail-color: #43e97b;">
            <Droplets :size="22" />
          </div>
          <div class="detail-info">
            <span class="detail-label">Humidity</span>
            <span class="detail-value">{{ weather.current.humidity }}<small>%</small></span>
          </div>
        </div>

        <div class="detail-item">
          <div class="detail-icon-wrapper" style="--detail-color: #fa709a;">
            <Eye :size="22" />
          </div>
          <div class="detail-info">
            <span class="detail-label">Feels Like</span>
            <span class="detail-value">{{ Math.round(weather.current.temp - 2 + weather.current.windSpeed * 0.1) }}°</span>
          </div>
        </div>

        <div class="detail-item">
          <div class="detail-icon-wrapper" style="--detail-color: #a8edea;">
            <Gauge :size="22" />
          </div>
          <div class="detail-info">
            <span class="detail-label">UV Index</span>
            <span class="detail-value">{{ weather.current.isDay ? Math.max(1, Math.round((100 - weather.current.weatherCode) / 10)) : 0 }}</span>
          </div>
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
  width: 100%;
  max-width: 550px;
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

/* Main Card */
.weather-card {
  width: 100%;
  background: rgba(20, 25, 35, 0.55);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 32px;
  padding: 2rem;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.weather-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 30px 60px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* Location Header */
.location-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.location-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.location-dot {
  width: 8px;
  height: 8px;
  background: #00d4ff;
  border-radius: 50%;
  box-shadow: 0 0 10px #00d4ff;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

.location-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.date {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Main Display */
.main-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.icon-section {
  position: relative;
  filter: drop-shadow(0 10px 30px rgba(0,0,0,0.3));
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.4;
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.1); }
}

.temp-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.temp-wrapper {
  display: flex;
  align-items: flex-start;
  line-height: 1;
}

.temp-value {
  font-size: 6rem;
  font-weight: 800;
  line-height: 1;
  text-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.temp-unit {
  font-size: 2rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 0.25rem;
  margin-top: 0.5rem;
}

.condition {
  font-size: 1.25rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 0.25rem;
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.temp-range {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.temp-pill {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.pill-icon {
  font-size: 0.75rem;
  opacity: 0.7;
}

.temp-pill.high {
  color: #FFB74D;
}

.temp-pill.low {
  color: #64B5F6;
}

/* Divider */
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  margin: 1.5rem 0;
}

/* Details Grid */
.details-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  text-align: center;
  padding: 0.75rem 0.5rem;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.detail-item:hover {
  background: rgba(255, 255, 255, 0.05);
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
  background: linear-gradient(135deg, var(--detail-color) 0%, rgba(255,255,255,0.2) 100%);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255,255,255,0.1);
}

.detail-item:hover .detail-icon-wrapper {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255,255,255,0.2);
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.detail-label {
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.detail-value {
  font-weight: 700;
  font-size: 1rem;
  color: white;
}

.detail-value small {
  font-size: 0.75rem;
  opacity: 0.7;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 600px) {
  .weather-card {
    padding: 1.5rem;
    border-radius: 24px;
  }
  
  .location-name {
    font-size: 1.25rem;
  }
  
  .date {
    font-size: 0.75rem;
  }
  
  .main-display {
    flex-direction: column;
    gap: 1rem;
  }
  
  .temp-value {
    font-size: 4.5rem;
  }
  
  .temp-unit {
    font-size: 1.5rem;
  }
  
  .icon-glow {
    width: 120px;
    height: 120px;
  }
  
  .temp-section {
    align-items: center;
    text-align: center;
  }
  
  .details-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .detail-icon-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .detail-value {
    font-size: 0.9375rem;
  }
}

@media (max-width: 400px) {
  .weather-card {
    padding: 1.25rem;
  }
  
  .details-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .location-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .date {
    align-self: flex-start;
  }
}
</style>
