<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  weatherCode: number;
  isDay?: number;
  temperature?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}>();

const isDaytime = computed(() => props.isDay === 1);
const isFreezing = computed(() => props.temperature !== undefined && props.temperature <= 2);

const iconClass = computed(() => {
  const code = props.weatherCode;
  const day = isDaytime.value;
  
  // Override with frozen versions if freezing
  if (isFreezing.value) {
    if (code <= 1) return day ? 'icon-sunny-freezing' : 'icon-moon-freezing';
    if (code === 2) return day ? 'icon-partly-cloudy-freezing' : 'icon-moon-freezing';
    if (code === 3) return 'icon-cloudy-freezing';
    if (code <= 48) return 'icon-fog-freezing';
    if (code >= 51 && code <= 55) return 'icon-drizzle-freezing';
    if (code >= 61 && code <= 67) return 'icon-rain-freezing';
    if (code >= 80 && code <= 82) return 'icon-showers-freezing';
  }
  
  // Clear
  if (code <= 1) return day ? 'icon-sunny' : 'icon-moon';
  // Partly cloudy
  if (code === 2) return day ? 'icon-partly-cloudy-day' : 'icon-partly-cloudy-night';
  // Cloudy
  if (code === 3) return 'icon-cloudy';
  // Fog
  if (code <= 48) return 'icon-fog';
  // Drizzle
  if (code >= 51 && code <= 55) return 'icon-drizzle';
  // Rain
  if (code >= 61 && code <= 67) return 'icon-rain';
  // Showers
  if (code >= 80 && code <= 82) return 'icon-showers';
  // Snow
  if (code >= 71 && code <= 77) return 'icon-snow';
  if (code >= 85 && code <= 86) return 'icon-snow-showers';
  // Thunderstorm
  if (code >= 95) return 'icon-thunder';
  
  return day ? 'icon-sunny' : 'icon-moon';
});

const sizeClass = computed(() => `size-${props.size || 'md'}`);

const snowIntensity = computed(() => {
  const code = props.weatherCode;
  if (code === 71 || code === 77 || code === 85) return 'snow-light';
  if (code === 73) return 'snow-moderate';
  if (code === 75 || code === 86) return 'snow-heavy';
  return '';
});

const isSnowHeavy = computed(() => snowIntensity.value === 'snow-heavy');
</script>

