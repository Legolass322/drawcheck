export function protector(value: never) {
  throw new Error(`Unexpected value: ${value}`)
}