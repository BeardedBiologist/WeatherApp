<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SearchBar from './components/SearchBar.vue';
import CurrentWeather from './components/CurrentWeather.vue';
import ForecastList from './components/ForecastList.vue';
import WeatherBackground from './components/WeatherBackground.vue';
import { useWeather } from './composables/useWeather';
import type { GeoLocation } from './types/weather';

const { weather, loading, error, fetchWeather } = useWeather();
const locationName = ref('Berlin'); // Default

const handleSelectLocation = async (loc: GeoLocation) => {
  locationName.value = loc.name;
  await fetchWeather(loc.latitude, loc.longitude);
};

// Initial fetch (Berlin)
onMounted(() => {
  fetchWeather(52.52, 13.41);
});
</script>

<template>
  <main class="app-container">
    <WeatherBackground 
      :weather-code="weather?.current.weatherCode"
      :is-day="weather?.current.isDay"
    />
    
    <div class="content-wrapper">
      <header class="header">
        <SearchBar @select="handleSelectLocation" />
      </header>
      
      <div v-if="loading && !weather" class="loading-state">
        <div class="spinner"></div>
        <p>Loading weather data...</p>
      </div>

      <div v-else-if="error" class="error-state glass-card">
        <p>{{ error }}</p>
        <button @click="() => fetchWeather(52.52, 13.41)">Retry Default</button>
      </div>

      <div v-else-if="weather" class="weather-content">
        <CurrentWeather :weather="weather" :location-name="locationName" />
        <ForecastList :weather="weather" />
      </div>
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
  display: flex;
  justify-content: center;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  z-index: 10; /* Above background */
}

.header {
  width: 100%;
  display: flex;
  justify-content: center;
}

.loading-state, .error-state {
  margin-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.weather-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

button {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  background: white;
  color: #333;
  font-weight: bold;
  cursor: pointer;
}
</style>
