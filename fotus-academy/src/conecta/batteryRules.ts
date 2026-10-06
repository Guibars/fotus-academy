import type { Battery, Inverter } from './types';
import { DYNESS_BATTERIES, SECPOWER_BATTERY } from './constants.ts';

export function isDynessBattery(batteryName: string): boolean {
  return DYNESS_BATTERIES.some(battery => battery.name === batteryName);
}

export function isSecpowerBattery(batteryName: string): boolean {
  return batteryName === SECPOWER_BATTERY.name;
}

export function isRestrictedLvBattery(batteryName: string): boolean {
  return isDynessBattery(batteryName) || isSecpowerBattery(batteryName);
}

function isPortfolioLvInverterCompatible(inverter: Inverter | undefined, voltage: number, allowGoodWe: boolean): boolean {
  if (!inverter) return false;
  const name = inverter.name.toLowerCase();
  // A bateria LV não pode ser oferecida para uma entrada de alta tensão.
  const range = inverter.batteryVoltageRange.match(/([\d.]+)\s*v?\s*[-–~]\s*([\d.]+)/i);
  if (!range || Number(range[1]) > voltage || Number(range[2]) < voltage) return false;

  if (name.includes('deye')) {
    return inverter.gridType === 'off-grid' || inverter.gridType === 'split-phase' ||
      (inverter.gridType === 'monophasic' && !name.includes('127v'));
  }
  if (name.includes('goodwe')) return allowGoodWe && inverter.gridType === 'monophasic';
  if (name.includes('solis')) return true;
  if (name.includes('solplanet')) {
    return inverter.gridType === 'monophasic' && !name.includes('127v');
  }
  return false;
}

/** Compatibilidades das baterias Dyness LV aprovadas para o portfólio Fotus. */
export function isDynessInverterCompatible(inverter: Inverter | undefined): boolean {
  return isPortfolioLvInverterCompatible(inverter, 51.2, true);
}

/** Sec Power: não permite nenhum inversor GoodWe, nem os monofásicos. */
export function isSecpowerInverterCompatible(inverter: Inverter | undefined): boolean {
  return isPortfolioLvInverterCompatible(inverter, SECPOWER_BATTERY.voltage, false);
}

export function isCatalogLvInverterCompatible(batteryName: string, inverter: Inverter | undefined): boolean {
  if (isDynessBattery(batteryName)) return isDynessInverterCompatible(inverter);
  if (isSecpowerBattery(batteryName)) return isSecpowerInverterCompatible(inverter);
  return false;
}

/** Mantém a energia de referência e limita o DoD ao máximo do fabricante. */
export function getBatteryUsefulEnergyKwh(battery: Battery, dod: number): number {
  const effectiveDod = Math.max(0, Math.min(dod, battery.maximumDod ?? 100));
  if (battery.recommendedDod) {
    return battery.usefulEnergyKwh * effectiveDod / battery.recommendedDod;
  }
  if (battery.name.includes('LX-A5.0-30')) return 5;
  return battery.capacityKwh * effectiveDod / 100;
}
