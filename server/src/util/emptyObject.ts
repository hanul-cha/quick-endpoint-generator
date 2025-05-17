import { NullableValueObject } from 'src/types/nullable'

export function deleteEmptyStringObject<T extends Record<string, any>>(
  obj: T,
): NullableValueObject<T> {
  const keys = Object.keys(obj)

  const newObj = { ...obj }

  for (const key of keys) {
    if (newObj[key] === '') {
      delete newObj[key]
    }
  }

  return newObj as NullableValueObject<T>
}
