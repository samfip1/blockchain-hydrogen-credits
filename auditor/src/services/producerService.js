const { getProducerById } = require('../models/Producer');

async function checkProducerLicense(producerId) {
  try {
    const producer = await getProducerById(producerId);
    
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
