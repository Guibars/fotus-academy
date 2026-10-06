import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateHybrid } from '../src/conecta/calculations.ts';
import { calculateInstallments } from '../src/conecta/interest.ts';
import { BATTERIES_STOCK, SECPOWER_BATTERY, DYNESS_BATTERY } from '../src/conecta/constants.ts';
import { getBatteryUsefulEnergyKwh } from '../src/conecta/batteryRules.ts';

const config = battery => ({ dod: 80, safetyFactor: 10, simultaneityFactor: 100, autonomyDays: 1, selectedBatteryName: battery.name });
const load = [{ id: 'tv', name: 'TV', power: 150, quantity: 2, hours: 4 }];
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} differs from ${expected}`);

test('load quantity and usage determine peak power and daily energy', () => {
  const result = calculateHybrid(load, '220V', config(DYNESS_BATTERY));
  assert.equal(result.totalPower, 300);
  assert.equal(result.dailyConsumption, 1200);
  assert.equal(result.simultaneousPeak, 300);
  assert.ok(result.primaryInverter);
  assert.equal(result.primaryInverter.inverter.gridType, 'monophasic');
});

test('simultaneity changes inverter demand without reducing daily energy', () => {
  const result = calculateHybrid(load, '220V', { ...config(DYNESS_BATTERY), simultaneityFactor: 50 });
  assert.equal(result.simultaneousPeak, 150);
  assert.equal(result.dailyConsumption, 1200);
});

test('Secpower recommendations exclude GoodWe and incompatible 127 V networks', () => {
  for (const grid of ['220V', 'Split-Phase', 'Off-Grid']) {
    const result = calculateHybrid(load, grid, config(SECPOWER_BATTERY));
    assert.ok(result.primaryInverter);
    for (const solution of [result.primaryInverter, ...result.alternativeInverters]) {
      assert.ok(!solution.inverter.name.toLowerCase().includes('goodwe'));
    }
  }
  assert.equal(calculateHybrid(load, 'Mono-127V', config(SECPOWER_BATTERY)).primaryInverter, null);
});

test('required battery energy never uses a DoD above the manufacturer limit', () => {
  assert.equal(getBatteryUsefulEnergyKwh(SECPOWER_BATTERY, 100), getBatteryUsefulEnergyKwh(SECPOWER_BATTERY, 80));
  assert.equal(getBatteryUsefulEnergyKwh(DYNESS_BATTERY, 100), getBatteryUsefulEnergyKwh(DYNESS_BATTERY, 90));
});

test('capacity overflow returns an explicit warning and retains original demand', () => {
  const result = calculateHybrid([{ id: 'large', name: 'Load', power: 100000, quantity: 1, hours: 24 }], '220V', config(SECPOWER_BATTERY));
  assert.ok(result.warning);
  assert.equal(result.recommendedBattery.quantity, SECPOWER_BATTERY.parallelUnits);
  assert.ok(result.recommendedBattery.originalRequiredQuantity > result.recommendedBattery.quantity);
});

test('high voltage banks distribute equal series modules and preserve energy demand', () => {
  const battery = BATTERIES_STOCK.find(b => b.voltageType === 'HV');
  const result = calculateHybrid([{ id: 'hv', name: 'Load', power: 20000, quantity: 1, hours: 6 }], '380V', config(battery));
  assert.ok(result.primaryInverter);
  assert.ok(result.recommendedBattery.options.length);
  for (const option of result.recommendedBattery.options) {
    assert.equal(option.totalQuantity, option.totalBMUs * option.modulesPerBMU);
    assert.ok(option.modulesPerBMU >= 5);
    assert.equal(option.totalBMUs % result.primaryInverter.quantity, 0);
    assert.ok(option.totalQuantity * getBatteryUsefulEnergyKwh(battery, 80) * 1000 >= 132000);
  }
});

test('normal mode applies discount before the original credit card rate', () => {
  const cards = calculateInstallments(10000, 10, 0, false);
  assert.equal(cards.length, 21);
  const card = cards.find(item => item.months === 12);
  near(card.total, 10044.9);
  near(card.installment, 837.075);
});

test('entry mode charges interest only on the remaining balance', () => {
  const card = calculateInstallments(10000, 10, 2000, true).find(item => item.months === 12);
  near(card.financedTotal, 8928.8);
  near(card.total, 10928.8);
  near(card.installment, 744.0666666667);
  near(card.entry + card.installment * card.months, card.total);
});

test('full down payment removes financed installments and interest', () => {
  for (const card of calculateInstallments(10000, 0, 10000, true)) {
    assert.equal(card.installment, 0);
    assert.equal(card.total, 10000);
  }
});
