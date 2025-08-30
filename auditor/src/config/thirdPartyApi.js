const data=require("./dummydata.json")
async function fetchFromThirdParty(plantId) {
  try {

    // Get data for producer here in format of [{h2_production: , energy_used: }]
    return data[plantId].productionData;

  } catch (error) {
    throw new Error(`Third-party API call failed: ${error.message}`);
  }
}

module.exports = {
  fetchFromThirdParty
};
