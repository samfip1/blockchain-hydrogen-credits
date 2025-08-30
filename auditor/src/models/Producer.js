const { prisma } = require('../config/database');

async function getProducerById(plantId) {
  try {
    const producer = await prisma.producer.findUnique({
      where: { id: parseInt(plantId) },
      select: {
        id: true,
        has_license: true
      }
    }); 
    return producer;
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

module.exports = {
  getProducerById
};
