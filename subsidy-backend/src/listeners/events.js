import { simulator } from '../chains/contract.js';

export function attachEventListeners() {
  simulator.on('ProjectRegistered', (projectId, producer, scheme) => {
    console.log(`[evt] ProjectRegistered id=${projectId} producer=${producer} scheme=${scheme}`);
  });
  simulator.on('EligibilitySet', (projectId) => {
    console.log(`[evt] EligibilitySet id=${projectId}`);
  });
  simulator.on('SensorDataSubmitted', (sensorId, projectId, source, cid) => {
    console.log(`[evt] SensorDataSubmitted sensor=${sensorId} project=${projectId} source=${source} cid=${cid}`);
  });
  simulator.on('SensorDataVerified', (sensorId, projectId, verifiedValue, amountINR, amountETHWei) => {
    console.log(`[evt] SensorDataVerified sensor=${sensorId} project=${projectId} verified=${verifiedValue} INR=${amountINR} wei=${amountETHWei}`);
  });
}
