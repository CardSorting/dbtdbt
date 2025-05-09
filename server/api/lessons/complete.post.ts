import prisma from '~/server/services/prisma';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { userId, lessonId } = body;
    
    if (!userId || !lessonId) {
      return createError({
        statusCode: 400,
        statusMessage: 'User ID and Lesson ID are required'
      });
    }
    
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return createError({
        statusCode: 404,
        statusMessage: 'User not found'
      });
    }
    
    // Check if the lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: true
      }
    });
    
    if (!lesson) {
      return createError({
        statusCode: 404,
        statusMessage: 'Lesson not found'
      });
    }
    
    // Check if the lesson is already completed
    const existingCompletion = await prisma.lessonCompleted.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      }
    });
    
    if (existingCompletion) {
      return {
        success: true,
        message: 'Lesson already completed',
        wasAlreadyCompleted: true
      };
    }
    
    // Create a transaction to update all related records
    const result = await prisma.$transaction(async (tx: any) => {
      // Mark the lesson as completed
      await tx.lessonCompleted.create({
        data: {
          userId,
          lessonId
        }
      });
      
      // Add XP points to the user
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          xpPoints: { increment: lesson.xpReward },
          skillsLearned: { increment: 1 }
        }
      });
      
      // Get the module progress
      const moduleProgress = await tx.moduleProgress.findUnique({
        where: {
          userId_moduleId: {
            userId,
            moduleId: lesson.moduleId
          }
        },
        include: {
          module: {
            include: {
              lessons: true
            }
          }
        }
      });
      
      if (!moduleProgress) {
        throw new Error('Module progress not found');
      }
      
      // Get all completed lessons for this module
      const completedLessons = await tx.lessonCompleted.findMany({
        where: {
          userId,
          lesson: {
            moduleId: lesson.moduleId
          }
        }
      });
      
      // Calculate progress percentage
      const totalLessons = moduleProgress.module.lessons.length;
      const completedCount = completedLessons.length;
      const progressPercentage = Math.round((completedCount / totalLessons) * 100);
      
      // Update module progress
      await tx.moduleProgress.update({
        where: {
          userId_moduleId: {
            userId,
            moduleId: lesson.moduleId
          }
        },
        data: {
          progress: progressPercentage
        }
      });
      
      // Check if module is completed to unlock next module
      if (progressPercentage === 100) {
        // Find the next module
        const nextModule = await tx.module.findFirst({
          where: {
            order: { gt: lesson.module.order }
          },
          orderBy: {
            order: 'asc'
          }
        });
        
        if (nextModule) {
          // Unlock the next module
          await tx.module.update({
            where: { id: nextModule.id },
            data: { unlocked: true }
          });
        }
      }
      
      // Calculate overall progress
      const allModules = await tx.module.findMany({
        include: {
          lessons: true
        }
      });
      
      const allCompletedLessons = await tx.lessonCompleted.findMany({
        where: { userId }
      });
      
      const totalLessonsCount = allModules.reduce((sum: number, module: any) => sum + module.lessons.length, 0);
      const totalCompletedCount = allCompletedLessons.length;
      
      const overallProgressPercentage = Math.round((totalCompletedCount / totalLessonsCount) * 100);
      
      // Update user's overall progress
      await tx.user.update({
        where: { id: userId },
        data: {
          overallProgress: overallProgressPercentage
        }
      });
      
      return {
        success: true,
        xpEarned: lesson.xpReward,
        newTotalXp: updatedUser.xpPoints,
        moduleProgress: progressPercentage,
        overallProgress: overallProgressPercentage,
        isModuleComplete: progressPercentage === 100
      };
    });
    
    return result;
  } catch (error) {
    console.error('Error completing lesson:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Error completing lesson'
    });
  }
});
