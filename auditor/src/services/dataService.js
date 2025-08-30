const { fetchFromThirdParty } = require('../config/thirdPartyApi');

async function fetchMonthlyData(producerId) {
  try {
    // Fetch daily data from third-party API/database
    const dailyData = await fetchFromThirdParty(producerId);
    
    if (!dailyData || dailyData.length === 0) {
      throw new Error('No production data found');
    }

    return dailyData;
  } catch (error) {
    throw new Error(`Data fetch failed: ${error.message}`);
  }
}

module.exports = {
  fetchMonthlyData
};
