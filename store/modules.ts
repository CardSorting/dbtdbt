import { defineStore } from 'pinia';

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'theory' | 'exercise' | 'practice' | 'quiz';
  xpReward: number;
  completed: boolean;
  content: LessonContent;
}

interface LessonContent {
  text?: string[];
  questions?: Question[];
  exercises?: Exercise[];
  scenarios?: Scenario[];
}

interface Question {
  id: string;
  text: string;
  options?: string[];
  correctAnswerIndex?: number;
  multipleCorrect?: boolean;
  correctAnswerIndices?: number[];
}

interface Exercise {
  id: string;
  instructions: string;
  type: 'breathing' | 'reflection' | 'journaling' | 'meditation';
  duration?: number; // in seconds
}

interface Scenario {
  id: string;
  situation: string;
  options: string[];
  feedback: string[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
  progress: number;
  unlocked: boolean;
}

interface ModulesState {
  modules: Module[];
  currentModuleId: string | null;
  currentLessonId: string | null;
}

export const useModulesStore = defineStore('modules', {
  state: (): ModulesState => ({
    modules: [
      {
        id: 'mindfulness',
        title: 'Mindfulness',
        description: 'Learn to be fully aware in the present moment',
        icon: 'mindfulness',
        color: '#9C27B0',
        progress: 0,
        unlocked: true,
        lessons: [
          {
            id: 'mindfulness-intro',
            title: 'Introduction to Mindfulness',
            description: 'Understand what mindfulness is and why it\'s important',
            type: 'theory',
            xpReward: 10,
            completed: false,
            content: {
              text: [
                "Mindfulness is the practice of being fully present and engaged in the moment, aware of your thoughts and feelings without distraction or judgment.",
                "In DBT, mindfulness is considered a core skill and serves as the foundation for all other skills.",
                "The goal of mindfulness is to help you experience reality as it is, rather than being caught up in thoughts about the past or future.",
                "By practicing mindfulness, you can increase your ability to focus, reduce emotional reactivity, and make better choices in difficult situations."
              ]
            }
          },
          {
            id: 'wise-mind',
            title: 'Wise Mind',
            description: 'Learn to balance emotional and reasonable mind',
            type: 'theory',
            xpReward: 15,
            completed: false,
            content: {
              text: [
                "In DBT, we talk about three states of mind: reasonable mind, emotion mind, and wise mind.",
                "Reasonable mind is the logical, rational part of our thinking. It's focused on facts, planning, and analyzing.",
                "Emotion mind is when our emotions control our thinking and behavior. Our feelings drive our decisions in this state.",
                "Wise mind is the integration of both reasonable mind and emotion mind. It's the state where you can consider both facts and feelings to make balanced decisions.",
                "Finding your wise mind involves acknowledging your emotions while also thinking rationally about a situation."
              ],
              exercises: [
                {
                  id: 'wise-mind-reflection',
                  instructions: "Think of a recent decision you made. Which mind state were you in? How might the decision have been different if you were in wise mind?",
                  type: 'reflection'
                }
              ]
            }
          },
          {
            id: 'what-skills',
            title: 'What Skills',
            description: 'Observe, describe, and participate in the present moment',
            type: 'practice',
            xpReward: 20,
            completed: false,
            content: {
              text: [
                "The 'What' skills of mindfulness are about what you do to practice mindfulness.",
                "There are three 'What' skills: Observe, Describe, and Participate.",
                "Observe: Pay attention to your experiences without trying to change them. Notice sensations, thoughts, and feelings as they come and go.",
                "Describe: Put words to your experience. Label thoughts as thoughts, emotions as emotions. For example, 'I'm having the thought that I might fail' rather than 'I'm going to fail'.",
                "Participate: Fully engage in the current activity without self-consciousness. Become one with what you're doing."
              ],
              exercises: [
                {
                  id: 'observing-breath',
                  instructions: "For the next minute, focus all your attention on your breathing. Notice the sensation of air moving in and out of your body. When your mind wanders, gently bring it back to your breath.",
                  type: 'breathing',
                  duration: 60
                }
              ]
            }
          }
        ]
      },
      {
        id: 'distress-tolerance',
        title: 'Distress Tolerance',
        description: 'Develop skills to cope with crisis situations',
        icon: 'distress-tolerance',
        color: '#FF5722',
        progress: 0,
        unlocked: false,
        lessons: [
          {
            id: 'distress-tolerance-intro',
            title: 'Introduction to Distress Tolerance',
            description: 'Learn what distress tolerance is and why it matters',
            type: 'theory',
            xpReward: 10,
            completed: false,
            content: {
              text: [
                "Distress tolerance skills help you cope with painful emotions and difficult situations without making things worse.",
                "These skills are particularly useful during crisis situations when you might be tempted to engage in impulsive behaviors.",
                "Distress tolerance is about accepting reality as it is in the moment, even when it's painful or uncomfortable.",
                "These skills aren't about fixing or changing the situation, but rather about surviving it without creating additional problems."
              ]
            }
          },
          {
            id: 'stop-skill',
            title: 'STOP Skill',
            description: 'Learn to stop and avoid acting impulsively',
            type: 'practice',
            xpReward: 15,
            completed: false,
            content: {
              text: [
                "The STOP skill is a crisis survival strategy that helps you avoid acting impulsively when you're emotionally overwhelmed.",
                "S - Stop. Do not move forward. Freeze. Don't act immediately based on your emotions.",
                "T - Take a step back. Take a break. Let go. Take a deep breath.",
                "O - Observe what is happening inside and outside you. What are the facts of the situation?",
                "P - Proceed mindfully with awareness. Consider your goals. Think about what will make the situation better or worse."
              ],
              scenarios: [
                {
                  id: 'argument-scenario',
                  situation: "You're in a heated argument with someone you care about. They've just said something that feels like a personal attack, and you feel the urge to say something hurtful back. What do you do?",
                  options: [
                    "Immediately respond with something equally hurtful to defend yourself",
                    "Use the STOP skill: Stop, take a step back, observe your emotions, then proceed mindfully",
                    "Walk away from the conversation without saying anything",
                    "Tell them they're being unfair and demand an apology"
                  ],
                  feedback: [
                    "This is likely to escalate the conflict and damage the relationship further. Acting on impulse when emotionally triggered often leads to regret later.",
                    "Great choice! Using the STOP skill helps create space between your emotional trigger and your response, allowing you to choose a more effective action.",
                    "While taking space can be helpful, abruptly walking away without explanation might make the situation worse. Using STOP first can help you communicate your need for space more effectively.",
                    "This response comes from emotion mind and might escalate the situation. The person might not see their comment as unfair from their perspective."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        id: 'emotion-regulation',
        title: 'Emotion Regulation',
        description: 'Learn to understand and manage your emotions',
        icon: 'emotion-regulation',
        color: '#4CAF50',
        progress: 0,
        unlocked: false,
        lessons: [
          {
            id: 'emotion-regulation-intro',
            title: 'Introduction to Emotion Regulation',
            description: 'Understand the purpose of emotions and how to work with them',
            type: 'theory',
            xpReward: 10,
            completed: false,
            content: {
              text: [
                "Emotion regulation skills help you understand, experience, and influence your emotions in healthy ways.",
                "These skills focus on reducing emotional vulnerability and decreasing emotional suffering.",
                "The goal is not to eliminate emotions (which is neither possible nor desirable) but to experience them in balanced, effective ways.",
                "By learning to regulate emotions, you can reduce your suffering and improve your ability to act according to your values rather than your momentary feelings."
              ]
            }
          }
        ]
      },
      {
        id: 'interpersonal-effectiveness',
        title: 'Interpersonal Effectiveness',
        description: 'Develop skills for healthy relationships and communication',
        icon: 'interpersonal-effectiveness',
        color: '#2196F3',
        progress: 0,
        unlocked: false,
        lessons: [
          {
            id: 'interpersonal-effectiveness-intro',
            title: 'Introduction to Interpersonal Effectiveness',
            description: 'Learn how to maintain relationships while achieving your objectives',
            type: 'theory',
            xpReward: 10,
            completed: false,
            content: {
              text: [
                "Interpersonal effectiveness skills help you navigate relationships and interactions with others.",
                "These skills focus on maintaining relationships, maintaining self-respect, and achieving your objectives when interacting with others.",
                "They can help you ask for what you need, say no to unwanted requests, and handle conflict effectively.",
                "The goal is to become more effective in getting your needs met while also preserving relationships and your own self-respect."
              ]
            }
          }
        ]
      }
    ],
    currentModuleId: null,
    currentLessonId: null
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
      if (!module) return null;
      return module.lessons.find(l => l.id === state.currentLessonId) || null;
    },
    
    getModuleProgress: (state) => (moduleId: string) => {
      const module = state.modules.find(m => m.id === moduleId);
      if (!module) return 0;
      return module.progress;
    },
    
    getOverallProgress: (state) => {
      const totalLessons = state.modules.reduce((count, module) => count + module.lessons.length, 0);
      const completedLessons = state.modules.reduce((count, module) => {
        return count + module.lessons.filter(lesson => lesson.completed).length;
      }, 0);
      
      return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    }
  },
  
  actions: {
    setCurrentModule(moduleId: string) {
      this.currentModuleId = moduleId;
    },
    
    setCurrentLesson(lessonId: string) {
      this.currentLessonId = lessonId;
    },
    
    completeLesson(moduleId: string, lessonId: string) {
      const module = this.modules.find(m => m.id === moduleId);
      if (!module) return;
      
      const lesson = module.lessons.find(l => l.id === lessonId);
      if (!lesson || lesson.completed) return;
      
      lesson.completed = true;
      
      // Update module progress
      const completedLessons = module.lessons.filter(l => l.completed).length;
      module.progress = Math.round((completedLessons / module.lessons.length) * 100);
      
      // Unlock next module if this one is complete
      if (module.progress === 100) {
        const currentIndex = this.modules.findIndex(m => m.id === moduleId);
        if (currentIndex < this.modules.length - 1) {
          this.modules[currentIndex + 1].unlocked = true;
        }
      }
      
      // Return the XP reward for this lesson
      return lesson.xpReward;
    },
    
    resetProgress() {
      this.modules.forEach(module => {
        module.progress = 0;
        module.lessons.forEach(lesson => {
          lesson.completed = false;
        });
        
        // Only the first module should be unlocked
        module.unlocked = module.id === 'mindfulness';
      });
      
      this.currentModuleId = null;
      this.currentLessonId = null;
    }
  }
});
