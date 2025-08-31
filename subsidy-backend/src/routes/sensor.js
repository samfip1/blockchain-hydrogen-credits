import { Router } from 'express';
import { submitSensorData, verifySensorByOracle, getSensor } from '../services/simulator.js';
import { fromScaled, weiToEth } from '../utils/scale.js';

const r = Router();

/** Ingest IoT batch (single) */
r.post('/sensor', async (req, res) => {
  try {
    const { projectId, hydrogenKg, carbonIntensity, renewablePct, source, cid } = req.body;
    const { sensorId } = await submitSensorData({ projectId, hydrogenKg, carbonIntensity, renewablePct, source, cid });
    res.json({ sensorId });
  } catch (e) {
    res.status(400).json({ error: e.shortMessage || e.message });
  }
});

/** Oracle verification (no transfer) */
r.post('/sensor/:id/verify', async (req, res) => {
  try {
    const sensorId = Number(req.params.id);
    const scheme = String(req.body.scheme || 'SIGHT-Production');
    const out = await verifySensorByOracle({ sensorId, scheme });
    if (!out) return res.json({ ok: true, note: "verified (event read failed), check logs" });
    res.json({
      sensorId,
      amountINRScaled: out.amountINRScaled.toString(),
      amountINR: fromScaled(out.amountINRScaled),
      amountETHWei: out.amountETHWei.toString(),
      amountETH: weiToEth(out.amountETHWei)
    });
  } catch (e) {
    res.status(400).json({ error: e.shortMessage || e.message });
  }
});

/** Read back sensor row */
r.get('/sensor/:id', async (req, res) => {
  try {
    const s = await getSensor(Number(req.params.id));
    res.json(s);
  } catch (e) {
    res.status(400).json({ error: e.shortMessage || e.message });
  }
});

export default r;