<template>
  <div class="weather-icon" :class="[iconClass, sizeClass]">
    <!-- Sun Icon -->
    <div v-if="iconClass === 'icon-sunny'" class="animated-sun">
      <div class="sun-center"></div>
      <div class="sun-ray ray-1"></div>
      <div class="sun-ray ray-2"></div>
      <div class="sun-ray ray-3"></div>
      <div class="sun-ray ray-4"></div>
      <div class="sun-ray ray-5"></div>
      <div class="sun-ray ray-6"></div>
      <div class="sun-ray ray-7"></div>
      <div class="sun-ray ray-8"></div>
    </div>

    <!-- Freezing Sun (Cold Winter Sun) -->
    <div v-else-if="iconClass === 'icon-sunny-freezing'" class="animated-sun-freezing">
      <div class="sun-core-weak"></div>
      <div class="frost-ring"></div>
      <div class="ice-crystal-sun c1">❄</div>
      <div class="ice-crystal-sun c2">❅</div>
    </div>

    <!-- Moon Icon -->
    <div v-else-if="iconClass === 'icon-moon'" class="animated-moon">
      <div class="moon-body">
        <div class="moon-crater c1"></div>
        <div class="moon-crater c2"></div>
        <div class="moon-crater c3"></div>
      </div>
    </div>

    <!-- Freezing Moon -->
    <div v-else-if="iconClass === 'icon-moon-freezing'" class="animated-moon-freezing">
      <div class="moon-body frozen">
        <div class="moon-crater c1"></div>
        <div class="moon-crater c2"></div>
        <div class="frost-spot f1"></div>
        <div class="frost-spot f2"></div>
      </div>
      <div class="ice-shimmer">✦</div>
    </div>

    <!-- Partly Cloudy Day -->
    <div v-else-if="iconClass === 'icon-partly-cloudy-day'" class="animated-partly-cloudy-day">
      <div class="sun-behind">
        <div class="sun-center"></div>
        <div class="sun-ray ray-1"></div>
        <div class="sun-ray ray-3"></div>
        <div class="sun-ray ray-5"></div>
        <div class="sun-ray ray-7"></div>
      </div>
      <div class="cloud-front">
        <div class="cloud-puff p1"></div>
        <div class="cloud-puff p2"></div>
        <div class="cloud-puff p3"></div>
      </div>
    </div>

    <!-- Partly Cloudy Freezing -->
    <div v-else-if="iconClass === 'icon-partly-cloudy-freezing'" class="animated-partly-cloudy-freezing">
      <div class="sun-behind weak">
        <div class="sun-center"></div>
      </div>
      <div class="cloud-front frozen">
        <div class="cloud-puff p1"></div>
        <div class="cloud-puff p2"></div>
        <div class="cloud-puff p3"></div>
        <div class="cloud-ice i1">❄</div>
        <div class="cloud-ice i2">❅</div>
      </div>
    </div>

    <!-- Partly Cloudy Night -->
    <div v-else-if="iconClass === 'icon-partly-cloudy-night'" class="animated-partly-cloudy-night">
      <div class="moon-behind">
        <div class="moon-body">
          <div class="moon-crater c1"></div>
          <div class="moon-crater c2"></div>
        </div>
      </div>
      <div class="cloud-front">
        <div class="cloud-puff p1"></div>
        <div class="cloud-puff p2"></div>
        <div class="cloud-puff p3"></div>
      </div>
    </div>

    <!-- Cloudy -->
    <div v-else-if="iconClass === 'icon-cloudy'" class="animated-cloudy">
      <div class="cloud cloud-back">
        <div class="cloud-puff p1"></div>
        <div class="cloud-puff p2"></div>
        <div class="cloud-puff p3"></div>
      </div>
      <div class="cloud cloud-front">
        <div class="cloud-puff p1"></div>
        <div class="cloud-puff p2"></div>
        <div class="cloud-puff p3"></div>
      </div>
    </div>

    <!-- Cloudy Freezing -->
    <div v-else-if="iconClass === 'icon-cloudy-freezing'" class="animated-cloudy-freezing">
      <div class="cloud cloud-back frozen">
        <div class="cloud-puff p1"></div>
        <div class="cloud-puff p2"></div>
        <div class="cloud-puff p3"></div>
      </div>
      <div class="cloud cloud-front frozen">
        <div class="cloud-puff p1"></div>
        <div class="cloud-puff p2"></div>
        <div class="cloud-puff p3"></div>
        <div class="cloud-ice i1">❄</div>
        <div class="cloud-ice i2">❅</div>
        <div class="cloud-ice i3">❆</div>
      </div>
    </div>

    <!-- Fog -->
    <div v-else-if="iconClass === 'icon-fog'" class="animated-fog">
      <div class="fog-line f1"></div>
      <div class="fog-line f2"></div>
      <div class="fog-line f3"></div>
      <div class="fog-line f4"></div>
    </div>

    <!-- Fog Freezing -->
    <div v-else-if="iconClass === 'icon-fog-freezing'" class="animated-fog-freezing">
      <div class="fog-line f1"></div>
      <div class="fog-line f2"></div>
      <div class="fog-line f3"></div>
      <div class="fog-line f4"></div>
      <div class="fog-ice i1">❄</div>
      <div class="fog-ice i2">❅</div>
      <div class="fog-ice i3">❆</div>
    </div>

    <!-- Drizzle -->
    <div v-else-if="iconClass === 'icon-drizzle'" class="animated-drizzle">
      <div class="cloud">
        <div class="cloud-puff p1"></div>
        <div class="cloud-puff p2"></div>
        <div class="cloud-puff p3"></div>
      </div>
      <div class="drizzle-drop d1"></div>
      <div class="drizzle-drop d2"></div>
      <div class="drizzle-drop d3"></div>
      <div class="drizzle-drop d4"></div>
    </div>

    <!-- Drizzle Freezing -->
    <div v-else-if="iconClass === 'icon-drizzle-freezing'" class="animated-drizzle-freezing">
      <div class="cloud">
        <div class="cloud-puff p1"></div>
        <div class="cloud-puff p2"></div>
        <div class="cloud-puff p3"></div>
      </div>
      <div class="drizzle-drop d1 freezing"></div>
      <div class="drizzle-drop d2 freezing"></div>
      <div class="drizzle-drop d3 freezing"></div>
      <div class="drizzle-drop d4 freezing"></div>
      <div class="freeze-sparkle s1">✦</div>
      <div class="freeze-sparkle s2">✧</div>
    </div>

    <!-- Rain -->
    <div v-else-if="iconClass === 'icon-rain'" class="animated-rain">
      <div class="cloud">
        <div class="cloud-puff p1"></div>
        <div class="cloud-puff p2"></div>
        <div class="cloud-puff p3"></div>
      </div>
      <div class="rain-drop r1"></div>
      <div class="rain-drop r2"></div>
      <div class="rain-drop r3"></div>
      <div class="rain-drop r4"></div>
      <div class="rain-drop r5"></div>
    </div>

    <!-- Rain Freezing -->
    <div v-else-if="iconClass === 'icon-rain-freezing'" class="animated-rain-freezing">
      <div class="cloud">
        <div class="cloud-puff p1"></div>
        <div class="cloud-puff p2"></div>
        <div class="cloud-puff p3"></div>
      </div>
      <div class="rain-drop r1 freezing"></div>
      <div class="rain-drop r2 freezing"></div>
      <div class="rain-drop r3 freezing"></div>
      <div class="rain-drop r4 freezing"></div>
      <div class="rain-drop r5 freezing"></div>
      <div class="icicle ic1"></div>
      <div class="icicle ic2"></div>
    </div>

    <!-- Showers -->
    <div v-else-if="iconClass === 'icon-showers'" class="animated-showers">
      <div class="cloud">
        <div class="cloud-puff p1"></div>
        <div class="cloud-puff p2"></div>
        <div class="cloud-puff p3"></div>
      </div>
      <div class="shower-drop s1"></div>
      <div class="shower-drop s2"></div>
      <div class="shower-drop s3"></div>
      <div class="shower-drop s4"></div>
    </div>

    <!-- Showers Freezing -->
    <div v-else-if="iconClass === 'icon-showers-freezing'" class="animated-showers-freezing">
      <div class="cloud">
        <div class="cloud-puff p1"></div>
        <div class="cloud-puff p2"></div>
        <div class="cloud-puff p3"></div>
      </div>
      <div class="shower-drop s1 freezing"></div>
      <div class="shower-drop s2 freezing"></div>
      <div class="shower-drop s3 freezing"></div>
      <div class="shower-drop s4 freezing"></div>
      <div class="hail h1">●</div>
      <div class="hail h2">●</div>
    </div>

    <!-- Snow -->
    <div v-else-if="iconClass === 'icon-snow'" :class="['animated-snow', snowIntensity]">
      <div class="cloud">
        <div class="cloud-puff p1"></div>
        <div class="cloud-puff p2"></div>
        <div class="cloud-puff p3"></div>
      </div>
      <div class="snowflake sf1">❄</div>
      <div class="snowflake sf2">❅</div>
      <div class="snowflake sf3">❆</div>
      <div v-if="isSnowHeavy" class="snowflake sf4">❄</div>
      <div v-if="isSnowHeavy" class="snowflake sf5">❅</div>
    </div>

    <!-- Snow Showers -->
    <div v-else-if="iconClass === 'icon-snow-showers'" :class="['animated-snow-showers', snowIntensity]">
      <div class="cloud">
        <div class="cloud-puff p1"></div>
        <div class="cloud-puff p2"></div>
        <div class="cloud-puff p3"></div>
      </div>
      <div class="snowflake sf1">❄</div>
      <div class="snowflake sf2">❅</div>
      <div class="snowflake sf3">❆</div>
      <div class="snowflake sf4">❄</div>
      <div v-if="isSnowHeavy" class="snowflake sf5">❅</div>
    </div>

    <!-- Thunder -->
    <div v-else-if="iconClass === 'icon-thunder'" class="animated-thunder">
      <div class="cloud">
        <div class="cloud-puff p1"></div>
        <div class="cloud-puff p2"></div>
        <div class="cloud-puff p3"></div>
      </div>
      <div class="lightning-bolt">
        <div class="bolt-top"></div>
        <div class="bolt-mid"></div>
        <div class="bolt-bottom"></div>
      </div>
      <div class="rain-drop r1"></div>
      <div class="rain-drop r2"></div>
    </div>
  </div>
