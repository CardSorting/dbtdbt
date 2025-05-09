<template>
  <!-- Loading state -->
  <div v-if="loading" class="loading-container">
    <div class="loading-spinner"></div>
    <p>Loading module...</p>
  </div>
  
  <!-- Error state -->
  <div v-else-if="error" class="module-not-found">
    <h2>Error Loading Module</h2>
    <p>{{ error }}</p>
    <NuxtLink to="/modules" class="btn">Return to Modules</NuxtLink>
  </div>
  
  <!-- Module content -->
  <div class="module-detail-page" v-else-if="module">
    <div class="module-header" :style="{ backgroundColor: module.color + '10' }">
      <div class="module-icon" :style="{ backgroundColor: module.color }">
        <span class="icon" :class="module.icon"></span>
      </div>
      <div class="module-info">
        <h1>{{ module.title }}</h1>
        <p>{{ module.description }}</p>
        
        <div class="progress-info">
          <div class="progress-stats">
            <div class="stat">
              <span class="stat-value">{{ completedLessons }}/{{ module.lessons.length }}</span>
              <span class="stat-label">Lessons Completed</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ totalXP }}</span>
              <span class="stat-label">Total XP</span>
            </div>
          </div>
          <ProgressBar 
            :progress="module.progress || 0" 
            :backgroundColor="module.color" 
            :label="`${module.progress || 0}% Complete`" 
          />
        </div>
      </div>
    </div>
    
    <div class="lessons-container">
      <h2>Module Lessons</h2>
      <p class="lessons-intro">Complete the lessons below to master the skills in this module.</p>
      
      <div class="lessons-list">
        <LessonCard 
          v-for="lesson in module.lessons" 
          :key="lesson.id" 
          :lesson="lesson" 
          :moduleId="module.id" 
        />
      </div>
    </div>
    
    <div class="module-actions">
      <button 
        v-if="hasCompletedLessons" 
        class="btn" 
        @click="resetModuleProgress"
      >
        Reset Progress
      </button>
    </div>
  </div>
  
  <!-- Module not found -->
  <div v-else class="module-not-found">
    <h2>Module Not Found</h2>
    <p>Sorry, the module you are looking for does not exist or is not available.</p>
    <NuxtLink to="/modules" class="btn">Return to Modules</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useModulesStore } from '~/store/modules';
import { useUserStore } from '~/store/user';
import ProgressBar from '~/components/shared/ProgressBar.vue';
import LessonCard from '~/components/lessons/LessonCard.vue';

const route = useRoute();
const router = useRouter();
const modulesStore = useModulesStore();
const userStore = useUserStore();
const loading = ref(true);
const error = ref(null);

const moduleId = route.params.id as string;
const module = ref(null);

onMounted(async () => {
  try {
    loading.value = true;
    
    // Fetch the module with its lessons from the API
    const fetchedModule = await modulesStore.fetchModule(moduleId);
    
    if (fetchedModule) {
      if (!fetchedModule.unlocked) {
        // If module is locked, redirect to modules page
        router.push('/modules');
        return;
      }
      
      module.value = fetchedModule;
      modulesStore.setCurrentModule(moduleId);
    }
  } catch (err: any) {
    console.error('Error loading module:', err);
    error.value = err.message || 'Failed to load module';
  } finally {
    loading.value = false;
  }
});

const completedLessons = computed(() => {
  if (!module.value) return 0;
  return module.value.lessons.filter(l => l.completed).length;
});

const totalXP = computed(() => {
  if (!module.value) return 0;
  return module.value.lessons
    .filter(l => l.completed)
    .reduce((sum, lesson) => sum + lesson.xpReward, 0);
});

const hasCompletedLessons = computed(() => {
  return completedLessons.value > 0;
});

const resetModuleProgress = () => {
  if (confirm('Are you sure you want to reset your progress for this module? This action cannot be undone.')) {
    // Reset progress for this module
    const moduleIndex = modulesStore.modules.findIndex(m => m.id === moduleId);
    if (moduleIndex >= 0) {
      const currentModule = modulesStore.modules[moduleIndex];
      currentModule.progress = 0;
      currentModule.lessons.forEach(lesson => {
        lesson.completed = false;
      });
      
      // Update user's total XP and overall progress
      userStore.updateOverallProgress(modulesStore.getOverallProgress);
    }
  }
};
</script>

<style scoped>
.module-detail-page {
  padding-bottom: 3rem;
}

.module-header {
  display: flex;
  gap: 2rem;
  align-items: center;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.module-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  flex-shrink: 0;
}

.module-info {
  flex: 1;
}

.module-info h1 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.module-info p {
  color: #666;
  margin-bottom: 1.5rem;
}

.progress-info {
  max-width: 500px;
}

.progress-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.lessons-container {
  margin-bottom: 3rem;
}

.lessons-container h2 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.lessons-intro {
  color: #666;
  margin-bottom: 2rem;
}

.module-actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.module-not-found {
  text-align: center;
  padding: 3rem 1rem;
}

.module-not-found h2 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.module-not-found p {
  color: #666;
  margin-bottom: 2rem;
}

/* Loading styles */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  padding: 3rem;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Icon styles */
.icon {
  width: 32px;
  height: 32px;
  background-position: center;
  background-size: contain;
}

.mindfulness::before {
  content: "🧘";
}

.distress-tolerance::before {
  content: "🌊";
}

.emotion-regulation::before {
  content: "❤️";
}

.interpersonal-effectiveness::before {
  content: "🤝";
}

@media (max-width: 768px) {
  .module-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
    gap: 1rem;
  }
  
  .module-info h1 {
    font-size: 1.8rem;
  }
  
  .progress-stats {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
