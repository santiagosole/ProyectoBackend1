// processData.js

/**
 * Simula la ejecución de un proceso hijo o una transformación interna.
 * @param {string} data - La cadena de texto a procesar.
 * @returns {string} La cadena de texto procesada.
 */
const _transformDataInternal = (data) => {
  // En un escenario real, aquí se podría invocar a un proceso hijo real
  // o realizar una operación compleja que queramos espiar/mockear.
  return `Procesado internamente: ${data}`;
};

/**
 * Procesa una cadena de texto según el modo definido en las variables de entorno.
 * @param {string} input - La cadena de texto a procesar.
 * @returns {string} La cadena de texto transformada o la original si el modo es inválido/indefinido.
 */
export const processData = (input) => {
  const mode = process.env.PROCESS_MODE;

  internal._transformDataInternal(input); // Llamada a la función interna usando el objeto exportado para que Jest pueda espiarla

  switch (mode) {
    case "UPPERCASE":
      return input.toUpperCase();
    case "LOWERCASE":
      return input.toLowerCase();
    case "REVERSE":
      return input.split("").reverse().join("");
    default:
      return input;
  }
};

export const internal = {
  _transformDataInternal,
};