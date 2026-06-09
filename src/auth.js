import readline from "node:readline";

export function validateToken(token) {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf8"));
    if (!decoded || !decoded.role || (decoded.role !== "admin" && decoded.role !== "user")) {
      return { valid: false, error: "Invalid token: missing or invalid role" };
    }
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

export function guardRoute(token, route) {
  const PUBLIC_ROUTES = ["/login", "/register", "/home"]; // Rutas públicas de ejemplo

  if (PUBLIC_ROUTES.includes(route)) {
    return { authorized: true };
  }

  const { valid, decoded, error } = validateToken(token);

  if (!valid) {
    return { authorized: false, error: `Invalid token: ${error}` };
  }

  if (decoded.role === "admin") {
    return { authorized: true }; // Administradores tienen acceso libre
  }

  if (decoded.role === "user") {
    if (route.startsWith("/user")) {
      return { authorized: true };
    } else {
      return { authorized: false, error: "Unauthorized: users can only access /user routes" };
    }
  }

  return { authorized: false, error: "Unauthorized: invalid role" }; // En cualquier otro caso, no autorizado
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

const { authorized } = guardRoute(token, route);

if (authorized) {
  console.log("Access granted");
} else {
  console.log("Access denied");
}
