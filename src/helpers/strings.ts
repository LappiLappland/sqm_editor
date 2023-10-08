
export function stringSplice(string: string, start: number, remove: number, insert: string) {
  return string.slice(0, start) + insert + string.slice(start + Math.abs(remove));
}