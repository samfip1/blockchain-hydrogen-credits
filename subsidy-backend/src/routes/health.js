import { Router } from 'express';
import { pushEthInrRateToChainIfChanged } from '../services/subsidyEngine.js';

const r = Router();

r.get('/health', (_req, res) => res.json({ ok: true }));

r.post('/admin/push-ethinr', async (_req, res) => {
  const out = await pushEthInrRateToChainIfChanged();
  res.json(out);
});

export default r;
