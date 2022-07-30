import { PropsWithChildren } from "react";

/**
 * Takes an object and makes any functions on that object return unknown.
 */
export type FunctionsReturnUnknown<T> = {
  [K in keyof T]: T[K] extends (...args: infer TArgs) => unknown
    ? (...args: TArgs) => unknown
    : T[K];
};

/**
 * Takes a function type that returns an object, and modifies that return type.
 * Any functions inside that record will now return unknown.
 */
export type MockController<
  T extends (...args: unknown[]) => Record<string, unknown>,
> = (...args: Parameters<T>) => FunctionsReturnUnknown<ReturnType<T>>;

export type FCC<P = unknown> = React.FC<PropsWithChildren<P>>;

export type Nullish<T> = T | null | undefined;

export type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;

export type _TupleOf<
  T,
  N extends number,
  R extends unknown[],
> = R["length"] extends N ? R : _TupleOf<T, N, [T, ...R]>;

type _LesserOrEqual<
  A extends Array<unknown>,
  B extends Array<unknown>,
> = A extends [...infer A1, undefined]
  ? B extends [...infer B1, undefined]
    ? _LesserOrEqual<A1, B1>
    : false
  : true;

export type LesserOrEqual<A extends number, B extends number> = _LesserOrEqual<
  ToArray<A>,
  ToArray<B>
>;

export type ToNumber<A extends readonly unknown[]> = A["length"];

export type ToArray<N extends number> = _ToArray<N, []>;

type _ToArray<
  N extends number,
  A extends Array<unknown>,
> = ToNumber<A> extends N ? A : _ToArray<N, [...A, undefined]>;

export type STATIC_ASSERT_TRUE<M extends string, T extends M | true> = never;

export type TUPLE_LENGTH<T extends unknown[]> = T extends Array<unknown>
  ? T["length"]
  : never;
