// This plugin adds a global auth helper

// Improved type definitions for Clerk
interface ClerkUser {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  username?: string;
  [key: string]: any;
}

interface ClerkClient {
  user?: ClerkUser;
  session?: {
    id: string;
    [key: string]: any;
  };
  signOut?: () => Promise<void>;
  [key: string]: any;
}

// Declare the Clerk module for TypeScript
declare module '#app' {
  interface NuxtApp {
    $clerk: ClerkClient;
  }
}

export default defineNuxtPlugin(() => {
  const isClient = process.client;
  
  return {
    provide: {
      auth: {
        // Check if the user is authenticated (client-side only)
        isAuthenticated: () => {
          if (!isClient) return false;
          
          const nuxtApp = useNuxtApp();
          if (!nuxtApp.$clerk) return false;
          
          try {
            return !!nuxtApp.$clerk.user;
          } catch (err) {
            console.error('Error checking auth status:', err);
            return false;
          }
        },
        
        // Get the current user object (client-side only)
        getCurrentUser: () => {
          if (!isClient) return null;
          
          const nuxtApp = useNuxtApp();
          if (!nuxtApp.$clerk) return null;
          
          try {
            return nuxtApp.$clerk.user;
          } catch (err) {
            console.error('Error getting user:', err);
            return null;
          }
        }
      }
    }
  };
});
