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
  
  // Get user store to check role and permissions
  const userStore = useUserStore();
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
  
  // If access is denied, redirect to unauthorized page or home
  if (!hasAccess) {
    return navigateTo('/unauthorized', { redirectCode: 403 });
  }
});
