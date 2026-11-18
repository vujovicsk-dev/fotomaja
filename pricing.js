// Cenovnik preuzet sa originalnog sajta (foto-maja.com, „Fényképárlista / Cenovnik fotografija“).
// Sve cene su u dinarima po komadu.
//
// ⚠ POTVRDITI SA VLASNIKOM STUDIJA:
// Nivo količinskog popusta se računa po UKUPNOM broju MALIH fotografija u korpi
// (9×13, 10×15, 13×18 i 15×20 zajedno). Veliki formati imaju fiksnu cenu i NE ulaze
// u to brojanje. Sajt kaže samo „ukupan broj slika u korpi“, pa ovo treba proveriti.
// Ako veliki formati treba da se broje, promeni COUNT_LARGE_IN_TIER na true.
export const COUNT_LARGE_IN_TIER = false;

export const SMALL_PRICES = {
  '9x13': [40, 30, 25, 20, 18],
  '10x15': [50, 40, 30, 25, 20],
  '13x18': [60, 50, 40, 35, 30],
  '15x20': [80, 70, 60, 55, 50],
};

export const LARGE_PRICES = {
  '20x25': 250,
  '20x30': 300,
  '25x30': 350,
  '25x38': 400,
};

export const TIERS = [
  { min: 1, max: 10, label: '1–10' },
  { min: 11, max: 20, label: '11–20' },
  { min: 21, max: 50, label: '21–50' },
  { min: 51, max: 100, label: '51–100' },
  { min: 101, max: Infinity, label: '100+' },
];

export const SMALL_SIZES = Object.keys(SMALL_PRICES);
export const LARGE_SIZES = Object.keys(LARGE_PRICES);
export const ALL_SIZES = [...SMALL_SIZES, ...LARGE_SIZES];
export const DEFAULT_SIZE = '10x15';

// Ograničenje veličine fajla sa originalnog sajta: 20 KB – 25 MB po fotografiji.
export const MIN_FILE_BYTES = 20 * 1024;
export const MAX_FILE_BYTES = 25 * 1024 * 1024;

export const isSmall = (size) => Object.prototype.hasOwnProperty.call(SMALL_PRICES, size);
export const sizeLabel = (size) => size.replace('x', '×');

export function tierIndex(count) {
  if (count >= 101) return 4;
  if (count >= 51) return 3;
  if (count >= 21) return 2;
  if (count >= 11) return 1;
  return 0;
}

export function unitPrice(size, tier) {
  if (isSmall(size)) return SMALL_PRICES[size][tier];
  if (LARGE_PRICES[size] != null) return LARGE_PRICES[size];
  throw new Error(`Nepoznat format: ${size}`);
}

/**
 * items: [{ size: '10x15', qty: 2 }, ...]
 * Vraća stavke grupisane po formatu, ukupnu cenu i podatke o nivou popusta.
 */
export function calculateOrder(items) {
  const valid = items.filter((it) => it && it.qty > 0);
  const tierCount = valid
    .filter((it) => COUNT_LARGE_IN_TIER || isSmall(it.size))
    .reduce((sum, it) => sum + it.qty, 0);
  const smallCount = valid.filter((it) => isSmall(it.size)).reduce((s, it) => s + it.qty, 0);
  const prints = valid.reduce((s, it) => s + it.qty, 0);
  const tier = tierIndex(tierCount);

  const bySize = {};
  for (const it of valid) bySize[it.size] = (bySize[it.size] || 0) + it.qty;

  const lines = ALL_SIZES.filter((s) => bySize[s]).map((size) => {
    const unit = unitPrice(size, tier);
    return { size, qty: bySize[size], unit, subtotal: unit * bySize[size] };
  });
  const total = lines.reduce((s, l) => s + l.subtotal, 0);
  const toNextTier = tier < TIERS.length - 1 ? TIERS[tier + 1].min - tierCount : 0;

  return { lines, total, prints, smallCount, tierCount, tier, toNextTier };
}

export const formatDin = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
