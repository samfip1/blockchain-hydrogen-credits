function calculateEfficiency(dailyData) {
  if (!dailyData || dailyData.length === 0) {
    return 0;
  }

  let totalEfficiency = 0;
  // console.log(dailyData);
  dailyData.forEach(day => {
    // Formula: efficiency = (H2_kg * 39.4) / energy_kwh * 100
    const dailyEfficiency = (day.h2_production * 39.4) / day.energy_used * 100;
    totalEfficiency += dailyEfficiency;
  });

  const avgEfficiency = totalEfficiency / dailyData.length;
  return parseFloat(avgEfficiency.toFixed(2));
}

function getTotalH2(dailyData) {
  if (!dailyData || dailyData.length === 0) {
    return 0;
  }

  const total = dailyData.reduce((sum, day) => sum + day.h2_production, 0);
  return parseFloat(total.toFixed(2));
}

module.exports = {
  calculateEfficiency,
  getTotalH2
};
