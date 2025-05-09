export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware if running server-side
  if (process.server) return;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/sign-in', '/sign-up'];
  
  // Skip if accessing a public route
  if (publicRoutes.includes(to.path)) return;
  
  // Check if user is authenticated using the $clerk global
  const nuxtApp = useNuxtApp();
  
  // Wait for clerk to initialize
  await nuxtApp.$clerk?.load();
  
  const isAuthenticated = nuxtApp.$clerk?.user !== null;
  
  // If not authenticated, redirect to sign-in
  if (!isAuthenticated) {
    return navigateTo('/sign-in', { redirectCode: 401 });
  }
});
