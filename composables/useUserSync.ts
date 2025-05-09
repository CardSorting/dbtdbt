import { useUserStore } from '~/store/user';
import { useModulesStore } from '~/store/modules';

/**
 * Composable to synchronize the authenticated user with our application data
 */
export const useUserSync = () => {
  const nuxtApp = useNuxtApp();
  const userStore = useUserStore();
  const modulesStore = useModulesStore();
  const isLoading = ref(true);
  const error = ref<string | null>(null);
  
  /**
   * Synchronize the authenticated user with our database
   */
  const syncUser = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Get the authenticated user from Clerk
      const authUser = nuxtApp.$clerk?.user;
      
      if (!authUser) {
        console.warn('No authenticated user found');
        return false;
      }
      
      // Get the user's unique Clerk ID
      const clerkId = authUser.id;
      
      if (!clerkId) {
        console.warn('User ID not found');
        return false;
      }
      
      // Fetch our application user by the Clerk ID
      // We'll need to add this endpoint later
      await userStore.fetchUserByClerkId(clerkId);
      
      // If this is a first time user, we need to create a user record
      if (!userStore.id) {
        // Create user with data from Clerk
        await userStore.createUser({
          clerkId,
          name: authUser.fullName || authUser.username || 'New User'
        });
      }
      
      // Load data for the user
      await Promise.all([
        userStore.fetchUser(),
        modulesStore.fetchModules()
      ]);
      
      // Update user's streak
      await userStore.checkAndUpdateStreak();
      
      return true;
    } catch (err: any) {
      console.error('Error syncing user:', err);
      error.value = err.message || 'Failed to sync user data';
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  return {
    syncUser,
    isLoading,
    error
  };
};
