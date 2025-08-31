import { simulator, simulatorRO } from '../chains/contract.js';
import { toScaled, kgToScaled, inrToScaled } from '../utils/scale.js';
import { resolveRateForScheme } from './subsidyEngine.js';

export async function registerProject({ producer, state, scheme, milestoneKg }) {
  const target = kgToScaled(milestoneKg);
  const tx = await simulator.registerProject(producer, state, scheme, target);
  const rc = await tx.wait();
  // projectId is returned; ethers v6 returns it via logs or return data
  const projectId = Number(rc.logs?.[0]?.args?.projectId ?? rc.logs?.[0]?.args?.[0] ?? 0);
  return { projectId };
}

export async function setEligibilityCriteria({ projectId, maxCI, renewableRequired, minLVA, equipmentApproved }) {
  const maxCIscaled = toScaled(maxCI); // kgCO2e/kg scaled
  const tx = await simulator.setEligibilityCriteria(projectId, maxCIscaled, renewableRequired, minLVA, equipmentApproved);
  await tx.wait();
  return { ok: true };
}

export async function submitSensorData({ projectId, hydrogenKg, carbonIntensity, renewablePct, source, cid }) {
  const h2 = toScaled(hydrogenKg);
  const ci = toScaled(carbonIntensity);
  const tx = await simulator.submitSensorData(projectId, h2, ci, renewablePct, source, cid || '');
  const rc = await tx.wait();
  const sensorId = Number(rc.logs?.[0]?.args?.sensorId ?? rc.logs?.[0]?.args?.[0] ?? 0);
  return { sensorId };
}

export async function verifySensorByOracle({ sensorId, scheme }) {
  const rateScaled = resolveRateForScheme(scheme);
  const tx = await simulator.verifySensorDataByOracle(sensorId, rateScaled);
  const rc = await tx.wait();
  // decode return values with interface (ethers v6 captures via 'result')
  const amountINRScaled = rc.logs ? null : null; // we’ll re-read from event for clarity
  // read event SensorDataVerified
  const ev = rc.logs?.map(l => {
    try { return simulator.interface.parseLog(l); } catch { return null; }
  }).find(e => e && e.name === 'SensorDataVerified');
  const out = ev ? {
    amountINRScaled: ev.args.amountINR,
    amountETHWei: ev.args.amountETHWei
  } : null;
  return out;
}

export async function computeSubsidyForProject({ projectId, scheme }) {
  const rateScaled = resolveRateForScheme(scheme);
  const [inr, ethWei] = await simulatorRO.computeSubsidyForProject(projectId, rateScaled);
  return { amountINRScaled: inr, amountETHWei: ethWei };
}

export async function getProject(id) {
  const p = await simulatorRO.getProject(id);
  return p;
}

export async function getSensor(id) {
  const s = await simulatorRO.getSensor(id);
  return s;
}
