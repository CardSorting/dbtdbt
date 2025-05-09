<template>
  <!-- Loading state -->
  <div v-if="loading" class="loading-container">
    <div class="loading-spinner"></div>
    <p>Loading lesson...</p>
  </div>
  
  <!-- Error state -->
  <div v-else-if="error" class="lesson-not-found">
    <h2>Error Loading Lesson</h2>
    <p>{{ error }}</p>
    <NuxtLink to="/modules" class="btn">Return to Modules</NuxtLink>
  </div>
  
  <div class="lesson-page" v-else-if="lesson && module">
    <!-- Lesson navigation and progress -->
    <div class="lesson-nav" :style="{ borderColor: module.color }">
      <NuxtLink 
        :to="`/modules/${module.id}`" 
        class="back-link"
      >
        ← Back to Module
      </NuxtLink>
      <div class="lesson-progress">
        <span>{{ lessonIndexDisplay }}</span>
        <ProgressBar 
          :progress="lessonProgressPercentage"
          :backgroundColor="module.color"
          :showLabel="false"
        />
      </div>
    </div>

    <!-- Lesson header -->
    <div class="lesson-header">
      <h1>{{ lesson.title }}</h1>
      <div class="lesson-meta">
        <div class="lesson-type" :class="lesson.type">
          {{ formatLessonType(lesson.type) }}
        </div>
        <div class="xp-reward">
          <span class="xp-icon">⭐</span>
          <span>{{ lesson.xpReward }} XP</span>
        </div>
      </div>
    </div>

    <!-- Lesson content -->
    <div class="lesson-content card fade-in">
      <!-- Theory text content -->
      <div v-if="lesson.content.text" class="content-text">
        <p v-for="(paragraph, index) in lesson.content.text" :key="index" class="paragraph">
          {{ paragraph }}
        </p>
      </div>

      <!-- Exercises -->
      <div v-if="lesson.content.exercises" class="content-exercises">
        <div 
          v-for="exercise in lesson.content.exercises" 
          :key="exercise.id"
          class="exercise-item card"
        >
          <div class="exercise-header">
            <h3>Practice Exercise</h3>
            <div class="exercise-type-badge" :class="exercise.type">
              {{ formatExerciseType(exercise.type) }}
            </div>
          </div>
          <p class="exercise-instructions">{{ exercise.instructions }}</p>
          
          <div v-if="exercise.type === 'breathing'" class="breathing-exercise">
            <div class="breathing-animation" :class="{ active: breathingActive }">
              <div class="circle"></div>
              <div class="instruction">{{ breathingState }}</div>
              <div class="timer" v-if="breathingActive">{{ formatTime(breathingTimer) }}</div>
            </div>
            <button 
              v-if="!breathingActive" 
              @click="startBreathingExercise(exercise.duration)" 
              class="btn"
            >
              Start Exercise
            </button>
          </div>
          
          <div v-if="exercise.type === 'reflection'" class="reflection-exercise">
            <textarea 
              v-model="reflectionText[exercise.id]" 
              placeholder="Write your reflections here..."
              rows="4"
              class="reflection-input"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Scenarios -->
      <div v-if="lesson.content.scenarios" class="content-scenarios">
        <div 
          v-for="(scenario, sIndex) in lesson.content.scenarios" 
          :key="scenario.id"
          class="scenario-item card"
        >
          <h3>Scenario</h3>
          <p class="scenario-situation">{{ scenario.situation }}</p>
          
          <div class="scenario-options">
            <div
              v-for="(option, oIndex) in scenario.options"
              :key="oIndex"
              class="scenario-option"
              :class="{ 
                'selected': scenarioSelections[scenario.id] === oIndex,
                'show-feedback': showScenarioFeedback[scenario.id]
              }"
              @click="selectScenarioOption(scenario.id, oIndex)"
            >
              <div class="option-text">{{ option }}</div>
              <div 
                v-if="showScenarioFeedback[scenario.id] && scenarioSelections[scenario.id] === oIndex" 
                class="option-feedback"
              >
                {{ scenario.feedback[oIndex] }}
              </div>
            </div>
          </div>
          
          <button 
            v-if="scenarioSelections[scenario.id] !== undefined && !showScenarioFeedback[scenario.id]"
            @click="showFeedback(scenario.id)"
            class="btn feedback-btn"
          >
            See Feedback
          </button>
        </div>
      </div>
    </div>

    <!-- Lesson completion -->
    <div class="lesson-completion card" v-if="!isLessonCompleted">
      <div class="completion-message">
        <h2>Ready to complete this lesson?</h2>
        <p>Once you mark this lesson as complete, you'll earn {{ lesson.xpReward }} XP and unlock your progress.</p>
      </div>
      <button @click="completeLesson" class="btn complete-btn">
        Mark as Complete
      </button>
    </div>
    
    <div class="lesson-completion card completed" v-else>
      <div class="completion-message">
        <h2>Lesson Completed! 🎉</h2>
        <p>You've earned {{ lesson.xpReward }} XP for this lesson.</p>
      </div>
    </div>

    <!-- Lesson navigation buttons -->
    <div class="lesson-navigation">
      <NuxtLink 
        v-if="previousLessonId" 
        :to="`/modules/${module.id}/lessons/${previousLessonId}`" 
        class="btn btn-outline prev-btn"
      >
        Previous Lesson
      </NuxtLink>
      <div class="spacer" v-else></div>
      
      <NuxtLink 
        :to="`/modules/${module.id}`" 
        class="btn btn-outline module-btn"
      >
        Back to Module
      </NuxtLink>
      
      <NuxtLink 
        v-if="nextLessonId" 
        :to="`/modules/${module.id}/lessons/${nextLessonId}`" 
        class="btn next-btn"
      >
        Next Lesson
      </NuxtLink>
      <div class="spacer" v-else></div>
    </div>
  </div>
  <div v-else class="lesson-not-found">
    <h2>Lesson Not Found</h2>
    <p>Sorry, the lesson you are looking for does not exist or is not available.</p>
    <NuxtLink to="/modules" class="btn">Return to Modules</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useModulesStore } from '~/store/modules';