</template>

<style scoped>
.weather-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Size variants */
.size-sm { width: 40px; height: 40px; }
.size-md { width: 80px; height: 80px; }
.size-lg { width: 120px; height: 120px; }
.size-xl { width: 180px; height: 180px; }

/* ===== SUN ===== */
.animated-sun {
  position: relative;
  width: 100%;
  height: 100%;
}

.sun-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  height: 40%;
  background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255, 200, 0, 0.6), 0 0 40px rgba(255, 150, 50, 0.4);
  animation: sunPulse 2s ease-in-out infinite;
}

.sun-ray {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4%;
  height: 45%;
  background: linear-gradient(to top, #ffaa00, #ffd700);
  border-radius: 2px;
  transform-origin: center bottom;
  animation: rayPulse 2s ease-in-out infinite;
}

.sun-ray:nth-child(odd) { animation-delay: 0.5s; }
.ray-1 { transform: translate(-50%, -100%) rotate(0deg); }
.ray-2 { transform: translate(-50%, -100%) rotate(45deg); }
.ray-3 { transform: translate(-50%, -100%) rotate(90deg); }
.ray-4 { transform: translate(-50%, -100%) rotate(135deg); }
.ray-5 { transform: translate(-50%, -100%) rotate(180deg); }
.ray-6 { transform: translate(-50%, -100%) rotate(225deg); }
.ray-7 { transform: translate(-50%, -100%) rotate(270deg); }
.ray-8 { transform: translate(-50%, -100%) rotate(315deg); }

@keyframes sunPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
}

