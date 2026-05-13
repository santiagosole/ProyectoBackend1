import readline from "node:readline";
import pino from "pino";
import { Registry, Counter, Histogram } from "prom-client";

const logger = pino(
  { level: "info" },
  pino.destination({ sync: true, fd: 1 })
);

const register = new Registry();

const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total de peticiones procesadas",
  registers: [register],
});

const httpRequestDurationSeconds = new Histogram({
  name: "http_request_duration_seconds",
  help: "Latencia de peticiones en segundos",
  registers: [register],
  buckets: [0.1, 0.5, 1],
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Latencia simulada entre 10 y 50 ms (inclusive). */
function randomLatencyMs() {
  return 10 + Math.floor(Math.random() * 41);
}

async function processRequest(reqId) {
  const start = process.hrtime.bigint();
  await sleep(randomLatencyMs());
  const elapsedNs = process.hrtime.bigint() - start;
  const durationSeconds = Number(elapsedNs) / 1e9;

  httpRequestsTotal.inc();
  httpRequestDurationSeconds.observe(durationSeconds);

  logger.info({ reqId }, "Procesando peticion");
}

const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

const lines = [];
for await (const line of rl) {
  lines.push(line.trim());
}

const n = parseInt(lines[0], 10);
for (let i = 1; i <= n && i < lines.length; i++) {
  await processRequest(lines[i]);
}

process.stdout.write(await register.metrics());
