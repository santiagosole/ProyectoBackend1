

import { jest } from "@jest/globals";
import { processData, internal } from "./processData.js";

describe("processData", () => {
  let originalEnv;
  let transformDataInternalSpy;

  beforeEach(() => {
    originalEnv = { ...process.env };
    transformDataInternalSpy = jest.spyOn(internal, "_transformDataInternal");
  });

  afterEach(() => {
    process.env = originalEnv;
    transformDataInternalSpy.mockRestore();
  });

  test("debería transformar el input a mayúsculas si PROCESS_MODE es UPPERCASE", () => {
    process.env.PROCESS_MODE = "UPPERCASE";
    const input = "hola mundo";
    const result = processData(input);
    expect(result).toBe("HOLA MUNDO");
    expect(transformDataInternalSpy).toHaveBeenCalledWith(input);
  });

  test("debería transformar el input a minúsculas si PROCESS_MODE es LOWERCASE", () => {
    process.env.PROCESS_MODE = "LOWERCASE";
    const input = "HOLA MUNDO";
    const result = processData(input);
    expect(result).toBe("hola mundo");
    expect(transformDataInternalSpy).toHaveBeenCalledWith(input);
  });

  test("debería invertir el input si PROCESS_MODE es REVERSE", () => {
    process.env.PROCESS_MODE = "REVERSE";
    const input = "olap";
    const result = processData(input);
    expect(result).toBe("palo");
    expect(transformDataInternalSpy).toHaveBeenCalledWith(input);
  });

  test("debería devolver el input sin cambios si PROCESS_MODE es undefined", () => {
    delete process.env.PROCESS_MODE;
    const input = "Hola Mundo";
    const result = processData(input);
    expect(result).toBe("Hola Mundo");
    expect(transformDataInternalSpy).toHaveBeenCalledWith(input);
  });

  test("debería devolver el input sin cambios si PROCESS_MODE tiene un valor inválido", () => {
    process.env.PROCESS_MODE = "INVALID_MODE";
    const input = "Hola Mundo";
    const result = processData(input);
    expect(result).toBe("Hola Mundo");
    expect(transformDataInternalSpy).toHaveBeenCalledWith(input);
  });
});