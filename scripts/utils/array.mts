import { raiseError } from './common.mts'

/*
 * ```ts
 * range(1, 5) // [1, 2, 3, 4, 5]
 * range(1, 5, 2) // [1, 3, 5]
 * range(5, 1, -1) // [5, 4, 3, 2, 1]
 * ```
 */
export const range = (start: number, stop: number, step = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)

/**
 * ```ts
 * zip([1,2,3], [2,3,4,5]) // [[1,2], [2,3], [3,4]]
 * ```
 */
export const zip = <T, U>(xs: T[], ys: U[]): Readonly<[T, U]>[] => {
  const length = xs.length >= ys.length ? ys.length : xs.length
  return range(0, length - 1).map(
    (_, i) =>
      [xs[i] ?? raiseError('Invalid'), ys[i] ?? raiseError('Invalid')] as const,
  )
}
