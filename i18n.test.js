// Proverava da mađarski i srpski prevod imaju iste ključeve (ništa ne fali ni u jednom jeziku).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import hu from './hu.js';
import sr from './sr.js';

function shape(obj, prefix = '') {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix + k;
    if (Array.isArray(v)) out.push(`${key}[${v.length}]`);
    else if (v && typeof v === 'object') out.push(...shape(v, key + '.'));
    else out.push(`${key}:${typeof v}`);
  }
  return out.sort();
}

test('HU i SR prevodi imaju iste ključeve', () => {
  assert.deepEqual(shape(sr), shape(hu));
});

test('nijedan prevod nije prazan', () => {
  const walk = (o, path) => Object.entries(o).forEach(([k, v]) => {
    if (typeof v === 'string') assert.ok(v.trim().length > 0, `${path}.${k} je prazan`);
    else if (v && typeof v === 'object') walk(v, `${path}.${k}`);
  });
  walk(hu, 'hu'); walk(sr, 'sr');
});