import { useUserStore } from '~/store/user';
import ProgressBar from '~/components/shared/ProgressBar.vue';

const route = useRoute();
const router = useRouter();
const modulesStore = useModulesStore();
const userStore = useUserStore();

const moduleId = route.params.id as string;
const lessonId = route.params.lessonId as string;

const module = ref<any>(null);
const lesson = ref<any>(null);
const lessonIndex = ref(-1);
const loading = ref(true);
const error = ref<string | null>(null);

// For breathing exercises
const breathingActive = ref(false);
const breathingTimer = ref(0);
const breathingState = ref('Breathe');

// For reflection exercises
const reflectionText = reactive<Record<string, string>>({});

// For scenarios
const scenarioSelections = reactive<Record<string, number>>({});
const showScenarioFeedback = reactive<Record<string, boolean>>({});

// Watch for route changes to reload data
watch(
  () => route.params,
  async (newParams) => {
    if (newParams.id !== moduleId || newParams.lessonId !== lessonId) {
      await loadData();
    }
  }
);

// Load module and lesson data
const loadData = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // First fetch the module
    const fetchedModule = await modulesStore.fetchModule(moduleId);
    
    if (!fetchedModule) {
      router.push('/modules');
      return;
    }
    
    if (!fetchedModule.unlocked) {
      router.push('/modules');
      return;
    }
    
    module.value = fetchedModule;
    modulesStore.setCurrentModule(moduleId);
    
    // Find the lesson in this module
    const foundLessonIndex = fetchedModule.lessons.findIndex((l: any) => l.id === lessonId);
    
    if (foundLessonIndex >= 0) {
      lesson.value = fetchedModule.lessons[foundLessonIndex];
      lessonIndex.value = foundLessonIndex;
      modulesStore.setCurrentLesson(lessonId);
    } else {
      // If we can't find the lesson in the module, try to fetch it directly
      try {
        const api = useApi();
        const lessonData = await api.fetchLesson(lessonId);
        
        if (lessonData) {
          lesson.value = lessonData;
          
          // Try to find the index again
          const lessons = fetchedModule.lessons || [];
          lessonIndex.value = lessons.findIndex((l: any) => l.id === lessonId);
          
          modulesStore.setCurrentLesson(lessonId);
        } else {
          router.push(`/modules/${moduleId}`);
        }
      } catch (err: any) {
        console.error('Error fetching lesson:', err);
        error.value = err.message || 'Failed to load lesson';
        router.push(`/modules/${moduleId}`);
      }
    }
  } catch (err: any) {
    console.error('Error loading data:', err);
    error.value = err.message || 'Failed to load module and lesson';
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);

