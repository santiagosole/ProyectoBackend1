import { Router } from 'express';
import { spawn } from 'child_process';

const router = Router();

// Estado en memoria
const adoptions = [];
let idCounter = 1;

/**
 * Invoca el proceso hijo para realizar la validación de adopciones
 */
function validateAdoption(userId, petId) {
  return new Promise((resolve) => {
    const child = spawn('node', ["./src/scripts/validationWorker.js", userId, petId], {
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

router.get('/', (req, res) => {
  res.status(200).json({ data: adoptions });
});

router.post('/', async (req, res) => {
  const { userId, petId } = req.body;

  if (!userId || !petId) {
    return res.status(400).json({ error: 'Bad Request', details: 'Missing userId or petId in body' });
  }

  const validationResult = await validateAdoption(userId, petId);
  const status = validationResult.status || 'approved';

  const newAdoption = {
    id: String(idCounter++),
    userId,
    petId,
    status
  };

  adoptions.push(newAdoption);
  res.status(201).json({ data: newAdoption });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const adoption = adoptions.find(a => a.id === id);

  if (adoption) {
    return res.status(200).json({ data: adoption });
  }
  res.status(404).json({ error: 'Not Found', details: `Adoption with ID ${id} not found` });
});

export default router;
