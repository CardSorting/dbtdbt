import prisma from '~/server/services/prisma';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    
    if (!id) {
      return createError({
        statusCode: 400,
        statusMessage: 'Module ID is required'
      });
    }
    
    const module = await prisma.module.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
    
    if (!module) {
      return createError({
        statusCode: 404,
        statusMessage: 'Module not found'
      });
    }
    
    return module;
  } catch (error) {
    console.error(`Error fetching module with id ${event.context.params?.id}:`, error);
    return createError({
      statusCode: 500,
      statusMessage: 'Error fetching module'
    });
  }
});
