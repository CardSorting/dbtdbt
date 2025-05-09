import { UserRole } from '~/server/services/permissions';
import { useUserStore } from '~/store/user';

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware if running server-side
  if (process.server) return;
  
  // Get required role and permissions from route meta
  const requiredRole = to.meta.requiredRole as UserRole | undefined;
  const requiredPermissions = to.meta.requiredPermissions as string[] | undefined;
  
  // Skip if no role or permission requirements
  if (!requiredRole && (!requiredPermissions || requiredPermissions.length === 0)) return;
  
  try {
    // Get user store to check role and permissions
    const userStore = useUserStore();
    
    // If in development and no role is set, allow access with a warning
    // This helps with development when auth isn't fully set up
    if (process.env.NODE_ENV !== 'production') {
      if (!userStore.role) {
        console.warn(`RBAC: Development mode - bypassing role check for ${to.path}`);
        console.warn(`Required role: ${requiredRole}, but no role found in user store`);
        // For development, we'll assume the user has the required role
        return;
      }
    }
    
    const userRole = userStore.role;
    const userPermissions = userStore.permissions || [];
    
    let hasAccess = true;
    
    // Check role
    if (requiredRole) {
      if (requiredRole === UserRole.ADMIN && userRole !== UserRole.ADMIN) {
        hasAccess = false;
      } else if (requiredRole === UserRole.TEACHER && 
                userRole !== UserRole.TEACHER && 
                userRole !== UserRole.ADMIN) {
        hasAccess = false;
      }
    }
    
    // Check permissions
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasAllPermissions = requiredPermissions.every(permission => 
        userPermissions.includes(permission)
      );
      
      if (!hasAllPermissions) {
        hasAccess = false;
      }
    }
    
    // If access is denied, redirect to unauthorized page
    if (!hasAccess) {
      console.warn(`RBAC: Access denied to ${to.path} - User role: ${userRole}, Required role: ${requiredRole}`);
      return navigateTo('/unauthorized', { redirectCode: 403 });
    }
  } catch (error) {
    console.error('RBAC middleware error:', error);
    // In development, we'll allow access despite errors
    if (process.env.NODE_ENV === 'production') {
      return navigateTo('/unauthorized', { redirectCode: 403 });
    }
    console.warn('RBAC: Development mode - allowing access despite error');
  }
});