// Computed properties for lesson navigation
const nextLessonId = computed(() => {
  if (!module.value || lessonIndex.value < 0 || lessonIndex.value >= module.value.lessons.length - 1) {
    return null;
  }
  return module.value.lessons[lessonIndex.value + 1].id;
});

const previousLessonId = computed(() => {
  if (!module.value || lessonIndex.value <= 0) {
    return null;
  }
  return module.value.lessons[lessonIndex.value - 1].id;
});

const lessonIndexDisplay = computed(() => {
  if (!module.value || lessonIndex.value < 0) {
    return '';
  }
  return `Lesson ${lessonIndex.value + 1} of ${module.value.lessons.length}`;
});

const lessonProgressPercentage = computed(() => {
  if (!module.value || lessonIndex.value < 0) {
    return 0;
  }
  return Math.round(((lessonIndex.value + 1) / module.value.lessons.length) * 100);
});

const isLessonCompleted = computed(() => {
  return userStore.isLessonCompleted(lessonId);
});

// Helper functions for formatting
const formatLessonType = (type: string) => {
  switch(type) {
    case 'theory': return 'Theory';
    case 'exercise': return 'Exercise';
    case 'practice': return 'Practice';
    case 'quiz': return 'Quiz';
    default: return 'Lesson';
  }
};

const formatExerciseType = (type: string) => {
  switch(type) {
    case 'breathing': return 'Breathing';
    case 'reflection': return 'Reflection';
    case 'journaling': return 'Journaling';
    case 'meditation': return 'Meditation';
    default: return 'Exercise';
  }
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
};

// Breathing exercise methods
const startBreathingExercise = (duration = 60) => {
  breathingActive.value = true;
  breathingTimer.value = duration || 60;
  breathingState.value = 'Breathe in...';
  
  const breathingInterval = setInterval(() => {
    breathingTimer.value--;
    
    // Alternate breathing instructions
    if (breathingTimer.value % 8 === 0) {
      breathingState.value = 'Breathe in...';
    } else if (breathingTimer.value % 4 === 0) {
      breathingState.value = 'Breathe out...';
    }
    
    if (breathingTimer.value <= 0) {
      clearInterval(breathingInterval);
      breathingActive.value = false;
      breathingState.value = 'Complete';
    }
  }, 1000);
};

// Scenario methods
const selectScenarioOption = (scenarioId: string, optionIndex: number) => {
  if (!showScenarioFeedback[scenarioId]) {
    scenarioSelections[scenarioId] = optionIndex;
  }
};

const showFeedback = (scenarioId: string) => {
  showScenarioFeedback[scenarioId] = true;
};

