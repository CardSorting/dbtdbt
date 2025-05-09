import prisma from '~/server/services/prisma';

export default defineEventHandler(async (event) => {
  try {
    const modules = await prisma.module.findMany({
      orderBy: {
        order: 'asc'
      }
    });
    
    return modules;
  } catch (error) {
    console.error('Error fetching modules:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Error fetching modules'
    });
  }
});
