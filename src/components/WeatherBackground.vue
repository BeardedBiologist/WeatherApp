<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  weatherCode?: number;
  isDay?: number;
}>();

// Weather condition types
type WeatherType = 'clear' | 'cloudy' | 'rain' | 'snow' | 'thunder' | 'fog' | 'default';

const weatherCondition = computed<WeatherType>(() => {
  if (props.weatherCode === undefined) return 'default';
  
  const code = props.weatherCode;
  
  // Clear sky
  if (code <= 1) return 'clear';
  // Cloudy
  if (code <= 3) return 'cloudy';
  // Fog
  if (code <= 48) return 'fog';
  // Drizzle and Rain
  if (code >= 51 && code <= 67) return 'rain';
  if (code >= 80 && code <= 82) return 'rain';
  // Snow
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 85 && code <= 86) return 'snow';
  // Thunderstorm
  if (code >= 95) return 'thunder';
  
  return 'default';
});

const isDaytime = computed(() => props.isDay === 1);

const backgroundClass = computed(() => {
  const condition = weatherCondition.value;
  const day = isDaytime.value;
  
  switch (condition) {
    case 'clear':
      return day ? 'bg-sunny' : 'bg-night-clear';
    case 'cloudy':
      return day ? 'bg-cloudy' : 'bg-night-cloudy';
    case 'rain':
      return 'bg-rainy';
    case 'snow':
      return 'bg-snow';
    case 'thunder':
      return 'bg-thunder';
    case 'fog':
      return 'bg-fog';
    default:
      return 'bg-default';
  }
});

// Generate random values for particles (stable across re-renders)
const rainDrops = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 2}s`,
  duration: `${0.4 + Math.random() * 0.4}s`,
  opacity: 0.3 + Math.random() * 0.5
}));

const snowFlakes = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 5}s`,
  duration: `${4 + Math.random() * 6}s`,
  size: 4 + Math.random() * 8,
  sway: Math.random() > 0.5 ? 1 : -1
}));

const clouds = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  top: `${10 + Math.random() * 40}%`,
  delay: `${Math.random() * 20}s`,
  duration: `${25 + Math.random() * 20}s`,
  scale: 0.5 + Math.random() * 0.8,
  opacity: 0.2 + Math.random() * 0.3
}));

