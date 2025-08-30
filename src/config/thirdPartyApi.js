
async function fetchFromThirdParty(summaries) {
  try {

    // In production, this will be fetched from trusted source
    let realtimeData = [];

    summaries.forEach(element => {
      
      const addError = (value, percent = 9) => {
        let errorFactor = 1 + ((Math.random() * 2 - 1) * percent / 100);
        return parseFloat((value * errorFactor).toFixed(2));
      };

      realtimeData.push({
        companyId: element.companyId,
        plantId: element.plantId,
        milestone: element.milestone,
        hydrogenProduced: addError(element.hydrogenProduced),
        energyConsumed: addError(element.energyConsumed),
        carbonProduced: addError(element.carbonProduced)
      });
    });

    return realtimeData;

  } catch (error) {
    throw new Error(`Third-party API call failed: ${error.message}`);
  }
}

module.exports = {
  fetchFromThirdParty
};
