<script setup lang="ts">
import { ref } from 'vue';
import { Search, MapPin, Loader2 } from 'lucide-vue-next';
import { useGeo } from '../composables/useGeo';
import type { GeoLocation } from '../types/weather';

const emit = defineEmits<{
  (e: 'select', location: GeoLocation): void
}>();

const query = ref('');
const { locations, loading, searchLocation, clearLocations } = useGeo();
let debounceTimeout: any;

const onInput = () => {
  clearTimeout(debounceTimeout);
  if (query.value.length < 2) {
    clearLocations();
    return;
  }
  
  debounceTimeout = setTimeout(() => {
    searchLocation(query.value);
  }, 500);
};

const selectLocation = (loc: GeoLocation) => {
  emit('select', loc);
  query.value = ''; // Keep query or clear it? Let's clear and show selected elsewhere
  clearLocations();
};
</script>

<template>
  <div class="search-container">
    <div class="search-input-wrapper">
      <Search class="search-icon" :size="20" />
      <input 
        v-model="query"
        type="text" 
        placeholder="Search for a city..." 
        @input="onInput"
        class="search-input"
      />
      <Loader2 v-if="loading" class="spinner" :size="20" />
    </div>

    <div v-if="locations.length > 0" class="search-results glass-card">
      <div 
        v-for="loc in locations" 
        :key="loc.id" 
        class="search-item"
        @click="selectLocation(loc)"
      >
        <MapPin :size="16" class="item-icon" />
        <div class="item-details">
          <span class="city">{{ loc.name }}</span>
          <span class="region">
            {{ loc.admin1 ? `${loc.admin1}, ` : '' }}{{ loc.country }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  z-index: 100;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
}

.spinner {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
  animation: spin 1s linear infinite;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-height: 300px;
  overflow-y: auto;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
}

.search-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.item-icon {
  color: var(--color-accent);
}

.item-details {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.city {
  font-weight: 600;
  font-size: 1rem;
}

.region {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

@keyframes spin {
  from { transform: translateY(-50%) rotate(0deg); }
  to { transform: translateY(-50%) rotate(360deg); }
}
</style>
