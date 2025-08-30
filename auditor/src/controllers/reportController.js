const express = require('express');
const { checkProducerLicense } = require('../services/producerService');
const { fetchMonthlyData } = require('../services/dataService');
const { calculateEfficiency, getTotalH2 } = require('../services/calculationService');
const { submitToValidator } = require('../services/validatorService');

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { producer_id } = req.body;
    
    if (!producer_id) {
      return res.status(400).json({ error: 'producer_id required' });
    }

    // Check license
    const hasLicense = await checkProducerLicense(producer_id);
    if (!hasLicense) {
      return res.status(403).json({ error: 'Producer not licensed' });
    }

    // Fetch monthly data
    const monthlyData = await fetchMonthlyData(producer_id);
    
    // Calculate metrics
    const avgEfficiency = calculateEfficiency(monthlyData);
    const totalH2 = getTotalH2(monthlyData);

    // Submit to validator (not returned to user)
    await submitToValidator({
      producer_id,
      avg_monthly_efficiency: avgEfficiency,
      total_h2_generated: totalH2
    });

    // Return only efficiency to user
    res.json({
      success: true,
      producer_id,
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
