import { env } from "../config/env.js";
import readline from "node:readline";

/**
 * Lab: process.env + stdin (clase CONFIG_LEVEL).
 * Entrada: líneas hasta EOF — "get" imprime según CONFIG_LEVEL; "set valor" actualiza env.configLevel (sin salida).
 * Ejecutar: npm run config:level  (stdin: teclado o redirección desde archivo)
 */
function messageForConfigLevel() {
  const level = env.configLevel;
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
    env.configLevel = trimmed.slice(4);
  }
}