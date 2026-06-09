import readline from "node:readline";

export function validateToken(token) {
  if (!token) {
    return { valid: false, error: "Token no proporcionado" };
  }
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf8"));
    if (!decoded || typeof decoded !== "object" || !decoded.username || !decoded.role) {
      return { valid: false, error: "Token inválido: formato incorrecto, o le faltan propiedades username o role" };
    }
    const { role, username } = decoded; // Ahora extraemos 'username'
    if (role !== "admin" && role !== "user") {
      return { valid: false, error: "Token inválido: rol desconocido" };
    }
    return { valid: true, payload: { role, username } }; // Incluimos username en el payload
  } catch (error) {
    return { valid: false, error: "Token inválido: " + error.message };
  }
}

export function guardRoute(token, route) {
  const { valid, payload } = validateToken(token);

  if (!valid) {
    return false;
  }

  const { role } = payload;

  if (role === "admin") {
    return true;
  }

  if (role === "user") {
    return route.startsWith("/user");
  }

  return false;
}

const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

const lines = [];
for await (const line of rl) {
  lines.push(line.trim());
}

const token = lines[0];
const route = lines[1];

const authorized = guardRoute(token, route);

if (authorized) {
  console.log("Access granted");
} else {
  console.log("Access denied");
}
