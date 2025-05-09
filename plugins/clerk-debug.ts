// This plugin helps debug Clerk initialization issues and provides fallbacks

export default defineNuxtPlugin((nuxtApp) => {
  // Check if Clerk environment variables are correctly loaded
  const runtimeConfig = useRuntimeConfig();
  
  console.log("=== Clerk Environment Check ===");
  
  // Check env variables directly
  console.log("Environment Variables:");
  console.log(`- CLERK_PUBLISHABLE_KEY: ${!!process.env.CLERK_PUBLISHABLE_KEY}`);
  console.log(`- CLERK_SECRET_KEY: ${!!process.env.CLERK_SECRET_KEY}`);
  console.log(`- NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${!!process.env.NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY}`);
  console.log(`- NUXT_CLERK_SECRET_KEY: ${!!process.env.NUXT_CLERK_SECRET_KEY}`);
  
  // Check if clerk keys are present in the runtime config
  const hasPublishableKey = !!runtimeConfig.public.clerkPublishableKey;
  const hasSecretKey = !!runtimeConfig.clerkSecretKey;
  
  console.log("\nRuntime Config:");
  console.log(`- Runtime config has publishable key: ${hasPublishableKey}`);
  console.log(`- Runtime config has secret key: ${hasSecretKey}`);
  
  // Check if the Clerk plugin is loaded
  const hasClerkPlugin = !!nuxtApp.$clerk;
  console.log(`\n- Clerk plugin is loaded: ${hasClerkPlugin}`);
  
  // If we have the plugin, check its initialization state
  if (hasClerkPlugin) {
    try {
      const clerk = nuxtApp.$clerk as { session?: unknown };
      console.log(`- Clerk plugin initialized: ${!!clerk.session}`);
    } catch (error) {
      console.error('Error checking Clerk initialization:', error);
      console.log(`- Clerk plugin initialized: false`);
    }
  }
  
  // For development, provide fallbacks to make the app work even if Clerk is not properly initialized
  if (process.env.NODE_ENV !== 'production') {
    if (!hasClerkPlugin) {
      console.warn("Clerk plugin not detected - providing mock implementation for development");
      
      // Provide a minimal mock implementation of Clerk
      nuxtApp.provide('clerk', {
        load: async () => console.log("Mock Clerk: load() called"),
        user: { id: 'mock-user-id', fullName: 'Development User' },
        session: { id: 'mock-session-id' },
        signOut: async () => console.log("Mock Clerk: signOut() called")
      });
    }
  }
  
  return {
    provide: {
      clerkDebug: {
        status: {
          hasPublishableKey,
          hasSecretKey,
          hasClerkPlugin
        }
      }
    }
  };
});
