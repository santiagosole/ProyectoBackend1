import { jest } from "@jest/globals";
import { processData, internal } from "./processData.js";
import { env } from "./config/env.js";

describe("processData", () => {
  let originalProcessMode;
  let transformDataInternalSpy;

  beforeEach(() => {
    originalProcessMode = env.processMode;
    transformDataInternalSpy = jest.spyOn(internal, "_transformDataInternal");
  });

  afterEach(() => {
    env.processMode = originalProcessMode;
    transformDataInternalSpy.mockRestore();
  });

  test("debería transformar el input a mayúsculas si PROCESS_MODE es UPPERCASE", () => {
    env.processMode = "UPPERCASE";
    const input = "hola mundo";
    const result = processData(input);
    expect(result).toBe("HOLA MUNDO");
    expect(transformDataInternalSpy).toHaveBeenCalledWith(input);
  });

  test("debería transformar el input a minúsculas si PROCESS_MODE es LOWERCASE", () => {
    env.processMode = "LOWERCASE";
    const input = "HOLA MUNDO";
    const result = processData(input);
    expect(result).toBe("hola mundo");
    expect(transformDataInternalSpy).toHaveBeenCalledWith(input);
  });

  test("debería invertir el input si PROCESS_MODE es REVERSE", () => {
    env.processMode = "REVERSE";
    const input = "olap";
    const result = processData(input);
    expect(result).toBe("palo");
    expect(transformDataInternalSpy).toHaveBeenCalledWith(input);
  });

  test("debería devolver el input sin cambios si PROCESS_MODE es undefined", () => {
    env.processMode = undefined;
    const input = "Hola Mundo";
    const result = processData(input);
    expect(result).toBe("Hola Mundo");
    expect(transformDataInternalSpy).toHaveBeenCalledWith(input);
  });

  test("debería devolver el input sin cambios si PROCESS_MODE tiene un valor inválido", () => {
    env.processMode = "INVALID_MODE";
    const input = "Hola Mundo";
    const result = processData(input);
    expect(result).toBe("Hola Mundo");
    expect(transformDataInternalSpy).toHaveBeenCalledWith(input);
  });
});