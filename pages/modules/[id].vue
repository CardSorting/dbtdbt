<template>
  <div class="module-detail-page" v-if="module">
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
            :progress="module.progress" 
            :backgroundColor="module.color" 
            :label="`${module.progress}% Complete`" 
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
  <div v-else class="module-not-found">
    <h2>Module Not Found</h2>
    <p>Sorry, the module you are looking for does not exist or is not available.</p>
    <NuxtLink to="/modules" class="btn">Return to Modules</NuxtLink>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useModulesStore } from '@/store/modules';
import { useUserStore } from '@/store/user';
import ProgressBar from '@/components/shared/ProgressBar.vue';
import LessonCard from '@/components/lessons/LessonCard.vue';

const route = useRoute();
const router = useRouter();
const modulesStore = useModulesStore();
const userStore = useUserStore();

const moduleId = route.params.id;
const module = ref(null);

onMounted(() => {
  // Find the module with the matching ID
  const foundModule = modulesStore.modules.find(m => m.id === moduleId);
  
  if (foundModule) {
    if (!foundModule.unlocked) {
      // If module is locked, redirect to modules page
      router.push('/modules');
      return;
    }
    
    module.value = foundModule;
    modulesStore.setCurrentModule(moduleId);
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
