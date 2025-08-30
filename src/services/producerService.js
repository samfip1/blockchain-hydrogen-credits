const { getProducerById } = require('../models/Producer');

async function checkProducerLicense(plantId) {
  try {
    const producer = await getProducerById(plantId);
    
    if (!producer) {
      throw new Error('Producer not found');
    }
    
    return producer.has_license;
  } catch (error) {
    throw new Error(`License check failed: ${error.message}`);
  }
}

module.exports = {
  checkProducerLicense
};
