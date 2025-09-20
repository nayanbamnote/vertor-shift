import type { JsonSchemaObject, ValidationResult } from '../types/node';

export function validateAgainstSchema(schema: JsonSchemaObject, data: any): ValidationResult {
  const errors: Record<string, string> = {};
  
  if (!data || typeof data !== 'object') {
    return { ok: false, errors: { root: 'Data must be an object' } };
  }
  
  // Check required fields
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in data) || data[field] === undefined || data[field] === null || data[field] === '') {
        errors[field] = `${field} is required`;
      }
    }
  }
  
  // Validate properties
  if (schema.properties) {
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      if (key in data) {
        const value = data[key];
        if (propSchema && typeof propSchema === 'object' && propSchema.type) {
          const expectedType = propSchema.type;
          
          if (expectedType === 'string' && typeof value !== 'string') {
            errors[key] = `${key} must be a string`;
          } else if (expectedType === 'number' && typeof value !== 'number') {
            errors[key] = `${key} must be a number`;
          } else if (expectedType === 'boolean' && typeof value !== 'boolean') {
            errors[key] = `${key} must be a boolean`;
          } else if (expectedType === 'array' && !Array.isArray(value)) {
            errors[key] = `${key} must be an array`;
          }
        }
      }
    }
  }
  
  // Check for additional properties if not allowed
  if (schema.additionalProperties === false && schema.properties) {
    const allowedKeys = Object.keys(schema.properties);
    for (const key of Object.keys(data)) {
      if (!allowedKeys.includes(key)) {
        errors[key] = `${key} is not allowed`;
      }
    }
  }
  
  return {
    ok: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined
  };
}
