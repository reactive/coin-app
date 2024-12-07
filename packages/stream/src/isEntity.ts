import type { Schema, EntityInterface } from '@data-client/react';

export function isEntity(schema: Schema): schema is EntityInterface {
  return schema !== null && (schema as any).pk !== undefined;
}
