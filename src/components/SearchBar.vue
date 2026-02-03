<script setup lang="ts">
import { ref } from 'vue';
import { Search, MapPin, Loader2, Navigation } from 'lucide-vue-next';
import { useGeo } from '../composables/useGeo';
import type { GeoLocation } from '../types/weather';

const emit = defineEmits<{
  (e: 'select', location: GeoLocation): void
}>();

const query = ref('');
const { locations, loading, searchLocation, clearLocations } = useGeo();
let debounceTimeout: ReturnType<typeof setTimeout>;

const onInput = () => {
  clearTimeout(debounceTimeout);
  if (query.value.length < 2) {
    clearLocations();
    return;
  }
  
  debounceTimeout = setTimeout(() => {
    searchLocation(query.value);
  }, 400);
};

const selectLocation = (loc: GeoLocation) => {
  emit('select', loc);
  query.value = '';
  clearLocations();
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    clearLocations();
  }
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
        @keydown="handleKeydown"
        class="search-input"
        autocomplete="off"
      />
      <Loader2 v-if="loading" class="spinner" :size="20" />
      <Navigation v-else-if="query.length === 0" class="location-icon" :size="18" />
    </div>

    <Transition name="slide-down">
      <div v-if="locations.length > 0" class="search-results">
        <div 
          v-for="loc in locations" 
          :key="loc.id" 
          class="search-item"
          @click="selectLocation(loc)"
        >
          <div class="item-icon-wrapper">
            <MapPin :size="18" class="item-icon" />
          </div>
          <div class="item-details">
            <span class="city">{{ loc.name }}</span>
            <span class="region">
              {{ loc.admin1 ? `${loc.admin1}, ` : '' }}{{ loc.country }}
            </span>
          </div>
          <div class="select-indicator">
            <span>Select</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 480px;
  z-index: 100;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 3rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.search-input:focus {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 
    0 0 0 4px rgba(255, 255, 255, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.3);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-icon {
  position: absolute;
  left: 1.125rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
  transition: color 0.3s ease;
}

.search-input:focus + .search-icon,
.search-input-wrapper:focus-within .search-icon {
  color: rgba(255, 255, 255, 0.9);
}

.spinner {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
  animation: spin 1s linear infinite;
}

.location-icon {
  position: absolute;
  right: 1.125rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
}

@keyframes spin {
  from { transform: translateY(-50%) rotate(0deg); }
  to { transform: translateY(-50%) rotate(360deg); }
}

/* Search Results Dropdown */
.search-results {
  position: absolute;
  top: calc(100% + 0.75rem);
  left: 0;
  right: 0;
  background: rgba(20, 20, 35, 0.95);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;
  padding: 0.5rem;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}

.search-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.search-item:active {
  transform: scale(0.98);
}

.item-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  border-radius: 10px;
  flex-shrink: 0;
}

.item-icon {
  color: white;
}

.item-details {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
  flex: 1;
  min-width: 0;
}

.city {
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.region {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select-indicator {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 500;
  opacity: 0;
  transition: all 0.2s ease;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
}

.search-item:hover .select-indicator {
  opacity: 1;
  color: rgba(255, 255, 255, 0.8);
}

/* Transition animations */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

/* Mobile */
@media (max-width: 480px) {
  .search-container {
    max-width: 100%;
  }
  
  .search-input {
    padding: 0.875rem 2.75rem 0.875rem 2.75rem;
    font-size: 0.95rem;
  }
  
  .search-icon {
    left: 1rem;
  }
  
  .spinner,
  .location-icon {
    right: 0.875rem;
  }
  
  .search-results {
    border-radius: 16px;
    padding: 0.375rem;
  }
  
  .search-item {
    padding: 0.75rem 0.875rem;
  }
}
</style>
