export const VM = {
  REQUIRED: (field: string) => `El ${field} es obligatorio`,
  STRING: (field: string) => `El ${field} debe ser un texto`,
  EMAIL: 'Debe ser un correo electrónico válido',
  INT: (field: string) => `El ${field} debe ser un número entero`,
  MIN: (field: string, value: number) =>
    `El ${field} debe ser mayor o igual a ${value}`,
  MAX: (field: string, value: number) =>
    `El ${field} debe ser menor o igual a ${value}`,
  MIN_LENGTH: (field: string, value: number) =>
    `El ${field} debe tener al menos ${value} caracteres`,
  DATE: (field: string) => `El ${field} debe ser una fecha válida (ISO 8601)`,
  ARRAY: (field: string) => `El ${field} debe ser un arreglo`,
  ENUM: (field: string) => `El ${field} tiene un valor no permitido`,
  IN: (field: string, values: string[]) =>
    `El ${field} debe ser uno de: ${values.join(', ')}`,
  MATCHES: (field: string, format: string) =>
    `El ${field} debe tener el formato ${format}`,
};

export const VALIDATION_MESSAGES = VM;
