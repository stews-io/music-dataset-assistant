export function throwError<SomeError>(someError: SomeError): never {
  throw someError;
}