@keyframes rayPulse {
  0%, 100% { opacity: 0.8; transform: translate(-50%, -100%) scaleY(1) rotate(var(--rot, 0deg)); }
  50% { opacity: 1; transform: translate(-50%, -100%) scaleY(1.15) rotate(var(--rot, 0deg)); }
}

/* ===== FREEZING SUN ===== */
.animated-sun-freezing {
  position: relative;
  width: 100%;
  height: 100%;
}

.sun-core-weak {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 35%;
  height: 35%;
  background: linear-gradient(135deg, #fff8e7 0%, #f5e6d3 100%);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(255, 240, 220, 0.4);
  animation: sunPulseCold 3s ease-in-out infinite;
}

.frost-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 55%;
  height: 55%;
  border: 2px dashed rgba(200, 230, 255, 0.5);
  border-radius: 50%;
  animation: frostRingRotate 10s linear infinite;
}

.ice-crystal-sun {
  position: absolute;
  color: rgba(200, 230, 255, 0.8);
  font-size: 12px;
  animation: iceTwinkle 2s ease-in-out infinite;
}

.c1 { top: 15%; left: 65%; animation-delay: 0s; }
.c2 { top: 60%; left: 20%; animation-delay: 1s; }

@keyframes sunPulseCold {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
  50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.95; }
}

