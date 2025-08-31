import { Router } from 'express';
import { registerProject, setEligibilityCriteria, getProject, computeSubsidyForProject } from '../services/simulator.js';
import { fromScaled, weiToEth } from '../utils/scale.js';

const r = Router();

/** Register project */
r.post('/projects', async (req, res) => {
  try {
    const { producer, state, scheme, milestoneKg } = req.body;
    const { projectId } = await registerProject({ producer, state, scheme, milestoneKg });
    res.json({ projectId });
  } catch (e) {
    res.status(400).json({ error: e.shortMessage || e.message });
  }
});

/** Set eligibility */
r.post('/projects/:id/criteria', async (req, res) => {
  try {
    const projectId = Number(req.params.id);
    const { maxCI, renewableRequired, minLVA, equipmentApproved } = req.body;
    await setEligibilityCriteria({ projectId, maxCI, renewableRequired, minLVA, equipmentApproved });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.shortMessage || e.message });
  }
});

/** Compute subsidy (no transfer) */
r.get('/projects/:id/subsidy', async (req, res) => {
  try {
    const projectId = Number(req.params.id);
    const scheme = String(req.query.scheme || 'SIGHT-Production');
    const out = await computeSubsidyForProject({ projectId, scheme });
    res.json({
      projectId,
      scheme,
      amountINRScaled: out.amountINRScaled.toString(),
      amountINR: fromScaled(out.amountINRScaled),
      amountETHWei: out.amountETHWei.toString(),
      amountETH: weiToEth(out.amountETHWei)
    });
  } catch (e) {
    res.status(400).json({ error: e.shortMessage || e.message });
  }
});

/** Get project state */
r.get('/projects/:id', async (req, res) => {
  try {
    const p = await getProject(Number(req.params.id));
    res.json(p);
  } catch (e) {
    res.status(400).json({ error: e.shortMessage || e.message });
  }
});

export default r;
