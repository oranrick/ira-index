// Puente de línea de órdenes con src/lib/margen.js, para que las fichas usen el mismo cálculo que la web.
// Uso: node margen_cli.mjs '{"p1": {"U":1,"G":2,"GC":3,"I":0,"C":0,"A":0,"Cp":4}, "p2": {"E":0,"P":3,"N":1}}'
import { calcularP1, calcularP2 } from '../../src/lib/margen.js';

const entrada = JSON.parse(process.argv[2] ?? '{}');
const salida = {};
if (entrada.p1) salida.p1 = calcularP1(entrada.p1);
if (entrada.p2) salida.p2 = calcularP2(entrada.p2);
process.stdout.write(JSON.stringify(salida));