@keyframes frostRingRotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes iceTwinkle {
  0%, 100% { opacity: 0.4; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* ===== MOON ===== */
.animated-moon {
  position: relative;
  width: 100%;
  height: 100%;
}

.moon-body {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 50%;
  background: linear-gradient(135deg, #f5f5f5 0%, #d0d0d0 50%, #b0b0b0 100%);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.4), inset -5px -5px 10px rgba(0,0,0,0.1);
}

.moon-crater {
  position: absolute;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 50%;
}

.c1 { width: 25%; height: 25%; top: 20%; left: 25%; }
.c2 { width: 15%; height: 15%; top: 55%; left: 60%; }
.c3 { width: 12%; height: 12%; top: 35%; left: 65%; }

/* ===== FREEZING MOON ===== */
.animated-moon-freezing {
  position: relative;
  width: 100%;
  height: 100%;
}

.moon-body.frozen {
  background: linear-gradient(135deg, #f0f5f5 0%, #d8e8e8 50%, #c5d8d8 100%);
  box-shadow: 0 0 20px rgba(200, 230, 255, 0.3), inset -5px -5px 10px rgba(0,0,0,0.08);
}

.frost-spot {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  filter: blur(2px);
}

.f1 { width: 20%; height: 20%; top: 25%; left: 55%; }
.f2 { width: 12%; height: 12%; top: 60%; left: 30%; }

.ice-shimmer {
  position: absolute;
  top: 10%;
  right: 20%;
  color: rgba(200, 230, 255, 0.8);
  font-size: 14px;
  animation: iceTwinkle 2s ease-in-out infinite;
}

/* ===== PARTLY CLOUDY DAY ===== */
.animated-partly-cloudy-day {
  position: relative;
  width: 100%;
  height: 100%;
}

.sun-behind {
  position: absolute;
  top: 10%;
  right: 10%;
  width: 55%;
  height: 55%;
  animation: sunRotate 20s linear infinite;
}

.sun-behind.weak {
  animation: none;
}

.sun-behind.weak .sun-center {
  background: linear-gradient(135deg, #fff8e7 0%, #f0e0d0 100%);
  box-shadow: 0 0 15px rgba(255, 240, 220, 0.3);
}

.sun-behind .sun-center {
  width: 60%;
  height: 60%;
}

.sun-behind .sun-ray {
  height: 50%;
}

.cloud-front {
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 50%;
  animation: cloudBob 3s ease-in-out infinite;
}

.cloud-front.frozen {
  animation: cloudBob 3s ease-in-out infinite, frostShimmer 4s ease-in-out infinite;
}

.cloud-puff {
  position: absolute;
  background: linear-gradient(180deg, #ffffff 0%, #e0e0e0 100%);
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.cloud-front.frozen .cloud-puff {
  background: linear-gradient(180deg, #f8fafb 0%, #e8eef2 100%);
}

.p1 { width: 50%; height: 60%; bottom: 0; left: 0; }
.p2 { width: 45%; height: 70%; bottom: 10%; left: 25%; z-index: 2; }
.p3 { width: 40%; height: 50%; bottom: 5%; right: 0; }

.cloud-ice {
  position: absolute;
  color: rgba(200, 230, 255, 0.9);
  font-size: 10px;
  z-index: 3;
  animation: iceTwinkle 2s ease-in-out infinite;
}

.i1 { bottom: 5%; left: 10%; animation-delay: 0s; }
.i2 { bottom: 20%; right: 5%; animation-delay: 0.5s; }
.i3 { bottom: 10%; left: 45%; animation-delay: 1s; }

@keyframes sunRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes cloudBob {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-5%); }
}

/* ===== PARTLY CLOUDY FREEZING ===== */
.animated-partly-cloudy-freezing {
  position: relative;
  width: 100%;
  height: 100%;
}

/* ===== PARTLY CLOUDY NIGHT ===== */
.animated-partly-cloudy-night {
  position: relative;
  width: 100%;
  height: 100%;
}

.moon-behind {
  position: absolute;
  top: 15%;
  right: 15%;
  width: 45%;
  height: 45%;
  animation: moonFloat 4s ease-in-out infinite;
}

.moon-behind .moon-body {
  width: 100%;
  height: 100%;
}

@keyframes moonFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10%); }
}

/* ===== CLOUDY ===== */
.animated-cloudy, .animated-cloudy-freezing {
  position: relative;
  width: 100%;
  height: 100%;
}

.cloud {
  position: absolute;
  width: 80%;
  height: 50%;
}

.cloud-back {
  top: 15%;
  left: 5%;
  opacity: 0.6;
  transform: scale(0.9);
  animation: cloudDrift1 4s ease-in-out infinite;
}

.cloud-front {
  bottom: 20%;
  right: 5%;
  animation: cloudDrift2 4s ease-in-out infinite;
}

.cloud.frozen .cloud-puff {
  background: linear-gradient(180deg, #f5f8fa 0%, #e8eef2 100%);
}

@keyframes cloudDrift1 {
  0%, 100% { transform: scale(0.9) translateX(0); }
  50% { transform: scale(0.9) translateX(-5%); }
}

@keyframes cloudDrift2 {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5%); }
}

/* ===== FOG ===== */
.animated-fog, .animated-fog-freezing {
  position: relative;
  width: 100%;
  height: 100%;
}

.fog-line {
  position: absolute;
  left: 10%;
  width: 80%;
  height: 8%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
  border-radius: 10px;
  animation: fogMove 3s ease-in-out infinite;
}

.f1 { top: 25%; animation-delay: 0s; }
.f2 { top: 45%; animation-delay: 0.5s; }
.f3 { top: 65%; animation-delay: 1s; }
.f4 { top: 85%; animation-delay: 1.5s; }

.fog-ice {
  position: absolute;
  color: rgba(255, 255, 255, 0.8);
  font-size: 10px;
  animation: iceTwinkle 2s ease-in-out infinite;
}

.animated-fog-freezing .fog-line {
  background: linear-gradient(90deg, transparent, rgba(220, 240, 255, 0.7), transparent);
}

@keyframes fogMove {
  0%, 100% { opacity: 0.4; transform: translateX(0); }
  50% { opacity: 0.8; transform: translateX(10%); }
}

/* ===== DRIZZLE ===== */
.animated-drizzle, .animated-drizzle-freezing {
  position: relative;
  width: 100%;
  height: 100%;
}

.animated-drizzle .cloud, .animated-drizzle-freezing .cloud {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 45%;
}

.animated-drizzle .cloud-puff, .animated-drizzle-freezing .cloud-puff {
  background: linear-gradient(180deg, #c0c0c0 0%, #a0a0a0 100%);
}

.drizzle-drop {
  position: absolute;
  width: 3%;
  height: 15%;
  background: linear-gradient(to bottom, transparent, rgba(150, 180, 200, 0.8));
  border-radius: 0 0 2px 2px;
  animation: drizzleFall 1.5s linear infinite;
}

.drizzle-drop.freezing {
  background: linear-gradient(to bottom, transparent, rgba(180, 210, 240, 0.9));
  width: 4%;
}

.d1 { left: 30%; top: 50%; animation-delay: 0s; }
.d2 { left: 45%; top: 55%; animation-delay: 0.3s; }
.d3 { left: 60%; top: 50%; animation-delay: 0.6s; }
.d4 { left: 75%; top: 55%; animation-delay: 0.9s; }

.freeze-sparkle {
  position: absolute;
  color: rgba(200, 230, 255, 0.9);
  font-size: 8px;
  animation: iceTwinkle 1.5s ease-in-out infinite;
}

.s1 { left: 25%; top: 65%; animation-delay: 0.2s; }
.s2 { left: 70%; top: 70%; animation-delay: 0.7s; }

@keyframes drizzleFall {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(80px); opacity: 0; }
}

/* ===== RAIN ===== */
.animated-rain, .animated-rain-freezing {
  position: relative;
  width: 100%;
  height: 100%;
}

.animated-rain .cloud, .animated-rain-freezing .cloud {
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  width: 75%;
  height: 50%;
}

.animated-rain .cloud-puff, .animated-rain-freezing .cloud-puff {
  background: linear-gradient(180deg, #808080 0%, #606060 100%);
}

.rain-drop {
  position: absolute;
  width: 4%;
  height: 20%;
  background: linear-gradient(to bottom, transparent, rgba(100, 150, 200, 0.9));
  border-radius: 0 0 2px 2px;
  animation: rainFall 0.8s linear infinite;
}

.rain-drop.freezing {
  background: linear-gradient(to bottom, transparent, rgba(150, 200, 240, 0.95));
}

.r1 { left: 25%; top: 50%; animation-delay: 0s; }
.r2 { left: 40%; top: 55%; animation-delay: 0.15s; }
.r3 { left: 55%; top: 50%; animation-delay: 0.3s; }
.r4 { left: 70%; top: 55%; animation-delay: 0.45s; }
.r5 { left: 35%; top: 60%; animation-delay: 0.6s; }

.icicle {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 15px solid rgba(200, 230, 255, 0.7);
  animation: icicleSwing 2s ease-in-out infinite;
}

.ic1 { left: 20%; top: 52%; animation-delay: 0s; }
.ic2 { left: 75%; top: 52%; animation-delay: 1s; }

@keyframes rainFall {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(100px); opacity: 0; }
}

@keyframes icicleSwing {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

/* ===== SHOWERS ===== */
.animated-showers, .animated-showers-freezing {
  position: relative;
  width: 100%;
  height: 100%;
}

.animated-showers .cloud, .animated-showers-freezing .cloud {
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  width: 75%;
  height: 45%;
}

.animated-showers .cloud-puff, .animated-showers-freezing .cloud-puff {
  background: linear-gradient(180deg, #909090 0%, #707070 100%);
}

.shower-drop {
  position: absolute;
  width: 4%;
  height: 18%;
  background: linear-gradient(to bottom, transparent, rgba(80, 130, 180, 0.9));
  border-radius: 0 0 2px 2px;
  animation: showerFall 0.5s linear infinite;
}

.shower-drop.freezing {
  background: linear-gradient(to bottom, transparent, rgba(140, 190, 230, 0.95));
}

.s1 { left: 30%; top: 45%; animation-delay: 0s; }
.s2 { left: 50%; top: 50%; animation-delay: 0.1s; }
.s3 { left: 70%; top: 45%; animation-delay: 0.2s; }
.s4 { left: 45%; top: 55%; animation-delay: 0.3s; }

.hail {
  position: absolute;
  color: rgba(220, 240, 255, 0.9);
  font-size: 8px;
  animation: hailFall 0.6s linear infinite;
}

.h1 { left: 35%; top: 50%; animation-delay: 0.15s; }
.h2 { left: 65%; top: 55%; animation-delay: 0.35s; }

@keyframes showerFall {
  0% { transform: translateY(0) scaleY(1); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(90px) scaleY(0.8); opacity: 0; }
}

@keyframes hailFall {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(90px); opacity: 0; }
}

/* ===== SNOW ===== */
.animated-snow, .animated-snow-showers {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.animated-snow .cloud, .animated-snow-showers .cloud {
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 45%;
}

.animated-snow .cloud-puff, .animated-snow-showers .cloud-puff {
  background: linear-gradient(180deg, #e0e0e0 0%, #c0c0c0 100%);
}

.snowflake {
  position: absolute;
  color: white;
  font-size: 10px;
  text-shadow: 0 0 3px rgba(255,255,255,0.7);
  animation: snowFall 1.8s ease-in-out infinite;
}

.sf1 { left: 30%; top: 45%; animation-delay: 0s; font-size: 9px; }
.sf2 { left: 50%; top: 50%; animation-delay: 0.4s; font-size: 11px; }
.sf3 { left: 70%; top: 45%; animation-delay: 0.8s; font-size: 8px; }
.sf4 { left: 40%; top: 60%; animation-delay: 0.6s; font-size: 10px; }
.sf5 { left: 60%; top: 62%; animation-delay: 1s; font-size: 9px; }

.animated-snow.snow-light .snowflake,
.animated-snow-showers.snow-light .snowflake {
  opacity: 0.6;
  animation-duration: 2.4s;
}

.animated-snow.snow-moderate .snowflake,
.animated-snow-showers.snow-moderate .snowflake {
  opacity: 0.8;
  animation-duration: 2s;
}

.animated-snow.snow-heavy .snowflake,
.animated-snow-showers.snow-heavy .snowflake {
  opacity: 1;
  animation-duration: 1.5s;
}

@keyframes snowFall {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 0.8; }
  100% { transform: translateY(50px) rotate(180deg); opacity: 0; }
}

/* ===== THUNDER ===== */
.animated-thunder {
  position: relative;
  width: 100%;
  height: 100%;
}

.animated-thunder .cloud {
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  width: 75%;
  height: 45%;
}

.animated-thunder .cloud-puff {
  background: linear-gradient(180deg, #505050 0%, #303030 100%);
}

.lightning-bolt {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translateX(-50%);
  animation: lightningFlash 2s ease-out infinite;
}

.bolt-top {
  width: 8px;
  height: 20px;
  background: linear-gradient(to bottom, #ffffaa, #ffff00);
  transform: skewX(-20deg);
  margin-left: -5px;
}

.bolt-mid {
  width: 8px;
  height: 25px;
  background: linear-gradient(to bottom, #ffff00, #ffffaa);
  transform: skewX(20deg);
  margin-top: -5px;
}

.bolt-bottom {
  width: 6px;
  height: 15px;
  background: linear-gradient(to bottom, #ffffaa, transparent);
  transform: skewX(-20deg);
  margin-left: 5px;
  margin-top: -5px;
}

.animated-thunder .rain-drop {
  width: 3%;
  height: 15%;
  background: linear-gradient(to bottom, transparent, rgba(100, 130, 160, 0.7));
}

@keyframes lightningFlash {
  0%, 85%, 100% { opacity: 0; }
  90% { opacity: 1; filter: drop-shadow(0 0 10px #ffff00); }
  92% { opacity: 0.3; }
  94% { opacity: 1; filter: drop-shadow(0 0 15px #ffff00); }
  96% { opacity: 0; }
}
</style>
