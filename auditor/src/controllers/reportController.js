const express = require('express');
const { checkProducerLicense } = require('../services/producerService');
const { fetchMonthlyData } = require('../services/dataService');
const { calculateEfficiency, getTotalH2 } = require('../services/calculationService');
const { submitToContractGenerator } = require('../services/validatorService');

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { plantId } = req.body;
    
    if (!plantId) {
      return res.status(400).json({ error: 'plantId required' });
    }

    // Check license
    const hasLicense = await checkProducerLicense(plantId);
    if (!hasLicense) {
      return res.status(403).json({ error: 'Producer not licensed' });
    }

    // Fetch monthly data
    const monthlyData = await fetchMonthlyData(plantId);
    
    // Calculate metrics
    const avgEfficiency = calculateEfficiency(monthlyData);
    const totalH2 = getTotalH2(monthlyData);
    
    // Submit to validator (not returned to user)
    await submitToContractGenerator({
      plantId,
      avg_monthly_efficiency: avgEfficiency,
      total_h2_generated: totalH2
    });

    // Return efficiency to user
    res.json({
      success: true,
      plantId,
      average_monthly_efficiency: avgEfficiency
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Processing failed',
      details: error.message 
    });
  }
});

module.exports = router;
