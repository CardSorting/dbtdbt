<template>
  <div class="profile-page">
    <div class="profile-header card">
      <div class="user-info">
        <div class="avatar">{{ userInitial }}</div>
        <div class="user-details">
          <h1>{{ user.name }}</h1>
          <p class="join-date">Learning DBT since {{ formattedJoinDate }}</p>
        </div>
      </div>
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-value">{{ user.streak }}</div>
          <div class="stat-label">Day Streak</div>
          <div class="stat-icon streak-icon">🔥</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ user.xpPoints }}</div>
          <div class="stat-label">XP Points</div>
          <div class="stat-icon xp-icon">⭐</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ user.skillsLearned }}</div>
          <div class="stat-label">Skills Learned</div>
          <div class="stat-icon skills-icon">📚</div>
        </div>
      </div>
    </div>

    <div class="progress-section">
      <h2>Overall Progress</h2>
      <div class="progress-container card">
        <div class="progress-percentage">{{ user.overallProgress }}%</div>
        <ProgressBar :progress="user.overallProgress" animate/>
        <p class="progress-message">
          {{ getProgressMessage }}
        </p>
      </div>
    </div>

    <div class="achievements-section">
      <h2>Achievements</h2>
      <div class="achievements-container">
        <div 
          v-for="achievement in user.achievements" 
          :key="achievement.id"
          class="achievement-card card"
          :class="{ 'earned': achievement.earned }"
        >
          <div class="achievement-icon">{{ achievement.icon }}</div>
          <div class="achievement-info">
            <h3>{{ achievement.name }}</h3>
            <p>{{ achievement.description }}</p>
            <div v-if="achievement.earned" class="earned-date">
              Earned on {{ formatEarnedDate(achievement.earnedDate) }}
            </div>
          </div>
          <div class="achievement-status">
            <span v-if="achievement.earned" class="earned-badge">✓</span>
            <span v-else class="locked-badge">🔒</span>
          </div>
        </div>
      </div>
    </div>

    <div class="modules-progress-section">
      <h2>Module Progress</h2>
      <div class="modules-progress-container">
        <div 
          v-for="module in modules" 
          :key="module.id"
          class="module-progress-card card"
        >
          <div class="module-progress-header">
            <div class="module-icon" :style="{ backgroundColor: module.color }">
              <span class="icon" :class="module.icon"></span>
            </div>
            <h3>{{ module.title }}</h3>
          </div>
          <div class="module-progress-stats">
            <div class="progress-stat">
              <span class="stat-label">Completed:</span>
              <span class="stat-value">
                {{ module.lessons.filter(l => l.completed).length }} / {{ module.lessons.length }} lessons
              </span>
            </div>
            <div class="progress-stat">
              <span class="stat-label">Status:</span>
              <span class="stat-value">
                <span v-if="module.progress === 100">Complete</span>
                <span v-else-if="module.progress > 0">In Progress</span>
                <span v-else>Not Started</span>
              </span>
            </div>
          </div>
          <ProgressBar 
            :progress="module.progress" 
            :backgroundColor="module.color" 
          />
          <div class="module-progress-action">
            <NuxtLink 
              :to="`/modules/${module.id}`" 
              class="btn" 
              :class="{ 'disabled': !module.unlocked }"
            >
              {{ getModuleActionText(module) }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div class="account-section">
      <h2>Account Settings</h2>
      <div class="account-container card">
        <div class="setting-group">
          <label>Your Name</label>
          <div class="input-with-button">
            <input type="text" v-model="userName" placeholder="Enter your name" class="name-input" />
            <button @click="updateName" class="btn">Update</button>
          </div>
        </div>

        <div class="setting-group">
          <label>Reset Progress</label>
          <p class="setting-description">This will reset all your progress, achievements, and stats. This action cannot be undone.</p>
          <button @click="confirmReset" class="btn btn-danger">Reset All Progress</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import { useModulesStore } from '@/store/modules';
import ProgressBar from '@/components/shared/ProgressBar.vue';

const userStore = useUserStore();
const modulesStore = useModulesStore();

const user = computed(() => userStore);
const modules = computed(() => modulesStore.modules);
const userName = ref(userStore.name);

// Get user initial for avatar
const userInitial = computed(() => {
  return user.value.name ? user.value.name.charAt(0).toUpperCase() : 'G';
});

// Format join date (using last login as a placeholder)
const formattedJoinDate = computed(() => {
  if (!user.value.lastLogin) {
    return 'Today';
  }
  return new Date(user.value.lastLogin).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Get a motivational message based on progress
const getProgressMessage = computed(() => {
  const progress = user.value.overallProgress;
  
  if (progress === 0) {
    return "Let's start your DBT learning journey!";
  } else if (progress < 25) {
    return "You're making your first steps. Keep going!";
  } else if (progress < 50) {
    return "Great progress! You're building solid foundations.";
  } else if (progress < 75) {
    return "You've learned a lot! Keep building those skills.";
  } else if (progress < 100) {
    return "Almost there! You're becoming a DBT expert.";
  } else {
    return "Congratulations! You've completed all lessons. Keep practicing your skills!";
  }
});

onMounted(() => {
  // Check and update streak when visiting profile
  userStore.checkAndUpdateStreak();
});

// Format earned date for achievements
const formatEarnedDate = (dateString) => {
  if (!dateString) return '';
  
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get appropriate action text for module cards
const getModuleActionText = (module) => {
  if (!module.unlocked) {
    return 'Locked';
  }
  
  if (module.progress === 100) {
    return 'Review';
  } else if (module.progress > 0) {
    return 'Continue';
  } else {
    return 'Start';
  }
};

// Update user name
const updateName = () => {
  if (userName.value.trim()) {
    userStore.setName(userName.value.trim());
  }
};

// Reset all progress with confirmation
const confirmReset = () => {
  if (confirm('Are you sure you want to reset all your progress? This action cannot be undone.')) {
    // Reset modules progress
    modulesStore.resetProgress();
    
    // Reset user stats but keep name
    userStore.streak = 0;
    userStore.skillsLearned = 0;
    userStore.xpPoints = 0;
    userStore.overallProgress = 0;
    
    // Reset achievements
    userStore.achievements.forEach(achievement => {
      achievement.earned = false;
      achievement.earnedDate = undefined;
    });
  }
};
</script>

<style scoped>
.profile-page {
  padding-bottom: 3rem;
}

.profile-header {
  padding: 2rem;
  margin-bottom: 2rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 600;
}

.user-details h1 {
  margin: 0 0 0.5rem;
  color: var(--primary-color);
}

.join-date {
  color: #666;
  font-size: 0.9rem;
}

.stats-overview {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1rem;
}

.stat-card {
  position: relative;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  text-align: center;
  min-width: 120px;
  overflow: hidden;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.3rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.stat-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1rem;
  opacity: 0.7;
}

.progress-section,
.achievements-section,
.modules-progress-section,
.account-section {
  margin-bottom: 3rem;
}

.progress-section h2,
.achievements-section h2,
.modules-progress-section h2,
.account-section h2 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.progress-container {
  padding: 2rem;
  text-align: center;
}

.progress-percentage {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.progress-message {
  margin-top: 1rem;
  font-size: 1.1rem;
  color: #666;
}

.achievements-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.achievement-card {
  display: flex;
  padding: 1.5rem;
  gap: 1rem;
  opacity: 0.7;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.achievement-card.earned {
  opacity: 1;
}

.achievement-icon {
  font-size: 2.5rem;
  color: #ccc;
}

.achievement-card.earned .achievement-icon {
  color: var(--accent-color);
}

.achievement-info {
  flex: 1;
}

.achievement-info h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  color: var(--text-color);
}

.achievement-info p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.earned-date {
  font-size: 0.8rem;
  color: #888;
  font-style: italic;
}

.achievement-status {
  align-self: center;
}

.earned-badge {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-color: var(--success-color);
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 24px;
}

.locked-badge {
  font-size: 1.2rem;
  color: #ccc;
}

.modules-progress-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.module-progress-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.module-progress-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.module-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.module-progress-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.module-progress-stats {
  margin-bottom: 1rem;
}

.progress-stat {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.progress-stat .stat-label {
  color: #666;
}

.progress-stat .stat-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-color);
}

.module-progress-action {
  margin-top: 1.5rem;
  text-align: center;
}

.account-container {
  padding: 2rem;
}

.setting-group {
  margin-bottom: 2rem;
}

.setting-group:last-child {
  margin-bottom: 0;
}

.setting-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.setting-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.input-with-button {
  display: flex;
  gap: 1rem;
}

.name-input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-danger {
  background: linear-gradient(to right, #f44336, #ff9800);
}

/* Icon styles */
.icon {
  width: 24px;
  height: 24px;
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
  .profile-header {
    padding: 1.5rem;
  }
  
  .user-info {
    flex-direction: column;
    text-align: center;
  }
  
  .stats-overview {
    flex-direction: column;
    align-items: center;
  }
  
  .stat-card {
    width: 100%;
  }
  
  .input-with-button {
    flex-direction: column;
  }
  
  .name-input {
    width: 100%;
  }
}
</style>
