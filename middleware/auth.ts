export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware if running server-side
  if (process.server) return;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/sign-in', '/sign-up', '/unauthorized'];
  
  // Skip if accessing a public route
  if (publicRoutes.includes(to.path)) return;
  
  // Check if user is authenticated using the $clerk global
  const nuxtApp = useNuxtApp();
  
  try {
    // Wait for clerk to initialize
    if (nuxtApp.$clerk) {
      await nuxtApp.$clerk.load();
      const isAuthenticated = nuxtApp.$clerk.user !== null;
      
      // If not authenticated, redirect to sign-in
      if (!isAuthenticated) {
        return navigateTo('/sign-in', { redirectCode: 401 });
      }
    } else {
      console.warn('Clerk not available, authentication check skipped');
      // For development purposes, we'll allow access when Clerk isn't available
      // In production, you might want to redirect to an error page
    }
  } catch (error) {
    console.error('Authentication error:', error);
    // In development, we'll log the error but still allow access
    // In production, redirect to an error page or sign-in
    if (process.env.NODE_ENV === 'production') {
      return navigateTo('/sign-in', { redirectCode: 401 });
    }
  }
  
  // Authentication passed, now proceed with any RBAC middleware
  // The RBAC middleware will handle role and permission checking
});
