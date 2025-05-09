import { defineStore } from 'pinia';

interface UserState {
  name: string;
  streak: number;
  lastLogin: string | null;
  skillsLearned: number;
  xpPoints: number;
  overallProgress: number;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  icon: string;
  earnedDate?: string;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: 'Guest',
    streak: 0,
    lastLogin: null,
    skillsLearned: 0,
    xpPoints: 0,
    overallProgress: 0,
    achievements: [
      {
        id: 'first-lesson',
        name: 'First Steps',
        description: 'Complete your first lesson',
        earned: false,
        icon: '🎯'
      },
      {
        id: 'three-day-streak',
        name: 'Consistency is Key',
        description: 'Maintain a 3-day streak',
        earned: false,
        icon: '🔥'
      },
      {
        id: 'mindfulness-master',
        name: 'Mindfulness Master',
        description: 'Complete all mindfulness lessons',
        earned: false,
        icon: '🧘'
      },
      {
        id: 'distress-tolerance',
        name: 'Calm in the Storm',
        description: 'Complete all distress tolerance lessons',
        earned: false,
        icon: '🌊'
      },
      {
        id: 'emotion-regulation',
        name: 'Emotion Expert',
        description: 'Complete all emotion regulation lessons',
        earned: false,
        icon: '❤️'
      },
      {
        id: 'interpersonal',
        name: 'Relationship Navigator',
        description: 'Complete all interpersonal effectiveness lessons',
        earned: false,
        icon: '🤝'
      },
      {
        id: 'dbt-graduate',
        name: 'DBT Graduate',
        description: 'Complete all modules',
        earned: false,
        icon: '🎓'
      }
    ]
  }),
  
  getters: {
    getAchievements: (state) => state.achievements,
    getEarnedAchievements: (state) => state.achievements.filter(a => a.earned),
    getStreak: (state) => state.streak,
    getXpPoints: (state) => state.xpPoints,
    getSkillsLearned: (state) => state.skillsLearned,
    getOverallProgress: (state) => state.overallProgress
  },
  
  actions: {
    setName(name: string) {
      this.name = name;
    },
    
    checkAndUpdateStreak() {
      const today = new Date().toISOString().split('T')[0];
      
      if (this.lastLogin) {
        const lastDate = new Date(this.lastLogin);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        // If last login was yesterday, increment streak
        if (lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
          this.streak += 1;
        } 
        // If last login was before yesterday, reset streak
        else if (lastDate < yesterday) {
          this.streak = 1;
        }
        // If same day, don't change streak
      } else {
        // First login
        this.streak = 1;
      }
      
      this.lastLogin = today;
      this.checkAchievements();
    },
    
    addXpPoints(points: number) {
      this.xpPoints += points;
      this.checkAchievements();
    },
    
    incrementSkillsLearned() {
      this.skillsLearned += 1;
      this.checkAchievements();
    },
    
    updateOverallProgress(progress: number) {
      this.overallProgress = progress;
      this.checkAchievements();
    },
    
    checkAchievements() {
      // First lesson achievement
      if (this.xpPoints > 0 && !this.achievements.find(a => a.id === 'first-lesson')!.earned) {
        this.earnAchievement('first-lesson');
      }
      
      // 3-day streak achievement
      if (this.streak >= 3 && !this.achievements.find(a => a.id === 'three-day-streak')!.earned) {
        this.earnAchievement('three-day-streak');
      }
      
      // DBT Graduate achievement
      if (this.overallProgress >= 100 && !this.achievements.find(a => a.id === 'dbt-graduate')!.earned) {
        this.earnAchievement('dbt-graduate');
      }
    },
    
    earnAchievement(achievementId: string) {
      const achievement = this.achievements.find(a => a.id === achievementId);
      if (achievement && !achievement.earned) {
        achievement.earned = true;
        achievement.earnedDate = new Date().toISOString();
      }
    }
  }
});
