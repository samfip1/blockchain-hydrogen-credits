const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function connectDatabase() {
  try {
    await prisma.$connect();
    return prisma;
  } catch (error) {
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

module.exports = {
  prisma,
  connectDatabase
};
