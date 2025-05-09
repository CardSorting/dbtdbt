import prisma from '~/server/services/prisma';
import { getPermissionsForRole } from '~/server/services/permissions';

export default defineEventHandler(async (event) => {
  try {
    // For simplicity, we're using a default user
    // In a real app, this would use authentication
    const defaultUserId = 'default-user';
    
    const user = await prisma.user.findUnique({
      where: { id: defaultUserId },
      include: {
        userAchievements: {
          include: {
            achievement: true
          }
        },
        modulesProgress: {
          include: {
            module: true
          }
        },
        lessonsCompleted: {
          include: {
            lesson: true
          }
        }
      }
    });
    
    if (!user) {
      return createError({
        statusCode: 404,
        statusMessage: 'User not found'
      });
    }
    
    // Get permissions based on the user's role
    const role = user.role || 'STUDENT';
    const permissions = getPermissionsForRole(role);
    
    // Transform the data to a more convenient format for the frontend
    const transformedUser = {
      id: user.id,
      name: user.name,
      streak: user.streak,
      lastLogin: user.lastLogin,
      skillsLearned: user.skillsLearned,
      xpPoints: user.xpPoints,
      overallProgress: user.overallProgress,
      role: role,
      permissions: permissions,
      createdAt: user.createdAt,
      achievements: user.userAchievements.map((ua: any) => ({
        id: ua.achievement.id,
        name: ua.achievement.name,
        description: ua.achievement.description,
        icon: ua.achievement.icon,
        earned: ua.earned,
        earnedDate: ua.earnedDate
      })),
      moduleProgress: user.modulesProgress.map((mp: any) => ({
        moduleId: mp.module.id,
        title: mp.module.title,
        progress: mp.progress
      })),
      completedLessons: user.lessonsCompleted.map((lc: any) => lc.lessonId)
    };
    
    return transformedUser;
  } catch (error) {
    console.error('Error fetching user:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Error fetching user'
    });
  }
});
