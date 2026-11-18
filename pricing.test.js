// Pokretanje: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateOrder, tierIndex, unitPrice, SMALL_PRICES, LARGE_PRICES } from './pricing.js';

const total = (items) => calculateOrder(items).total;

test('cenovnik odgovara originalnoj tabeli', () => {
  assert.deepEqual(SMALL_PRICES['9x13'], [40, 30, 25, 20, 18]);
  assert.deepEqual(SMALL_PRICES['10x15'], [50, 40, 30, 25, 20]);
  assert.deepEqual(SMALL_PRICES['13x18'], [60, 50, 40, 35, 30]);
  assert.deepEqual(SMALL_PRICES['15x20'], [80, 70, 60, 55, 50]);
  assert.deepEqual(LARGE_PRICES, { '20x25': 250, '20x30': 300, '25x30': 350, '25x38': 400 });
});

test('granice nivoa popusta', () => {
  const cases = [[1, 0], [10, 0], [11, 1], [20, 1], [21, 2], [50, 2], [51, 3], [100, 3], [101, 4], [500, 4]];
  for (const [n, t] of cases) assert.equal(tierIndex(n), t, `${n} kom → nivo ${t}`);
});

test('10×15 na graničnim količinama', () => {
  assert.equal(total([{ size: '10x15', qty: 10 }]), 500);
  assert.equal(total([{ size: '10x15', qty: 11 }]), 440);
  assert.equal(total([{ size: '10x15', qty: 20 }]), 800);
  assert.equal(total([{ size: '10x15', qty: 21 }]), 630);
  assert.equal(total([{ size: '10x15', qty: 50 }]), 1500);
  assert.equal(total([{ size: '10x15', qty: 51 }]), 1275);
  assert.equal(total([{ size: '10x15', qty: 100 }]), 2500);
  assert.equal(total([{ size: '10x15', qty: 101 }]), 2020);
});

test('svi mali formati u svakom nivou', () => {
  const reps = [5, 15, 30, 75, 120];
  for (const size of Object.keys(SMALL_PRICES)) {
    reps.forEach((qty, tier) => {
      assert.equal(total([{ size, qty }]), qty * SMALL_PRICES[size][tier], `${size} × ${qty}`);
    });
  }
});

test('mešani mali formati dele isti nivo popusta', () => {
  // 5 + 6 = 11 malih → nivo 11–20
  assert.equal(total([{ size: '9x13', qty: 5 }, { size: '15x20', qty: 6 }]), 5 * 30 + 6 * 70);
});

test('veliki formati imaju fiksnu cenu i ne menjaju nivo (pretpostavka – potvrditi)', () => {
  assert.equal(total([{ size: '20x30', qty: 30 }]), 9000);
  const r = calculateOrder([{ size: '10x15', qty: 10 }, { size: '25x38', qty: 5 }]);
  assert.equal(r.tier, 0);
  assert.equal(r.total, 10 * 50 + 5 * 400);
});

test('kombinacija iz demo porudžbine', () => {
  const r = calculateOrder([
    { size: '10x15', qty: 9 }, { size: '13x18', qty: 1 }, { size: '15x20', qty: 1 }, { size: '20x30', qty: 1 },
  ]);
  assert.equal(r.smallCount, 11);
  assert.equal(r.total, 9 * 40 + 50 + 70 + 300);
  assert.equal(r.toNextTier, 10);
});

test('stavke sa količinom 0 se ignorišu, prazna korpa je 0', () => {
  assert.equal(total([]), 0);
  assert.equal(total([{ size: '10x15', qty: 0 }]), 0);
});

test('nepoznat format baca grešku', () => {
  assert.throws(() => unitPrice('30x40', 0));
});
