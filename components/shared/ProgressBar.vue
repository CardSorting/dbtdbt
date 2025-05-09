<template>
  <div class="progress-container">
    <div class="progress-label" v-if="showLabel">
      <span>{{ label || `${progress}% Complete` }}</span>
    </div>
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: `${progress}%`, backgroundColor }"
        :class="{ 'animate': animate }"
      ></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  progress: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 100
  },
  backgroundColor: {
    type: String,
    default: 'var(--primary-color)'
  },
  label: {
    type: String,
    default: ''
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  animate: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.progress-container {
  width: 100%;
  margin: 0.5rem 0;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;
  font-size: 0.85rem;
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
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-fill.animate {
  animation: progress-animation 1s ease-in-out;
}

@keyframes progress-animation {
  0% {
    width: 0%;
  }
}
</style>
