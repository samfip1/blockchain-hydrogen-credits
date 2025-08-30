const { prisma } = require('../config/database');

async function getProducerById(producerId) {
  try {
    const producer = await prisma.producer.findUnique({
      where: { id: parseInt(producerId) },
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
