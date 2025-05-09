import { defineStore } from 'pinia';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  order: number;
  progress?: number;
  lessons?: any[];
  createdAt?: string;
  updatedAt?: string;
}

interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: string;
  xpReward: number;
  content: any;
  order: number;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ModulesState {
  modules: Module[];
  currentModuleId: string | null;
  currentLessonId: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useModulesStore = defineStore('modules', {
  state: (): ModulesState => ({
    modules: [],
    currentModuleId: null,
    currentLessonId: null,
    isLoading: false,
    error: null
  }),
  
  getters: {
    getAllModules: (state) => state.modules,
    
    getUnlockedModules: (state) => state.modules.filter(m => m.unlocked),
    
    getCurrentModule: (state) => {
      if (!state.currentModuleId) return null;
      return state.modules.find(m => m.id === state.currentModuleId) || null;
    },
    
    getCurrentLesson: (state) => {
      if (!state.currentModuleId || !state.currentLessonId) return null;
      const module = state.modules.find(m => m.id === state.currentModuleId);
      if (!module || !module.lessons) return null;
      return module.lessons.find((l: any) => l.id === state.currentLessonId) || null;
    },
    
    getModuleProgress: (state) => (moduleId: string) => {
      const module = state.modules.find(m => m.id === moduleId);
      if (!module) return 0;
      return module.progress || 0;
    },
    
    getOverallProgress: (state) => {
      // We will calculate this from the modules' progress
      if (state.modules.length === 0) return 0;
      
      const totalProgress = state.modules.reduce((sum, module) => sum + (module.progress || 0), 0);
      return Math.round(totalProgress / state.modules.length);
    }
  },
  
  actions: {
    // Fetch all modules from the API
    async fetchModules() {
      const api = useApi();
      this.isLoading = true;
      this.error = null;
      
      try {
        const modules = await api.fetchModules();
        this.modules = modules;
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch modules';
        console.error('Error fetching modules:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Fetch a specific module with its lessons
    async fetchModule(moduleId: string) {
      const api = useApi();
      this.isLoading = true;
      this.error = null;
      
      try {
        const module = await api.fetchModule(moduleId);
        
        // Update module in the store
        const index = this.modules.findIndex(m => m.id === moduleId);
        if (index >= 0) {
          this.modules[index] = module;
        } else {
          this.modules.push(module);
        }
        
        return module;
      } catch (error: any) {
        this.error = error.message || `Failed to fetch module ${moduleId}`;
        console.error(`Error fetching module ${moduleId}:`, error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Set current module and lesson IDs
    setCurrentModule(moduleId: string) {
      this.currentModuleId = moduleId;
    },
    
    setCurrentLesson(lessonId: string) {
      this.currentLessonId = lessonId;
    },
    
    // Complete a lesson and update progress
    async completeLesson(moduleId: string, lessonId: string) {
      const api = useApi();
      
      try {
        // Default user ID - in a real app this would come from authentication
        const userId = 'default-user';
        
        // Call the API to complete the lesson
        const result = await api.completeLesson(userId, lessonId);
        
        if (result.success) {
          // Update module progress in the store
          const moduleIndex = this.modules.findIndex(m => m.id === moduleId);
          if (moduleIndex >= 0) {
            // Update module progress
            this.modules[moduleIndex].progress = result.moduleProgress;
            
            // Mark lesson as completed
            if (this.modules[moduleIndex].lessons) {
              const lessonIndex = this.modules[moduleIndex].lessons.findIndex((l: any) => l.id === lessonId);
              if (lessonIndex >= 0) {
                this.modules[moduleIndex].lessons[lessonIndex].completed = true;
              }
            }
            
            // If module is completed, unlock the next one
            if (result.isModuleComplete) {
              const nextModuleIndex = this.modules.findIndex(m => m.order > this.modules[moduleIndex].order);
              if (nextModuleIndex >= 0) {
                this.modules[nextModuleIndex].unlocked = true;
              }
            }
          }
          
          return result.xpEarned;
        }
        
        return 0;
      } catch (error) {
        console.error('Error completing lesson:', error);
        return 0;
      }
    },
    
    // Reset all progress
    async resetProgress() {
      // In a real app, this would call an API endpoint to reset progress
      // For now, we just reset the local state
      this.modules.forEach(module => {
        if (module.lessons) {
          module.lessons.forEach((lesson: any) => {
            lesson.completed = false;
          });
        }
        module.progress = 0;
        module.unlocked = module.id === 'mindfulness'; // Only the first module is unlocked
      });
      
      this.currentModuleId = null;
      this.currentLessonId = null;
    }
  }
});
