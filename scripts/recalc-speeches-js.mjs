// scripts/recalc-speeches-js.mjs
// Lee speeches.js, recalcula iraScore con nuevos pesos (sin P8) y muestra el mapping.
// Uso: node scripts/recalc-speeches-js.mjs

import { speeches } from '../src/data/speeches.js';

const WEIGHTS = [0.20, 0.20, 0.10, 0.20, 0.20, 0.05, 0.05]; // P1-P7

console.log('\n═══════════════════════════════════════════════════════');
console.log('  NUEVOS iraScore (sin P8, pesos actualizados)');
console.log('═══════════════════════════════════════════════════════\n');

for (const s of speeches) {
  const params = s.params ?? [];
  // Tomar solo los primeros 7 (ignorar P8 si existe)
  const scores = params.slice(0, 7).map(p => p.value ?? 0);
  const newIra = scores.reduce((sum, v, i) => sum + v * (WEIGHTS[i] ?? 0), 0);
  const rounded = Math.round(newIra * 100) / 100;

  const diff = rounded - s.iraScore;
  const sign = diff >= 0 ? '+' : '';
  console.log(`${s.id}`);
  console.log(`  iraScore: ${s.iraScore} → ${rounded}  (${sign}${Math.round(diff * 100) / 100})`);
  console.log(`  scores: [${scores.join(', ')}]\n`);
}
