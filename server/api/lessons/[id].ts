import prisma from '~/server/services/prisma';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    
    if (!id) {
      return createError({
        statusCode: 400,
        statusMessage: 'Lesson ID is required'
      });
    }
    
    const lesson = await prisma.lesson.findUnique({
      where: { id },
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
    
    return lesson;
  } catch (error) {
    console.error(`Error fetching lesson with id ${event.context.params?.id}:`, error);
    return createError({
      statusCode: 500,
      statusMessage: 'Error fetching lesson'
    });
  }
});
