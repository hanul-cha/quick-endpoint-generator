export type NullableValueObject<T extends Record<string, any>> = {
  [K in keyof T]: T[K] | undefined
}

export type NullableValueArray<T extends Record<string, any>[]> = {
  [K in keyof T]: T[K] | undefined
}
