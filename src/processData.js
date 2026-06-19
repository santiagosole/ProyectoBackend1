

// Función interna que simula una transformación de datos.
const _transformDataInternal = (data) => {
  // En un escenario real, aquí se podría invocar a un proceso hijo real
  // o realizar una operación compleja que queramos espiar/mockear.
  return `Procesado internamente: ${data}`;
};

// Procesa una cadena de texto, aplicando transformaciones según el modo configurado.
export const processData = (input) => {
  const mode = process.env.PROCESS_MODE;

  // Ejecutamos la función interna para simular una operación, útil para pruebas.
  internal._transformDataInternal(input);

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