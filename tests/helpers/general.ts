export interface CreateTestStepApi<
  StepWorker extends (api: Record<string, any>) => any
> {
  testContext: Deno.TestContext;
  stepName: string;
  stepWorker: StepWorker;
  workerApi: Parameters<StepWorker>[0];
}

export function createTestStep<StepWorker extends (...args: Array<any>) => any>(
  api: CreateTestStepApi<StepWorker>
) {
  const { testContext, stepName, stepWorker, workerApi } = api;
  return testContext.step(stepName, async () => {
    await stepWorker(workerApi);
  });
}

export function throwError<SomeError>(someError: SomeError): never {
  throw someError;
}
