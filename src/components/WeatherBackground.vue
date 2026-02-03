<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  weatherCode?: number;
  isDay?: number;
}>();

const backgroundClass = computed(() => {
  if (props.weatherCode === undefined) return 'bg-default';
  
  // Simple mapping logic
  // 0, 1: Clear
  // 2, 3: Cloudy
  // 51-67, 80-82: Rain
  // 71-77, 85-86: Snow
  // 95-99: Thunder
  
  const code = props.weatherCode;
  const isDay = props.isDay === 1;

  if (code <= 1) return isDay ? 'bg-sunny' : 'bg-night-clear';
  if (code <= 3) return isDay ? 'bg-cloudy' : 'bg-night-cloudy';
  if (code >= 51 && code <= 67) return 'bg-rainy';
  if (code >= 80 && code <= 82) return 'bg-rainy';
  if (code >= 95) return 'bg-thunder';
  if (code >= 71) return 'bg-snow';
  
  return 'bg-default';
});
</script>

<template>
  <div class="weather-background" :class="backgroundClass">
    <div class="overlay"></div>
    
    <!-- Rain Particles -->
    <div v-if="weatherCode !== undefined && [51,53,55,61,63,65,80,81,82].includes(weatherCode)" class="particles rain">
      <div v-for="i in 50" :key="`rain-${i}`" class="drop" :style="{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random()}s`, animationDuration: `${0.5 + Math.random() * 0.5}s` }"></div>
    </div>

    <!-- Snow Particles -->
    <div v-if="weatherCode !== undefined && [71,73,75,77,85,86].includes(weatherCode)" class="particles snow">
      <div v-for="i in 50" :key="`snow-${i}`" class="flake" :style="{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${3 + Math.random() * 5}s` }">●</div>
    </div>
  </div>
</template>

<style scoped>
.weather-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  transition: background 1s ease;
  overflow: hidden;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%);
  z-index: 1;
}

/* Gradients */
.bg-default { background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%); }
.bg-sunny { background: linear-gradient(120deg, #f6d365 0%, #fda085 100%); }
.bg-night-clear { background: linear-gradient(to bottom, #0f2027, #203a43, #2c5364); }
.bg-cloudy { background: linear-gradient(to bottom, #5D4157, #A8CABA); }
.bg-night-cloudy { background: linear-gradient(to bottom, #232526, #414345); }
.bg-rainy { background: linear-gradient(to bottom, #3a6186, #89253e); }
.bg-snow { background: linear-gradient(to bottom, #E6DADA, #274046); }
.bg-thunder { background: linear-gradient(to bottom, #141E30, #243B55); }

/* Animation Particles */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.drop {
  position: absolute;
  top: -20px;
  width: 1px;
  height: 15px;
  background: rgba(255, 255, 255, 0.6);
  animation: fall linear infinite;
}

.flake {
  position: absolute;
  top: -10px;
  color: white;
  font-size: 10px;
  opacity: 0.8;
  animation: fall-snow linear infinite;
}

@keyframes fall {
  to { transform: translateY(105vh); }
}

@keyframes fall-snow {
  to { transform: translateY(105vh) rotate(360deg); }
}
</style>
