const readline = require('readline');
const { spawn } = require('child_process');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
let inputLines = [];
let numberOfCommands = 0;

rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return; // Ignorar líneas vacías de espaciado

  if (numberOfCommands === 0) {
    numberOfCommands = parseInt(trimmed, 10);
  } else {
    inputLines.push(trimmed);
    if (inputLines.length === numberOfCommands) {
      processCommands(inputLines);
      rl.close();
    }
  }
});

// Estado en memoria
const adoptions = [];
let idCounter = 1;

/**
 * Invoca el proceso hijo para realizar la validación de adopciones
 */
function validateAdoption(userId, petId) {
  return new Promise((resolve) => {
    const child = spawn('node', ['validationWorker.js', userId, petId], {
      env: { ...process.env }
    });

    let stdoutData = '';
    let stderrData = '';

    child.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    child.on('close', (code) => {
      if (code !== 0) {
        resolve({ valid: false, status: 'rejected', reason: `Worker exited with code ${code}. Error: ${stderrData}` });
        return;
      }
      try {
        const result = JSON.parse(stdoutData.trim());
        resolve(result);
      } catch (e) {
        resolve({ valid: false, status: 'rejected', reason: 'Failed to parse worker response' });
      }
    });
  });
}

/**
 * Procesa un comando individual y retorna la respuesta JSON correspondiente
 */
async function handleCommand(command) {
  const { method, url, body } = command;

  if (!method || !url) {
    return { status: 400, error: 'Bad Request', details: 'Missing method or url' };
  }

  // Ruta base: /adoptions
  if (url === '/adoptions') {
    if (method === 'GET') {
      return { status: 200, data: adoptions };
    } 
    
    if (method === 'POST') {
      if (!body || !body.userId || !body.petId) {
        return { status: 400, error: 'Bad Request', details: 'Missing userId or petId in body' };
      }

      const { userId, petId } = body;
      // Lanzamos proceso hijo para validar
      const validationResult = await validateAdoption(userId, petId);

      const status = validationResult.status || 'approved';

      const newAdoption = {
        id: String(idCounter++),
        userId,
        petId,
        status
      };

      adoptions.push(newAdoption);
      return { status: 201, data: newAdoption };
    }

    return { status: 405, error: 'Method Not Allowed' };
  }

  // Ruta específica: /adoptions/:id
  if (url.startsWith('/adoptions/')) {
    const parts = url.split('/');
    const id = parts[2];

    if (!id) {
      return { status: 400, error: 'Bad Request', details: 'Invalid adoption ID' };
    }

    if (method === 'GET') {
      const adoption = adoptions.find(a => a.id === id);
      if (adoption) {
        return { status: 200, data: adoption };
      }
      return { status: 404, error: 'Not Found', details: `Adoption with ID ${id} not found` };
    }

    return { status: 405, error: 'Method Not Allowed' };
  }

  return { status: 404, error: 'Not Found', details: `Route ${url} not found` };
}

/**
 * Procesa secuencialmente la lista de comandos acumulados
 */
async function processCommands(commands) {
  for (const commandStr of commands) {
    try {
      const command = JSON.parse(commandStr);
      const result = await handleCommand(command);
      console.log(JSON.stringify(result));
    } catch (err) {
      console.log(JSON.stringify({ status: 400, error: 'Invalid JSON format', details: err.message }));
    }
  }
}
