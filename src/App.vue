<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SearchBar from './components/SearchBar.vue';
import CurrentWeather from './components/CurrentWeather.vue';
import ForecastList from './components/ForecastList.vue';
import WeatherBackground from './components/WeatherBackground.vue';
import { useWeather } from './composables/useWeather';
import type { GeoLocation } from './types/weather';

const { weather, loading, error, fetchWeather } = useWeather();
const locationName = ref('Oslo'); // Default

const handleSelectLocation = async (loc: GeoLocation) => {
  locationName.value = loc.name;
  await fetchWeather(loc.latitude, loc.longitude);
};

// Initial fetch (Berlin)
onMounted(() => {
  fetchWeather(59.91, 10.75);
});
</script>

<template>
  <main class="app-container">
    <!-- Animated Background -->
    <WeatherBackground 
      :weather-code="weather?.current.weatherCode"
      :is-day="weather?.current.isDay"
      :temperature="weather?.current.temp"
    />
    
    <div class="content-wrapper">
      <!-- Header with Search -->
      <header class="header">
        <div class="logo">
          <span class="logo-icon">⛅</span>
          <span class="logo-text">Weather</span>
        </div>
        <SearchBar @select="handleSelectLocation" />
      </header>
      
      <!-- Loading State -->
      <Transition name="fade" mode="out-in">
        <div v-if="loading && !weather" class="state-container loading-state">
          <div class="spinner-large"></div>
          <p class="state-text">Loading weather data...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="state-container error-state">
          <div class="error-icon">⚠️</div>
          <p class="state-text">{{ error }}</p>
          <button @click="() => fetchWeather(59.91, 10.75)" class="retry-btn">
            Try Again
          </button>
        </div>

        <!-- Weather Content -->
        <div v-else-if="weather" class="weather-content">
          <CurrentWeather :weather="weather" :location-name="locationName" />
          <ForecastList :weather="weather" />
          
          <!-- Footer -->
          <footer class="footer">
            <p>Powered by Open-Meteo API</p>
          </footer>
        </div>
      </Transition>
    </div>
  </main>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow-x: hidden;
  color: white;
}

.content-wrapper {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

/* Header */
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-top: 1rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.logo-icon {
  font-size: 2rem;
}

.logo-text {
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* State Containers */
.state-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  text-align: center;
  min-height: 400px;
}

.spinner-large {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.state-text {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.error-icon {
  font-size: 3rem;
}

.error-state .state-text {
  color: rgba(255, 200, 200, 0.9);
}

.retry-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* Weather Content */
.weather-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding-bottom: 2rem;
}

/* Footer */
.footer {
  margin-top: auto;
  padding-top: 2rem;
  text-align: center;
}

.footer p {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Responsive */
@media (min-width: 768px) {
  .content-wrapper {
    padding: 2rem;
  }
  
  .header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.5rem;
  }
  
  .weather-content {
    gap: 3rem;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 1rem;
  }
  
  .logo {
    font-size: 1.25rem;
  }
  
  .logo-icon {
    font-size: 1.5rem;
  }
  
  .weather-content {
    gap: 1.5rem;
  }
}
</style>
