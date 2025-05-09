import prisma from '~/server/services/prisma';
import { getUserWithRole, hasRole, UserRole } from '~/server/services/permissions';

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const body = await readBody(event);
    const { userId, newRole } = body;
    
    // Validate input
    if (!userId || !newRole) {
      return createError({
        statusCode: 400,
        statusMessage: 'User ID and new role are required'
      });
    }
    
    // Validate that the role is valid
    if (!Object.values(UserRole).includes(newRole as UserRole)) {
      return createError({
        statusCode: 400,
        statusMessage: 'Invalid role specified'
      });
    }
    
    // In a real app, get the current user from the request/session
    // For this example, we'll assume an admin is making the request
    // In reality you'd check the requesting user's permissions
    const requestingUser = await getUserWithRole('admin-user-id');
    
    // Check if the requesting user is an admin
    if (!requestingUser || !hasRole(requestingUser, UserRole.ADMIN)) {
      return createError({
        statusCode: 403,
        statusMessage: 'You do not have permission to update user roles'
      });
    }
    
    // Update the user's role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole as UserRole }
    });
    
    return {
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        role: updatedUser.role
      }
    };
  } catch (error) {
    console.error('Error updating user role:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Failed to update user role'
    });
  }
});
