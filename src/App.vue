<script setup lang="ts">
// We will import components here later
</script>

<template>
  <main class="dashboard">
    <header class="header">
      <h1>Weather Dashboard</h1>
    </header>

    <div class="content">
      <!-- Weather content will go here -->
      <p class="placeholder-text">Enter a city to see the forecast...</p>
    </div>
  </main>
</template>

<style scoped>
.dashboard {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header h1 {
  font-size: 2.5rem;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.placeholder-text {
  font-size: 1.2rem;
  color: var(--color-text-muted);
}
</style>
