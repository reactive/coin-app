import type { Schema, EntityInterface } from '@data-client/core';

export function isEntity(schema: Schema): schema is EntityInterface {
  return schema !== null && (schema as any).pk !== undefined;
}
