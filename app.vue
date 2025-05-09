<template>
  <div>
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading DBT App...</p>
    </div>
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useModulesStore } from '~/store/modules';
import { useUserStore } from '~/store/user';

const loading = ref(true);
const modulesStore = useModulesStore();
const userStore = useUserStore();

// Initialize data from the API
onMounted(async () => {
  try {
    // Fetch user data
    await userStore.fetchUser();
    
    // Fetch modules data
    await modulesStore.fetchModules();
    
    // Update user streak
    await userStore.checkAndUpdateStreak();
  } catch (error) {
    console.error('Error initializing app data:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--bg-color);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

:root {
  --primary-color: #5B86E5;
  --secondary-color: #36D1DC;
  --accent-color: #FF9F5B;
  --success-color: #4CAF50;
  --warning-color: #FF9800;
  --error-color: #F44336;
  --text-color: #333333;
  --bg-color: #F8F9FA;
  --card-bg: #FFFFFF;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 50px;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: center;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.card {
  background-color: var(--card-bg);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>
