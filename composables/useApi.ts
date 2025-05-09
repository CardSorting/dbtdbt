// API client for interacting with server endpoints

export default function useApi() {
  const fetchModules = async () => {
    try {
      return await $fetch('/api/modules');
    } catch (error) {
      console.error('Error fetching modules:', error);
      throw error;
    }
  };

  const fetchModule = async (id: string) => {
    try {
      return await $fetch(`/api/modules/${id}`);
    } catch (error) {
      console.error(`Error fetching module ${id}:`, error);
      throw error;
    }
  };

  const fetchLesson = async (id: string) => {
    try {
      return await $fetch(`/api/lessons/${id}`);
    } catch (error) {
      console.error(`Error fetching lesson ${id}:`, error);
      throw error;
    }
  };

  const fetchUser = async () => {
    try {
      return await $fetch('/api/user');
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  };

  const completeLesson = async (userId: string, lessonId: string) => {
    try {
      return await $fetch('/api/lessons/complete', {
        method: 'POST',
        body: { userId, lessonId }
      });
    } catch (error) {
      console.error('Error completing lesson:', error);
      throw error;
    }
  };

  return {
    fetchModules,
    fetchModule,
    fetchLesson,
    fetchUser,
    completeLesson
  };
}
