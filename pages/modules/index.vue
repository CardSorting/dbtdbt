<template>
  <div class="modules-page">
    <h1 class="page-title">DBT Skill Modules</h1>
    <p class="page-description">
      Choose a module to begin learning. Each module contains a series of lessons focused on different DBT skills.
    </p>
    
    <!-- User Progress Overview -->
    <div class="progress-overview">
      <div class="progress-card card">
        <div class="progress-stats">
          <div class="stat">
            <span class="stat-value">{{ userStore.skillsLearned }}</span>
            <span class="stat-label">Skills Learned</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ userStore.streak }}</span>
            <span class="stat-label">Days Streak</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ userStore.overallProgress }}%</span>
            <span class="stat-label">Overall Progress</span>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: userStore.overallProgress + '%' }"></div>
        </div>
      </div>
    </div>

    <div v-if="modulesStore.isLoading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading modules...</p>
    </div>
    
    <div v-else-if="modulesStore.error" class="error-message">
      <p>{{ modulesStore.error }}</p>
      <button @click="modulesStore.fetchModules()" class="btn">Try Again</button>
    </div>
    
    <div v-else class="modules-container">
      <div 
        v-for="module in sortedModules" 
        :key="module.id" 
        class="module-card card"
        :class="{ 'locked': !module.unlocked }"
      >
        <div class="module-header">
          <div class="module-icon" :class="module.id"></div>
          <h2>{{ module.title }}</h2>
          <span v-if="!module.unlocked" class="locked-badge">Locked</span>
        </div>
        <div class="module-content">
          <p>{{ module.description }}</p>
          
          <div v-if="module.unlocked" class="module-progress">
            <span class="progress-text">{{ getModuleProgress(module.id) }}% Complete</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: getModuleProgress(module.id) + '%' }"></div>
            </div>
          </div>
        </div>
        <div class="module-footer">
          <NuxtLink 
            v-if="module.unlocked" 
            :to="'/modules/' + module.id" 
            class="btn"
          >
            Start Learning
          </NuxtLink>
          <button 
            v-else 
            class="btn locked-btn" 
            disabled
          >
            Complete Previous Module
          </button>
        </div>
      </div>
    </div>

    <div class="learning-path card">
      <h2>Recommended Learning Path</h2>
      <div class="path-steps">
        <div 
          v-for="(module, index) in sortedModules" 
          :key="module.id"
          class="path-step"
        >
          <div class="step-icon" :class="module.id"></div>
          <div class="step-content">
            <h3>{{ index + 1 }}. {{ module.title }}</h3>
            <p>{{ module.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModulesStore } from '~/store/modules';
import { useUserStore } from '~/store/user';

const modulesStore = useModulesStore();
const userStore = useUserStore();

// Computed property to get modules sorted by order
const sortedModules = computed(() => {
  return [...modulesStore.modules].sort((a, b) => a.order - b.order);
});

// Function to get module progress
const getModuleProgress = (moduleId: string) => {
  return modulesStore.getModuleProgress(moduleId);
};
</script>

<style scoped>
.modules-page {
  padding-bottom: 3rem;
}

.page-title {
  font-size: 2.2rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.page-description {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.progress-overview {
  margin-bottom: 2rem;
}

.progress-card {
  padding: 1.5rem;
}

.progress-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1.5rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.progress-bar {
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  transition: width 0.5s ease;
}

.modules-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.module-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.module-card.locked {
  opacity: 0.7;
  position: relative;
}

.locked-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: var(--error-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.module-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  gap: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  position: relative;
}

.module-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  flex-shrink: 0;
}

.module-icon.mindfulness {
  background: linear-gradient(45deg, #9C27B0, #673AB7);
}

.module-icon.distress-tolerance {
  background: linear-gradient(45deg, #FF5722, #FF9800);
}

.module-icon.emotion-regulation {
  background: linear-gradient(45deg, #4CAF50, #8BC34A);
}

.module-icon.interpersonal-effectiveness {
  background: linear-gradient(45deg, #2196F3, #03A9F4);
}

.module-header h2 {
  margin: 0;
  font-size: 1.3rem;
}

.module-content {
  padding: 1.5rem;
  flex-grow: 1;
}

.module-content p {
  margin-bottom: 1.5rem;
}

.skills-list {
  margin-bottom: 1.5rem;
}

.skill-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
}

.skill-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #e9ecef;
  margin-right: 0.8rem;
  flex-shrink: 0;
}

.module-progress {
  margin-top: 1rem;
}

.progress-text {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.module-footer {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  text-align: center;
}

.locked-btn {
  opacity: 0.6;
  cursor: not-allowed;
  background: linear-gradient(to right, #888, #aaa);
}

.learning-path {
  padding: 2rem;
}

.learning-path h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary-color);
}

.path-steps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.path-step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.step-icon.mindfulness {
  background: linear-gradient(45deg, #9C27B0, #673AB7);
}

.step-icon.distress-tolerance {
  background: linear-gradient(45deg, #FF5722, #FF9800);
}

.step-icon.emotion-regulation {
  background: linear-gradient(45deg, #4CAF50, #8BC34A);
}

.step-icon.interpersonal-effectiveness {
  background: linear-gradient(45deg, #2196F3, #03A9F4);
}

.step-content h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  color: var(--primary-color);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-message {
  padding: 2rem;
  text-align: center;
  color: var(--error-color);
}

.error-message button {
  margin-top: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .progress-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .path-step {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
