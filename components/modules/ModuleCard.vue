<template>
  <div class="module-card card" :class="{ 'locked': !module.unlocked }">
    <div class="module-header" :style="{ backgroundColor: module.color + '10' }">
      <div class="module-icon" :style="{ background: module.color }">
        <div class="icon" :class="module.icon"></div>
      </div>
      <h3>{{ module.title }}</h3>
      <div class="lock-icon" v-if="!module.unlocked">
        <span>🔒</span>
      </div>
    </div>

    <div class="module-content">
      <p>{{ module.description }}</p>

      <div class="module-info">
        <div class="info-item">
          <span class="info-label">Lessons</span>
          <span class="info-value">{{ module.lessons.length }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Completed</span>
          <span class="info-value">{{ 
            module.lessons.filter(lesson => lesson.completed).length 
          }} / {{ module.lessons.length }}</span>
        </div>
      </div>

      <ProgressBar 
        :progress="module.progress" 
        :backgroundColor="module.color" 
        :label="`${module.progress}% Complete`"
      />
    </div>

    <div class="module-footer">
      <NuxtLink 
        :to="module.unlocked ? `/modules/${module.id}` : '#'" 
        class="btn" 
        :class="{ 'disabled': !module.unlocked }"
        @click.prevent="handleModuleClick"
      >
        {{ getActionText }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ProgressBar from '../shared/ProgressBar.vue';

const props = defineProps({
  module: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['unlock-requested']);

const getActionText = computed(() => {
  if (!props.module.unlocked) {
    return 'Locked';
  }
  
  if (props.module.progress > 0 && props.module.progress < 100) {
    return 'Continue';
  }
  
  if (props.module.progress === 100) {
    return 'Review';
  }
  
  return 'Start Learning';
});

const handleModuleClick = () => {
  if (!props.module.unlocked) {
    emit('unlock-requested', props.module.id);
  }
};
</script>

<style scoped>
.module-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
}

.module-card.locked {
  opacity: 0.9;
  filter: grayscale(30%);
}

.module-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  gap: 1rem;
  border-bottom: 1px solid #e9ecef;
  position: relative;
}

.module-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.module-header h3 {
  margin: 0;
  font-size: 1.3rem;
  color: var(--text-color);
}

.lock-icon {
  position: absolute;
  right: 1.5rem;
  font-size: 1.2rem;
}

.module-content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.module-content p {
  margin-bottom: 1.5rem;
  color: #666;
}

.module-info {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.8rem;
  color: #666;
}

.info-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
}

.module-footer {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  text-align: center;
}

.btn.disabled {
  opacity: 0.7;
  cursor: not-allowed;
  pointer-events: none;
}

/* Icon styles for different modules */
.icon {
  width: 24px;
  height: 24px;
  background-position: center;
  background-repeat: no-repeat;
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
</style>
