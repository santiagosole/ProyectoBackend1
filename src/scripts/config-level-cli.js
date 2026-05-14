/**
 * Lab: process.env + stdin (clase CONFIG_LEVEL).
 * Entrada: líneas hasta EOF — "get" imprime según CONFIG_LEVEL; "set valor" actualiza process.env (sin salida).
 * Ejecutar: npm run config:level  (stdin: teclado o redirección desde archivo)
 */
import readline from "node:readline";

function messageForConfigLevel() {
  const level = process.env.CONFIG_LEVEL;
  if (level === "high") return "Configuración alta activada";
  if (level === "low") return "Configuración baja activada";
  return "Configuración por defecto activada";
}

const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

for await (const line of rl) {
  const trimmed = line.trim();
  if (trimmed === "get") {
    console.log(messageForConfigLevel());
    continue;
  }
  if (trimmed.startsWith("set ")) {
    process.env.CONFIG_LEVEL = trimmed.slice(4);
  }
}
