const userId = process.argv[2];
const petId = process.argv[3];
const mode = (process.env.SIMULATION_MODE || 'normal').trim();

// Usuarios y mascotas simulados como válidos en el sistema
const validUsers = ['u1', 'u2', 'u3', 'user123', 'user456'];
const validPets = ['p1', 'p2', 'p3', 'pet123', 'pet456'];

function validate() {
  // Caso de IDs inválidos de forma explícita
  if (userId?.startsWith('invalid') || petId?.startsWith('invalid')) {
    return { valid: false, status: 'rejected', reason: 'Explicitly invalid ID provided.' };
  }

  if (mode === 'strict') {
    const isUserValid = validUsers.includes(userId);
    const isPetValid = validPets.includes(petId);

    if (!isUserValid || !isPetValid) {
      // En modo estricto, si no existen en la lista simulada, podemos cambiar el status a 'pending' o 'rejected'
      const status = (!isUserValid && !isPetValid) ? 'rejected' : 'pending';
      return { 
        valid: false, 
        status, 
        reason: `Strict Mode: Validation failed. User exist: ${isUserValid}, Pet exist: ${isPetValid}` 
      };
    }
  }

  // Si todo es exitoso o modo normal
  return { valid: true, status: 'approved' };
}

const result = validate();
console.log(JSON.stringify(result));
process.exit(0);
