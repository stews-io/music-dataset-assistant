export function throwInvalidPathError(pathMessage: string): never {
  throw new Error(`invalid path: ${pathMessage}`);
}
