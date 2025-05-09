import { defineStore } from 'pinia';

interface Achievement {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  icon: string;
  earnedDate?: string;
}

interface ModuleProgress {
  moduleId: string;
  title: string;
  progress: number;
}

interface UserState {
  id: string;
  name: string;
  streak: number;
  lastLogin: string | null;
  skillsLearned: number;
  xpPoints: number;
  overallProgress: number;
  achievements: Achievement[];
  moduleProgress: ModuleProgress[];
  completedLessons: string[];
  isLoading: boolean;
  error: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: 'default-user',
    name: 'Guest',
    streak: 0,
    lastLogin: null,
    skillsLearned: 0,
    xpPoints: 0,
    overallProgress: 0,
    achievements: [],
    moduleProgress: [],
    completedLessons: [],
    isLoading: false,
    error: null
  }),
  
  getters: {
    getAchievements: (state) => state.achievements,
    getEarnedAchievements: (state) => state.achievements.filter(a => a.earned),
    getStreak: (state) => state.streak,
    getXpPoints: (state) => state.xpPoints,
    getSkillsLearned: (state) => state.skillsLearned,
    getOverallProgress: (state) => state.overallProgress,
    isLessonCompleted: (state) => (lessonId: string) => state.completedLessons.includes(lessonId)
  },
  
  actions: {
    // Fetch user data from the API
    async fetchUser() {
      const api = useApi();
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.fetchUser();
        
        // Type guard to ensure we have the correct shape
        const isValidUserData = (data: any): data is {
          id: string;
          name: string;
          streak: number;
          lastLogin: string | null;
          skillsLearned: number;
          xpPoints: number;
          overallProgress: number;
          achievements: Achievement[];
          moduleProgress: ModuleProgress[];
          completedLessons: string[];
        } => {
          return data && 
                 typeof data === 'object' && 
                 'id' in data && 
                 typeof data.id === 'string';
        };
        
        if (!isValidUserData(response)) {
          throw new Error('Invalid user data received from API');
        }
        
        // Now TypeScript knows the shape of userData
        const userData = response;
        
        // Update state with user data
        this.id = userData.id;
        this.name = userData.name || 'Guest';
        this.streak = typeof userData.streak === 'number' ? userData.streak : 0;
        this.lastLogin = userData.lastLogin || null;
        this.skillsLearned = typeof userData.skillsLearned === 'number' ? userData.skillsLearned : 0;
        this.xpPoints = typeof userData.xpPoints === 'number' ? userData.xpPoints : 0;
        this.overallProgress = typeof userData.overallProgress === 'number' ? userData.overallProgress : 0;
        this.achievements = Array.isArray(userData.achievements) ? userData.achievements : [];
        this.moduleProgress = Array.isArray(userData.moduleProgress) ? userData.moduleProgress : [];
        this.completedLessons = Array.isArray(userData.completedLessons) ? userData.completedLessons : [];
        
        return userData;
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch user data';
        console.error('Error fetching user data:', error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Update user name
    async setName(name: string) {
      // In a real app, this would call an API endpoint to update the name
      // For now, we just update the local state
      this.name = name;
    },
    
    // Check and update streak
    async checkAndUpdateStreak() {
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
      
      // In a real app, this would call an API endpoint to update the streak
      // For now, we just check achievements locally
      this.checkAchievements();
    },
    
    // Add XP points
    async addXpPoints(points: number) {
      // In a real app, this would call an API endpoint to add XP
      // For now, we just update the local state
      this.xpPoints += points;
      this.checkAchievements();
    },
    
    // Increment skills learned
    async incrementSkillsLearned() {
      // In a real app, this would call an API endpoint
      // For now, we just update the local state
      this.skillsLearned += 1;
      this.checkAchievements();
    },
    
    // Update overall progress
    async updateOverallProgress(progress: number) {
      // In a real app, this would call an API endpoint
      // For now, we just update the local state
      this.overallProgress = progress;
      this.checkAchievements();
    },
    
    // Check achievements
    checkAchievements() {
      // First lesson achievement
      const firstLessonAchievement = this.achievements.find(a => a.id === 'first-lesson');
      if (this.xpPoints > 0 && firstLessonAchievement && !firstLessonAchievement.earned) {
        this.earnAchievement('first-lesson');
      }
      
      // 3-day streak achievement
      const streakAchievement = this.achievements.find(a => a.id === 'three-day-streak');
      if (this.streak >= 3 && streakAchievement && !streakAchievement.earned) {
        this.earnAchievement('three-day-streak');
      }
      
      // DBT Graduate achievement
      const graduateAchievement = this.achievements.find(a => a.id === 'dbt-graduate');
      if (this.overallProgress >= 100 && graduateAchievement && !graduateAchievement.earned) {
        this.earnAchievement('dbt-graduate');
      }
    },
    
    // Earn achievement
    async earnAchievement(achievementId: string) {
      // In a real app, this would call an API endpoint
      // For now, we just update the local state
      const achievement = this.achievements.find(a => a.id === achievementId);
      if (achievement && !achievement.earned) {
        achievement.earned = true;
        achievement.earnedDate = new Date().toISOString();
      }
    }
  }
});
