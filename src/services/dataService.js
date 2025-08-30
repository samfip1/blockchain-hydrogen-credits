const { fetchFromThirdParty } = require("./yourFetchFile"); // adjust path if needed

async function checkData(plantId, summaries) {
  try {
    // Get simulated real-time data
    const realTimeData = await fetchFromThirdParty(summaries);
    if (!realTimeData || realTimeData.length === 0) {
      throw new Error('No production data found');
    }

    const isWithinTolerance = (realVal, refVal, percent = 9) => {
      const lower = refVal * (1 - percent / 100);
      const upper = refVal * (1 + percent / 100);
      return realVal >= lower && realVal <= upper;
    };

    for (let i = 0; i < realTimeData.length; i++) {
      const real = realTimeData[i];
      const ref = summaries[i];

      if (
        !isWithinTolerance(real.hydrogenProduced, ref.hydrogenProduced) ||
        !isWithinTolerance(real.energyConsumed, ref.energyConsumed)
      ) {

        return [];
      }
    }

    return realTimeData.map(item => ({
      h2_production: item.hydrogenProduced,
      energy_used: item.energyConsumed
    }));

  } catch (error) {
    throw new Error(`Data fetch failed: ${error.message}`);
  }
}

module.exports = {
  checkData
};
