/**
 * `try` syntax as an expression.
 */
export const tryToAsync = async <T,>(
  f: () => Promise<T>,
): Promise<T | Error> => {
  try {
    return await f()
  } catch (e) {
    return new Error(`${e}`)
  }
}

/**
 * `throw new Error(message)` as an expression.
 */
export const raiseError = (message: string): never => {
  throw new Error(message)
}
