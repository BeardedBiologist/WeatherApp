import axios from 'axios';
import { ref } from 'vue';
import type { GeoLocation } from '../types/weather';

export function useGeo() {
  const locations = ref<GeoLocation[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const searchLocation = async (query: string) => {
    if (!query || query.length < 2) return;
    
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
        params: {
          name: query,
          count: 5,
          language: 'en',
          format: 'json'
        }
      });

      if (response.data.results) {
        locations.value = response.data.results;
      } else {
        locations.value = [];
      }
    } catch (e: any) {
      console.error(e);
      error.value = 'Failed to search location.';
    } finally {
      loading.value = false;
    }
  };

  const clearLocations = () => {
    locations.value = [];
  };

  return {
    locations,
    loading,
    error,
    searchLocation,
    clearLocations
  };
}