const stars = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 60}%`,
  size: 1 + Math.random() * 2,
  delay: `${Math.random() * 3}s`,
  duration: `${2 + Math.random() * 3}s`
}));

const iceCrystals = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  delay: `${Math.random() * 4}s`,
  duration: `${3 + Math.random() * 4}s`,
  size: 10 + Math.random() * 20
}));
</script>

<template>
  <div class="weather-background" :class="backgroundClass">
    <!-- Gradient Overlay -->
    <div class="gradient-overlay"></div>
    
    <!-- Stars (night only) -->
    <div v-if="!isDaytime && weatherCondition !== 'thunder'" class="stars-container">
      <div 
        v-for="star in stars" 
        :key="`star-${star.id}`"
        class="star"
        :style="{
          left: star.left,
          top: star.top,
          width: `${star.size}px`,
          height: `${star.size}px`,
          animationDelay: star.delay,
          animationDuration: star.duration
        }"
      ></div>
    </div>

    <!-- Sun with rays (sunny day) -->
    <div v-if="weatherCondition === 'clear' && isDaytime" class="sun-container">
      <div class="sun">
        <div class="sun-rays"></div>
        <div class="sun-core"></div>
      </div>
      <div class="heat-haze"></div>
    </div>

    <!-- Moon (clear night) -->
    <div v-if="weatherCondition === 'clear' && !isDaytime" class="moon-container">
      <div class="moon">
        <div class="moon-crater crater-1"></div>
        <div class="moon-crater crater-2"></div>
        <div class="moon-crater crater-3"></div>
      </div>
      <div class="moon-glow"></div>
    </div>

    <!-- Clouds -->
    <div v-if="['cloudy', 'rain', 'snow'].includes(weatherCondition) || (weatherCondition === 'clear' && isDaytime)" 
         class="clouds-container">
      <div 
        v-for="cloud in clouds" 
        :key="`cloud-${cloud.id}`"
        class="cloud"
        :class="{ 'dark': weatherCondition === 'rain' || weatherCondition === 'thunder', 'fluffy': weatherCondition === 'clear' }"
        :style="{
          top: cloud.top,
          animationDelay: cloud.delay,
          animationDuration: cloud.duration,
          transform: `scale(${cloud.scale})`,
          opacity: cloud.opacity
        }"
      >
        <div class="cloud-part cloud-part-1"></div>
        <div class="cloud-part cloud-part-2"></div>
        <div class="cloud-part cloud-part-3"></div>
      </div>
    </div>

    <!-- Rain Particles -->
    <div v-if="weatherCondition === 'rain' || weatherCondition === 'thunder'" class="rain-container">
      <div 
        v-for="drop in rainDrops" 
        :key="`rain-${drop.id}`"
        class="rain-drop"
        :style="{
          left: drop.left,
          animationDelay: drop.delay,
          animationDuration: drop.duration,
          opacity: drop.opacity
        }"
      ></div>
      <!-- Rain splashes -->
      <div 
        v-for="i in 20" 
        :key="`splash-${i}`"
        class="rain-splash"
        :style="{
          left: `${Math.random() * 100}%`,
          bottom: `${Math.random() * 20}%`,
          animationDelay: `${Math.random() * 2}s`
        }"
      ></div>
    </div>

    <!-- Snow Particles -->
    <div v-if="weatherCondition === 'snow'" class="snow-container">
      <div 
        v-for="flake in snowFlakes" 
        :key="`snow-${flake.id}`"
        class="snowflake"
        :class="`snowflake-${(flake.id % 6) + 1}`"
        :style="{
          left: flake.left,
          animationDelay: flake.delay,
          animationDuration: flake.duration,
          '--sway': flake.sway,
          fontSize: `${flake.size}px`
        }"
      >
        {{ ['❄', '❅', '❆', '✦', '✧', '•'][flake.id % 6] }}
      </div>
    </div>

    <!-- Ice Crystals (for snow) -->
    <div v-if="weatherCondition === 'snow'" class="ice-container">
      <div 
        v-for="crystal in iceCrystals" 
        :key="`ice-${crystal.id}`"
        class="ice-crystal"
        :style="{
          left: crystal.left,
          top: crystal.top,
          animationDelay: crystal.delay,
          animationDuration: crystal.duration,
          fontSize: `${crystal.size}px`
        }"
      >✦</div>
    </div>

    <!-- Fog Layers -->
    <div v-if="weatherCondition === 'fog' || weatherCondition === 'cloudy'" class="fog-container">
      <div class="fog-layer fog-layer-1"></div>
      <div class="fog-layer fog-layer-2"></div>
      <div class="fog-layer fog-layer-3"></div>
    </div>

    <!-- Lightning -->
    <div v-if="weatherCondition === 'thunder'" class="lightning-container">
      <div class="lightning lightning-1"></div>
      <div class="lightning lightning-2"></div>
      <div class="lightning lightning-3"></div>
    </div>

    <!-- Frost edges (for snow/ice) -->
    <div v-if="weatherCondition === 'snow'" class="frost-edges">
      <div class="frost-top"></div>
      <div class="frost-bottom"></div>
      <div class="frost-left"></div>
      <div class="frost-right"></div>
    </div>

    <!-- Dark vignette overlay -->
    <div class="vignette-overlay"></div>
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
  overflow: hidden;
  transition: all 1.5s ease;
}

/* ===== BACKGROUND GRADIENTS ===== */
.bg-default { 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
}
.bg-sunny { 
  background: linear-gradient(160deg, #f6d365 0%, #fda085 30%, #f5576c 100%); 
}
.bg-night-clear { 
  background: linear-gradient(to bottom, #0c0c1a 0%, #1a1a3e 50%, #2d1b4e 100%); 
}
.bg-cloudy { 
  background: linear-gradient(160deg, #8e9eab 0%, #5D6D7E 50%, #566573 100%); 
}
.bg-night-cloudy { 
  background: linear-gradient(to bottom, #1a1a2e 0%, #16213e 50%, #0f3460 100%); 
}
.bg-rainy { 
  background: linear-gradient(160deg, #203a43 0%, #2c5364 40%, #1a252f 100%); 
}
.bg-snow { 
  background: linear-gradient(160deg, #e6e9f0 0%, #eef1f5 30%, #d4d9e0 70%, #a8b5c4 100%); 
}
.bg-thunder { 
  background: linear-gradient(160deg, #141e30 0%, #243b55 40%, #0f1419 100%); 
}
.bg-fog { 
  background: linear-gradient(160deg, #757f9a 0%, #d7dde8 50%, #9ba4b0 100%); 
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.2) 100%);
  z-index: 1;
}

.vignette-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 100%);
  pointer-events: none;
  z-index: 100;
}

/* ===== STARS ===== */
.stars-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 70%;
  z-index: 2;
}

.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: twinkle ease-in-out infinite;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* ===== SUN ===== */
.sun-container {
  position: absolute;
  top: 10%;
  right: 10%;
  z-index: 2;
}

.sun {
  position: relative;
  width: 120px;
  height: 120px;
}

.sun-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, #fff5e6 0%, #ffd699 40%, #ff9933 100%);
  border-radius: 50%;
  box-shadow: 
    0 0 40px rgba(255, 200, 100, 0.8),
    0 0 80px rgba(255, 150, 50, 0.6),
    0 0 120px rgba(255, 100, 0, 0.4);
  animation: sunPulse 4s ease-in-out infinite;
}

.sun-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(255, 220, 150, 0.3) 10deg,
    transparent 20deg,
    rgba(255, 220, 150, 0.3) 30deg,
    transparent 40deg,
    rgba(255, 220, 150, 0.3) 50deg,
    transparent 60deg,
    rgba(255, 220, 150, 0.3) 70deg,
    transparent 80deg,
    rgba(255, 220, 150, 0.3) 90deg,
    transparent 100deg,
    rgba(255, 220, 150, 0.3) 110deg,
    transparent 120deg,
    rgba(255, 220, 150, 0.3) 130deg,
    transparent 140deg,
    rgba(255, 220, 150, 0.3) 150deg,
    transparent 160deg,
    rgba(255, 220, 150, 0.3) 170deg,
    transparent 180deg,
    rgba(255, 220, 150, 0.3) 190deg,
    transparent 200deg,
    rgba(255, 220, 150, 0.3) 210deg,
    transparent 220deg,
    rgba(255, 220, 150, 0.3) 230deg,
    transparent 240deg,
    rgba(255, 220, 150, 0.3) 250deg,
    transparent 260deg,
    rgba(255, 220, 150, 0.3) 270deg,
    transparent 280deg,
    rgba(255, 220, 150, 0.3) 290deg,
    transparent 300deg,
    rgba(255, 220, 150, 0.3) 310deg,
    transparent 320deg,
    rgba(255, 220, 150, 0.3) 330deg,
    transparent 340deg,
    rgba(255, 220, 150, 0.3) 350deg,
    transparent 360deg
  );
  animation: sunRotate 20s linear infinite;
}

@keyframes sunPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.05); }
}

@keyframes sunRotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.heat-haze {
  position: absolute;
  top: 100%;
  left: -50%;
  width: 200%;
  height: 200px;
  background: linear-gradient(to bottom, rgba(255, 200, 100, 0.2), transparent);
  filter: blur(40px);
  animation: hazeMove 3s ease-in-out infinite;
}

@keyframes hazeMove {
  0%, 100% { transform: translateY(0) scaleY(1); opacity: 0.3; }
  50% { transform: translateY(-20px) scaleY(1.1); opacity: 0.5; }
}

/* ===== MOON ===== */
.moon-container {
  position: absolute;
  top: 10%;
  right: 15%;
  z-index: 2;
}

.moon {
  position: relative;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle at 30% 30%, #f5f5f5 0%, #d0d0d0 50%, #a0a0a0 100%);
  border-radius: 50%;
  box-shadow: 
    0 0 30px rgba(255, 255, 255, 0.5),
    0 0 60px rgba(255, 255, 255, 0.3),
    inset -10px -10px 20px rgba(0, 0, 0, 0.1);
  animation: moonGlow 4s ease-in-out infinite;
}

.moon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.moon-crater {
  position: absolute;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.crater-1 {
  width: 15px;
  height: 15px;
  top: 20%;
  left: 30%;
}

.crater-2 {
  width: 10px;
  height: 10px;
  top: 50%;
  left: 60%;
}

.crater-3 {
  width: 8px;
  height: 8px;
  top: 65%;
  left: 25%;
}

@keyframes moonGlow {
  0%, 100% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 255, 255, 0.3), inset -10px -10px 20px rgba(0, 0, 0, 0.1); }
  50% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.6), 0 0 80px rgba(255, 255, 255, 0.4), inset -10px -10px 20px rgba(0, 0, 0, 0.1); }
}

/* ===== CLOUDS ===== */
.clouds-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  z-index: 3;
}

.cloud {
  position: absolute;
  animation: cloudFloat linear infinite;
}

.cloud-part {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
}

.cloud.dark .cloud-part {
  background: rgba(100, 110, 120, 0.9);
}

.cloud.fluffy .cloud-part {
  background: rgba(255, 255, 255, 0.95);
}

.cloud-part-1 {
  width: 80px;
  height: 40px;
  top: 20px;
}

.cloud-part-2 {
  width: 60px;
  height: 60px;
  top: 0;
  left: 15px;
}

.cloud-part-3 {
  width: 50px;
  height: 40px;
  top: 15px;
  left: 50px;
}

@keyframes cloudFloat {
  0% { transform: translateX(-200px); }
  100% { transform: translateX(calc(100vw + 200px)); }
}

/* ===== RAIN ===== */
.rain-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
  pointer-events: none;
}

.rain-drop {
  position: absolute;
  top: -20px;
  width: 2px;
  height: 20px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.6));
  border-radius: 0 0 2px 2px;
  animation: rainFall linear infinite;
}

@keyframes rainFall {
  0% { transform: translateY(0) translateX(0); }
  100% { transform: translateY(105vh) translateX(-10px); }
}

.rain-splash {
  position: absolute;
  width: 8px;
  height: 4px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  animation: splash 0.4s ease-out infinite;
  opacity: 0;
}

@keyframes splash {
  0% { transform: scale(0); opacity: 0.8; }
  50% { transform: scale(1.5); opacity: 0.4; }
  100% { transform: scale(2); opacity: 0; }
}

/* ===== SNOW ===== */
.snow-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
  pointer-events: none;
}

.snowflake {
  position: absolute;
  top: -20px;
  color: white;
  opacity: 0.8;
  animation: snowFall linear infinite;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
}

@keyframes snowFall {
  0% { 
    transform: translateY(0) translateX(0) rotate(0deg); 
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% { 
    transform: translateY(105vh) translateX(calc(50px * var(--sway, 1))) rotate(360deg); 
    opacity: 0;
  }
}

/* ===== ICE CRYSTALS ===== */
.ice-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  pointer-events: none;
}

.ice-crystal {
  position: absolute;
  color: rgba(255, 255, 255, 0.9);
  animation: iceShimmer ease-in-out infinite;
  text-shadow: 0 0 10px rgba(200, 230, 255, 0.8);
}

@keyframes iceShimmer {
  0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
}

/* ===== FROST EDGES ===== */
.frost-edges {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 6;
  pointer-events: none;
  overflow: hidden;
}

.frost-top, .frost-bottom, .frost-left, .frost-right {
  position: absolute;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), transparent);
}

.frost-top {
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), transparent);
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cpath d='M0,0 Q25,30 50,10 T100,0 L100,100 L0,100 Z' fill='black'/%3E%3C/svg%3E");
  mask-size: 200px 100%;
}

.frost-bottom {
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.3), transparent);
}

/* ===== FOG ===== */
.fog-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
  pointer-events: none;
}

.fog-layer {
  position: absolute;
  top: 0;
  left: -50%;
  width: 200%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.3) 25%, 
    rgba(255, 255, 255, 0.5) 50%, 
    rgba(255, 255, 255, 0.3) 75%, 
    transparent 100%
  );
  filter: blur(40px);
  animation: fogDrift linear infinite;
}

.fog-layer-1 {
  animation-duration: 25s;
  opacity: 0.4;
  top: 20%;
}

.fog-layer-2 {
  animation-duration: 35s;
  animation-delay: -10s;
  opacity: 0.3;
  top: 40%;
}

.fog-layer-3 {
  animation-duration: 45s;
  animation-delay: -20s;
  opacity: 0.2;
  top: 60%;
}

@keyframes fogDrift {
  0% { transform: translateX(-25%); }
  100% { transform: translateX(25%); }
}

/* ===== LIGHTNING ===== */
.lightning-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  pointer-events: none;
}

.lightning {
  position: absolute;
  width: 4px;
  height: 60%;
  background: linear-gradient(to bottom, 
    transparent 0%, 
    rgba(255, 255, 255, 0.9) 20%, 
    rgba(255, 255, 255, 1) 50%, 
    rgba(200, 220, 255, 0.9) 80%, 
    transparent 100%
  );
  filter: blur(1px) drop-shadow(0 0 10px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 20px rgba(150, 200, 255, 0.6));
  opacity: 0;
  animation: lightningStrike ease-out infinite;
}

.lightning-1 {
  left: 30%;
  top: 5%;
  transform: rotate(15deg);
  animation-duration: 4s;
  animation-delay: 0s;
}

.lightning-2 {
  left: 60%;
  top: 0;
  transform: rotate(-10deg);
  animation-duration: 5s;
  animation-delay: 1.5s;
}

.lightning-3 {
  left: 45%;
  top: 10%;
  transform: rotate(5deg);
  animation-duration: 6s;
  animation-delay: 3s;
}

@keyframes lightningStrike {
  0%, 90%, 100% { opacity: 0; }
  92% { opacity: 1; }
  93% { opacity: 0.2; }
  94% { opacity: 1; }
  96% { opacity: 0; }
}
</style>