// Lesson completion method
const completeLesson = async () => {
  if (!lesson.value || !module.value || isLessonCompleted.value) return;
  
  try {
    loading.value = true;
    
    // Call the store action to complete the lesson
    const xpReward = await modulesStore.completeLesson(moduleId, lessonId);
    
    // Update user data
    if (xpReward) {
      // Force a refresh of user data to get updated stats
      await userStore.fetchUser();
    }
  } catch (err: any) {
    console.error('Error completing lesson:', err);
    error.value = err.message || 'Failed to complete lesson';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.lesson-page {
  padding-bottom: 3rem;
}

.lesson-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.back-link {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.back-link:hover {
  color: var(--primary-color);
}

.lesson-progress {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  width: 200px;
}

.lesson-header {
  margin-bottom: 2rem;
}

.lesson-header h1 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.lesson-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.lesson-type {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
}

.lesson-type.theory {
  background-color: #E3F2FD;
  color: #1976D2;
}

.lesson-type.exercise {
  background-color: #E8F5E9;
  color: #388E3C;
}

.lesson-type.practice {
  background-color: #FFF8E1;
  color: #FFA000;
}

.lesson-type.quiz {
  background-color: #F3E5F5;
  color: #7B1FA2;
}

.xp-reward {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
}

.xp-icon {
  color: #FFC107;
}

.lesson-content {
  margin-bottom: 2rem;
  padding: 2rem;
}

.content-text .paragraph {
  margin-bottom: 1.5rem;
  line-height: 1.7;
}

.content-exercises, .content-scenarios {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.exercise-item, .scenario-item {
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.exercise-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.exercise-type-badge {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
}

.exercise-type-badge.breathing {
  background-color: #E8F5E9;
  color: #388E3C;
}

.exercise-type-badge.reflection {
  background-color: #E3F2FD;
  color: #1976D2;
}

.exercise-instructions {
  margin-bottom: 1.5rem;
  font-style: italic;
}

.breathing-exercise {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.breathing-animation {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.breathing-animation .circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: rgba(91, 134, 229, 0.1);
  transition: all 4s ease;
}

.breathing-animation.active .circle {
  animation: breathe 8s infinite alternate;
}

@keyframes breathe {
  0% {
    transform: scale(1);
    background-color: rgba(91, 134, 229, 0.1);
  }
  50% {
    transform: scale(1.5);
    background-color: rgba(91, 134, 229, 0.3);
  }
  100% {
    transform: scale(1);
    background-color: rgba(91, 134, 229, 0.1);
  }
}

.breathing-animation .instruction {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: 500;
}

.breathing-animation .timer {
  margin-top: 0.5rem;
  font-size: 1rem;
  color: #666;
}

.reflection-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-family: inherit;
  resize: vertical;
}

.scenario-situation {
  margin-bottom: 1.5rem;
  font-style: italic;
}

.scenario-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.scenario-option {
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.scenario-option:hover {
  background-color: rgba(91, 134, 229, 0.05);
}

.scenario-option.selected {
  border-color: var(--primary-color);
  background-color: rgba(91, 134, 229, 0.1);
}

.scenario-option .option-text {
  font-weight: 500;
}

.scenario-option .option-feedback {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 0.9rem;
  line-height: 1.6;
}

.feedback-btn {
  margin-top: 1rem;
}

.lesson-completion {
  margin-bottom: 2rem;
  padding: 2rem;
  text-align: center;
}

.lesson-completion.completed {
  background-color: #f1f8e9;
  border-left: 4px solid var(--success-color);
}

.completion-message h2 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.completion-message p {
  margin-bottom: 1.5rem;
}

.complete-btn {
  padding: 12px 30px;
  font-size: 1.1rem;
}

.lesson-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.prev-btn, .next-btn, .module-btn {
  flex: 1;
  max-width: 200px;
  text-align: center;
}

.spacer {
  flex: 1;
  max-width: 200px;
}

.lesson-not-found {
  text-align: center;
  padding: 3rem 1rem;
}

.lesson-not-found h2 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.lesson-not-found p {
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

@media (max-width: 768px) {
  .lesson-nav {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .lesson-progress {
    width: 100%;
    align-items: flex-start;
  }
  
  .lesson-navigation {
    flex-direction: column;
    gap: 1rem;
  }
  
  .prev-btn, .next-btn, .module-btn {
    max-width: none;
  }
  
  .spacer {
    display: none;
  }
}
</style>
