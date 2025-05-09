<template>
  <div class="practice-page">
    <div class="practice-header">
      <h1>Daily Practice</h1>
      <p class="practice-intro">
        Daily practice is key to mastering DBT skills. Complete these exercises to build your streak and reinforce what you've learned.
      </p>
    </div>

    <div class="streak-info card">
      <div class="streak-details">
        <div class="streak-count">
          <span class="streak-number">{{ user.streak }}</span>
          <span class="streak-label">Day Streak</span>
        </div>
        <div class="streak-flame" :class="{ 'active': user.streak > 0 }">🔥</div>
      </div>
      <p class="streak-message">
        <span v-if="user.streak === 0">
          Start your streak today by completing a practice exercise!
        </span>
        <span v-else-if="user.streak === 1">
          You've practiced for 1 day in a row. Keep it up!
        </span>
        <span v-else>
          You've practiced for {{ user.streak }} days in a row. Great consistency!
        </span>
      </p>
    </div>

    <div class="practice-sections">
      <!-- Daily challenge section -->
      <div class="practice-section card">
        <div class="section-header">
          <h2>Today's Challenge</h2>
          <div class="xp-reward">
            <span class="xp-icon">⭐</span>
            <span>20 XP</span>
          </div>
        </div>
        
        <div class="practice-content">
          <p class="challenge-intro">
            {{ dailyChallenge.intro }}
          </p>
          
          <div class="challenge-details">
            <h3>{{ dailyChallenge.title }}</h3>
            <p>{{ dailyChallenge.description }}</p>
            
            <div v-if="dailyChallenge.type === 'reflection'" class="reflection-exercise">
              <textarea 
                v-model="reflectionText" 
                placeholder="Write your reflections here..."
                rows="4"
                class="reflection-input"
              ></textarea>
            </div>
            
            <div v-if="dailyChallenge.type === 'scenario'" class="scenario-exercise">
              <p class="scenario-situation">{{ dailyChallenge.scenario }}</p>
              <div class="scenario-options">
                <div 
                  v-for="(option, index) in dailyChallenge.options" 
                  :key="index"
                  class="scenario-option"
                  :class="{ 'selected': selectedOption === index }"
                  @click="selectOption(index)"
                >
                  <div class="option-text">{{ option }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            @click="completeChallenge" 
            class="btn complete-btn"
            :disabled="!canCompleteChallenge"
          >
            Complete Challenge
          </button>
        </div>
      </div>

      <!-- Skills practice section -->
      <div class="practice-section card">
        <div class="section-header">
          <h2>Skills Practice</h2>
          <div class="xp-reward">
            <span class="xp-icon">⭐</span>
            <span>10 XP Each</span>
          </div>
        </div>
        
        <div class="practice-content">
          <p class="skills-intro">
            Practice specific DBT skills you've learned in modules.
          </p>
          
          <div class="skills-list">
            <div 
              v-for="skill in practiceSkills" 
              :key="skill.id"
              class="skill-card"
              :class="{ 'disabled': !skill.unlocked }"
            >
              <div class="skill-icon" :style="{ backgroundColor: skill.color }">
                <span class="icon" :class="skill.icon"></span>
              </div>
              <div class="skill-info">
                <h3>{{ skill.title }}</h3>
                <p>{{ skill.description }}</p>
              </div>
              <div class="skill-action">
                <button 
                  @click="startSkillPractice(skill)" 
                  class="btn btn-outline"
                  :disabled="!skill.unlocked"
                >
                  {{ skill.unlocked ? 'Practice' : 'Locked' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mindfulness exercises section -->
      <div class="practice-section card">
        <div class="section-header">
          <h2>Mindfulness Moments</h2>
          <div class="xp-reward">
            <span class="xp-icon">⭐</span>
            <span>5 XP Each</span>
          </div>
        </div>
        
        <div class="practice-content">
          <p class="mindfulness-intro">
            Take a short break with these mindfulness exercises to center yourself.
          </p>
          
          <div class="mindfulness-exercises">
            <div class="mindfulness-exercise-card">
              <h3>Breathing Space</h3>
              <p>A 3-minute breathing exercise to center yourself and reduce stress.</p>
              <div class="exercise-timer" v-if="breathingActive">
                <div class="timer-circle" :style="{ transform: `scale(${breathingScale})` }"></div>
                <div class="timer-instruction">{{ breathingInstruction }}</div>
                <div class="timer-countdown">{{ formatTime(breathingTimer) }}</div>
              </div>
              <button 
                @click="startBreathingExercise" 
                class="btn btn-outline"
                :disabled="breathingActive"
              >
                {{ breathingActive ? 'In Progress...' : 'Start (3 min)' }}
              </button>
            </div>
            
            <div class="mindfulness-exercise-card">
              <h3>Body Scan</h3>
              <p>A guided practice to bring awareness to different parts of your body.</p>
              <button class="btn btn-outline">Start (5 min)</button>
            </div>
            
            <div class="mindfulness-exercise-card">
              <h3>Mindful Observation</h3>
              <p>Practice observing your surroundings with full attention.</p>
              <button class="btn btn-outline">Start (2 min)</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Completion modal -->
    <div v-if="showCompletionModal" class="completion-modal">
      <div class="modal-content card">
        <div class="modal-header">
          <h2>Practice Complete! 🎉</h2>
        </div>
        <div class="modal-body">
          <div class="xp-earned">
            <span class="xp-icon large">⭐</span>
            <span class="xp-amount">+{{ xpEarned }} XP</span>
          </div>
          <p class="completion-message">
            Great job! You've completed today's practice and earned {{ xpEarned }} XP.
          </p>
          <div v-if="streakUpdated" class="streak-updated">
            <span class="streak-icon">🔥</span>
            <span>Streak day {{ user.streak }}!</span>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeCompletionModal" class="btn">Continue</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import { useModulesStore } from '@/store/modules';

const userStore = useUserStore();
const modulesStore = useModulesStore();

const user = computed(() => userStore);

// For daily challenge
const dailyChallenge = ref({
  title: 'Use "Wise Mind" in a Challenging Situation',
  intro: "Today's challenge focuses on the core mindfulness skill of Wise Mind.",
  description: "Think of a recent situation where you had to make a decision. Reflect on how you might have used Wise Mind (balancing emotion mind and reasonable mind) to approach it differently.",
  type: 'reflection',
});

const reflectionText = ref('');
const selectedOption = ref(null);

// For breathing exercise
const breathingActive = ref(false);
const breathingTimer = ref(0);
const breathingInstruction = ref('');
const breathingScale = ref(1);

// For modal
const showCompletionModal = ref(false);
const xpEarned = ref(0);
const streakUpdated = ref(false);

// Check if user can complete today's challenge
const canCompleteChallenge = computed(() => {
  if (dailyChallenge.value.type === 'reflection') {
    return reflectionText.value.trim().length > 0;
  } else if (dailyChallenge.value.type === 'scenario') {
    return selectedOption.value !== null;
  }
  return false;
});

// Practice skills list
const practiceSkills = ref([
  {
    id: 'wise-mind',
    title: 'Wise Mind',
    description: 'Practice balancing emotional and reasonable mind to make better decisions.',
    module: 'mindfulness',
    icon: 'mindfulness',
    color: '#9C27B0',
    unlocked: true
  },
  {
    id: 'stop-skill',
    title: 'STOP Skill',
    description: 'Learn to stop and step back from emotional situations before acting.',
    module: 'distress-tolerance',
    icon: 'distress-tolerance',
    color: '#FF5722',
    unlocked: true
  },
  {
    id: 'emotion-identification',
    title: 'Emotion Identification',
    description: 'Practice identifying and naming your emotions with accuracy.',
    module: 'emotion-regulation',
    icon: 'emotion-regulation',
    color: '#4CAF50',
    unlocked: false
  },
  {
    id: 'dear-man',
    title: 'DEAR MAN',
    description: 'Practice effective communication to achieve your objectives in relationships.',
    module: 'interpersonal-effectiveness',
    icon: 'interpersonal-effectiveness',
    color: '#2196F3',
    unlocked: false
  }
]);

onMounted(() => {
  // Check and update streak when visiting practice page
  userStore.checkAndUpdateStreak();
  
  // Set unlocked status for skills based on module progress
  updateSkillsUnlockStatus();
  
  // Choose random daily challenge
  selectRandomDailyChallenge();
});

// Update which skills are unlocked based on module progress
const updateSkillsUnlockStatus = () => {
  const modules = modulesStore.modules;
  
  // Unlock skills based on module progress
  practiceSkills.value.forEach(skill => {
    const relatedModule = modules.find(m => m.id === skill.module);
    if (relatedModule) {
      skill.unlocked = relatedModule.unlocked;
    }
  });
};

// Select a random daily challenge
const selectRandomDailyChallenge = () => {
  const challenges = [
    {
      title: 'Use "Wise Mind" in a Challenging Situation',
      intro: "Today's challenge focuses on the core mindfulness skill of Wise Mind.",
      description: "Think of a recent situation where you had to make a decision. Reflect on how you might have used Wise Mind (balancing emotion mind and reasonable mind) to approach it differently.",
      type: 'reflection',
    },
    {
      title: 'Practice "One-Mindfully"',
      intro: "Today's challenge focuses on being present in the moment.",
      description: "Describe a situation today where you were able to focus completely on one thing at a time, without multitasking. How did it feel different from your usual approach?",
      type: 'reflection',
    },
    {
      title: 'Handling Criticism Skillfully',
      intro: "Today's challenge explores managing interpersonal situations.",
      scenario: "A friend has just criticized your handling of a situation in a way that feels unfair. What would be the most effective response?",
      options: [
        "Immediately defend yourself and explain why they're wrong",
        "Listen non-defensively, validate their perspective, then share your own view",
        "Ignore them and change the subject",
        "Tell them they're being unfair and hurtful"
      ],
      type: 'scenario',
    }
  ];
  
  // Pick a random challenge
  const randomIndex = Math.floor(Math.random() * challenges.length);
  dailyChallenge.value = challenges[randomIndex];
};

// Format time for breathing exercise
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
};

// Start breathing exercise
const startBreathingExercise = () => {
  breathingActive.value = true;
  breathingTimer.value = 180; // 3 minutes
  breathingInstruction.value = 'Breathe in...';
  breathingScale.value = 1;
  
  const breathInterval = setInterval(() => {
    breathingTimer.value--;
    
    // Update breathing instruction and animation
    if (breathingTimer.value % 8 === 0) {
      breathingInstruction.value = 'Breathe in...';
      breathingScale.value = 1;
    } else if (breathingTimer.value % 4 === 0) {
      breathingInstruction.value = 'Breathe out...';
      breathingScale.value = 1.5;
    }
    
    if (breathingTimer.value <= 0) {
      clearInterval(breathInterval);
      breathingActive.value = false;
      // Award XP for completing breathing exercise
      completeBreathingExercise();
    }
  }, 1000);
};

// Complete breathing exercise and award XP
const completeBreathingExercise = () => {
  userStore.addXpPoints(5);
  xpEarned.value = 5;
  showCompletionModal.value = true;
};

// Select an option in a scenario
const selectOption = (index) => {
  selectedOption.value = index;
};

// Start practicing a specific skill
const startSkillPractice = (skill) => {
  if (!skill.unlocked) return;
  
  // In a full implementation, this would navigate to a specific practice page
  // For now, we'll just award XP
  userStore.addXpPoints(10);
  xpEarned.value = 10;
  showCompletionModal.value = true;
};

// Complete the daily challenge
const completeChallenge = () => {
  if (!canCompleteChallenge.value) return;
  
  // Award XP for completing the challenge
  userStore.addXpPoints(20);
  
  // Check if streak was updated
  const previousStreak = user.value.streak;
  userStore.checkAndUpdateStreak();
  streakUpdated.value = user.value.streak > previousStreak;
  
  // Show completion modal
  xpEarned.value = 20;
  showCompletionModal.value = true;
  
  // Reset challenge input
  reflectionText.value = '';
  selectedOption.value = null;
};

// Close the completion modal
const closeCompletionModal = () => {
  showCompletionModal.value = false;
};
</script>

<style scoped>
.practice-page {
  padding-bottom: 3rem;
  position: relative;
}

.practice-header {
  margin-bottom: 2rem;
}

.practice-header h1 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.practice-intro {
  color: #666;
  max-width: 800px;
}

.streak-info {
  padding: 1.5rem;
  margin-bottom: 2rem;
  background: linear-gradient(to right, rgba(91, 134, 229, 0.05), rgba(54, 209, 220, 0.05));
}

.streak-details {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.streak-count {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.streak-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.streak-label {
  font-size: 0.9rem;
  color: #666;
}

.streak-flame {
  font-size: 2.5rem;
  opacity: 0.3;
}

.streak-flame.active {
  opacity: 1;
  animation: flicker 1.5s ease-in-out infinite alternate;
}

@keyframes flicker {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.streak-message {
  color: #666;
  margin: 0;
}

.practice-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.practice-section {
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  color: var(--primary-color);
  margin: 0;
}

.xp-reward {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-color);
}

.xp-icon {
  color: #FFC107;
}

.practice-content {
  color: #333;
}

.challenge-intro,
.skills-intro,
.mindfulness-intro {
  margin-bottom: 1.5rem;
  color: #666;
}

.challenge-details {
  margin-bottom: 1.5rem;
}

.challenge-details h3 {
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.reflection-exercise {
  margin-top: 1.5rem;
}

.reflection-input {
  width: 100%;
  min-height: 150px;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
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

.complete-btn {
  width: 100%;
  padding: 12px;
  margin-top: 1rem;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.skill-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.skill-card.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.skill-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.skill-info {
  flex: 1;
}

.skill-info h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
}

.skill-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.mindfulness-exercises {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.mindfulness-exercise-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
}

.mindfulness-exercise-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
}

.mindfulness-exercise-card p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.exercise-timer {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.timer-circle {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(91, 134, 229, 0.2);
  transition: transform 4s ease;
}

.timer-instruction {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  z-index: 1;
}

.timer-countdown {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  z-index: 1;
}

/* Completion modal */
.completion-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
}

.modal-header {
  padding: 1.5rem;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  color: white;
  text-align: center;
}

.modal-header h2 {
  margin: 0;
}

.modal-body {
  padding: 2rem;
  text-align: center;
}

.xp-earned {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.xp-icon.large {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.xp-amount {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
}

.completion-message {
  color: #666;
  margin-bottom: 1.5rem;
}

.streak-updated {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: rgba(255, 193, 7, 0.1);
  border-radius: 4px;
  color: #FFA000;
  font-weight: 600;
}

.streak-icon {
  margin-right: 0.5rem;
}

.modal-footer {
  padding: 1.5rem;
  text-align: center;
  border-top: 1px solid #e9ecef;
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
  .streak-details {
    flex-direction: column;
    gap: 1rem;
  }
  
  .mindfulness-exercises {
    grid-template-columns: 1fr;
  }
}
</style>
