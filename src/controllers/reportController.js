const express = require('express');
const { checkProducerLicense } = require('../services/producerService');
const { checkData } = require('../services/dataService');
const { calculateEfficiency, getTotalH2 } = require('../services/calculationService');
const { submitToContractGenerator } = require('../services/validatorService');

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { summaries } = req.body;
    
    if (!summaries) {
      return res.status(400).json({ error: 'required' });
    }
    const plantId=summaries[0].plantId;
    
    // Check license
    const hasLicense = await checkProducerLicense(plantId);
    if (!hasLicense) {
      return res.status(403).json({ error: 'Producer not licensed' });
    }

    // Fetch monthly data
    const monthlyData = await checkData(plantId,summaries);
    
    if(monthlyData.size()===0)  {
      return res.json({
      success: false,
      plantId,
      message:"Error in your data."
    });
    }
    // Calculate metrics
    const avgEfficiency = calculateEfficiency(monthlyData);
    const totalH2 = getTotalH2(monthlyData);


    await submitToContractGenerator({
      plantId,
      avg_monthly_efficiency: avgEfficiency,
      total_h2_generated: totalH2
    });

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
