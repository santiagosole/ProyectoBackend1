/**
 * Lab: métricas simuladas desde logs en texto.
 * Línea 1: N. Siguientes N: RESPONSE <status> <ms> o ERROR <code> <len>.
 * Salida: promedio de ms solo para status 200 (2 decimales) y cantidad de ERROR.
 * Ejecutar: npm run lab:log-metrics < archivo.txt
 */
import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

const lines = [];
for await (const line of rl) {
  lines.push(line.trim());
}

const n = parseInt(lines[0], 10);
let sum200 = 0;
let count200 = 0;
let errors = 0;

for (let i = 1; i <= n && i < lines.length; i++) {
  const parts = lines[i].split(/\s+/);
  const kind = parts[0];
  if (kind === "RESPONSE") {
    const status = parseInt(parts[1], 10);
    const ms = parseInt(parts[2], 10);
    if (status === 200) {
      sum200 += ms;
      count200++;
    }
  } else if (kind === "ERROR") {
    errors++;
  }
}

const avg = count200 === 0 ? 0 : sum200 / count200;
console.log(avg.toFixed(2));
console.log(String(errors));
