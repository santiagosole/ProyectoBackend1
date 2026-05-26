/**
 * Lab Docker: suma de enteros pares. Stdin línea 1 = N, línea 2 = N números separados por espacio.
 * Probar sin imagen: node src/index.mjs < entrada.txt
 */
import readline from "node:readline";

// Setup para leer la entrada estándar linea por linea
const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

const lines = [];
// Almacenamos las líneas de entrada en un array temporal
for await (const line of rl) {
  lines.push(line.trim());
}

// Parseamos la cantidad de elementos y los convertimos en un array de enteros
const n = parseInt(lines[0], 10);
const nums = lines[1].split(/\s+/).map(Number);

// Variable para acumular la suma de los números pares
let sum = 0;

// Filtramos y sumamos sólo los números pares según los requisitos del laboratorio
for (let i = 0; i < n && i < nums.length; i++) {
  if (nums[i] % 2 === 0) {
    sum += nums[i];
  }
}

// Devolvemos el resultado por consola para que lo capture Docker
console.log(sum);
