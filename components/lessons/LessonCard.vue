<template>
  <div class="lesson-card card" :class="{ 'completed': isCompleted }">
    <div class="lesson-type-badge" :class="lesson.type">
      {{ formatLessonType(lesson.type) }}
    </div>
    
    <div class="lesson-content">
      <h3 class="lesson-title">{{ lesson.title }}</h3>
      <p class="lesson-description">{{ lesson.description }}</p>
      
      <div class="lesson-meta">
        <div class="xp-reward">
          <span class="xp-icon">⭐</span>
          <span>{{ lesson.xpReward }} XP</span>
        </div>
        <div class="completion-status">
          <span v-if="isCompleted" class="completed-icon">✓</span>
          <span v-else class="pending-icon">○</span>
          <span>{{ isCompleted ? 'Completed' : 'Not Started' }}</span>
        </div>
      </div>
    </div>
    
    <div class="lesson-action">
      <NuxtLink 
        :to="`/modules/${moduleId}/lessons/${lesson.id}`"
        class="btn"
        :class="{ 'btn-outline': isCompleted }"
      >
        {{ isCompleted ? 'Review' : 'Start' }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/user';

const props = defineProps({
  lesson: {
    type: Object,
    required: true
  },
  moduleId: {
    type: String,
    required: true
  }
});

const userStore = useUserStore();

// Check if the lesson is completed from the user store instead of 
// relying on the lesson.completed flag
const isCompleted = computed(() => {
  return userStore.isLessonCompleted(props.lesson.id);
});

const formatLessonType = (type: string) => {
  switch(type) {
    case 'theory':
      return 'Theory';
    case 'exercise':
      return 'Exercise';
    case 'practice':
      return 'Practice';
    case 'quiz':
      return 'Quiz';
    default:
      return 'Lesson';
  }
};
</script>

<style scoped>
.lesson-card {
  position: relative;
  display: flex;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid #e9ecef;
  transition: all 0.3s ease;
  overflow: hidden;
}

.lesson-card:hover {
  transform: translateY(-2px);
}

.lesson-card.completed {
  border-left-color: var(--success-color);
}

.lesson-type-badge {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.3rem 0.8rem;
  border-bottom-left-radius: 8px;
}

.lesson-type-badge.theory {
  background-color: #E3F2FD;
  color: #1976D2;
}

.lesson-type-badge.exercise {
  background-color: #E8F5E9;
  color: #388E3C;
}

.lesson-type-badge.practice {
  background-color: #FFF8E1;
  color: #FFA000;
}

.lesson-type-badge.quiz {
  background-color: #F3E5F5;
  color: #7B1FA2;
}

.lesson-content {
  flex: 1;
  margin-right: 1.5rem;
}

.lesson-title {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
}

.lesson-description {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.lesson-meta {
  display: flex;
  font-size: 0.9rem;
  gap: 1.5rem;
}

.xp-reward, .completion-status {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.xp-icon {
  color: #FFC107;
}

.completed-icon {
  color: var(--success-color);
  font-weight: bold;
}

.pending-icon {
  color: #9E9E9E;
}

.lesson-action {
  display: flex;
  align-items: center;
  justify-content: center;
}

.lesson-action .btn {
  min-width: 100px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .lesson-card {
    flex-direction: column;
  }
  
  .lesson-content {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .lesson-action {
    width: 100%;
  }
  
  .lesson-action .btn {
    width: 100%;
  }
}
</style>
