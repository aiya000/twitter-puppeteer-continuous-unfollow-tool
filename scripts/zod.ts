import { ZodType, ZodTypeDef } from 'zod'

export const isValueOf = <T>(x: ZodType<T, ZodTypeDef>, y: unknown): y is T =>
  x.safeParse(y).success

export function ensureValueOf<T>(
  x: ZodType<T, ZodTypeDef>,
  y: unknown,
): asserts y is T {
  x.parse(y)
}

export const requireValueOf = <T>(x: ZodType<T, ZodTypeDef>, y: unknown): T => {
  ensureValueOf(x, y)
  return y
}
