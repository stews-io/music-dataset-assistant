import { assertEquals } from "https://deno.land/std@0.204.0/assert/mod.ts";
import { CreateTestStepApi, createTestStep, throwError } from "./general.ts";

export interface CreateGptQueryTestStepApi<ExpectedResult>
  extends Pick<CreateTestStepApi<any>, "testContext">,
    Pick<
      TestGptQueryApi<ExpectedResult>,
      | "artistName"
      | "numberOfResults"
      | "domainSystemPrompt"
      | "getResultDistributionMap"
      | "acceptableDistributionMap"
    > {}

export function createGptQueryTestStep<ExpectedResult>(
  api: CreateGptQueryTestStepApi<ExpectedResult>
) {
  const {
    testContext,
    artistName,
    numberOfResults,
    domainSystemPrompt,
    getResultDistributionMap,
    acceptableDistributionMap,
  } = api;
  return createTestStep({
    stepWorker: testGptQuery,
    testContext,
    stepName: artistName,
    workerApi: {
      artistName,
      numberOfResults,
      domainSystemPrompt,
      getResultDistributionMap,
      acceptableDistributionMap,
    },
  });
}

interface TestGptQueryApi<DistributionMap> {
  numberOfResults: number;
  domainSystemPrompt: string;
  artistName: string;
  acceptableDistributionMap: DistributionMap;
  getResultDistributionMap: (someGptQueryData: Array<any>) => DistributionMap;
}

async function testGptQuery<ExpectedResult>(
  api: TestGptQueryApi<ExpectedResult>
) {
  const {
    numberOfResults,
    domainSystemPrompt,
    artistName,
    getResultDistributionMap,
    acceptableDistributionMap,
  } = api;
  const gptQueryData = await fetchGptQueryData({
    numberOfResults,
    systemPrompt: domainSystemPrompt,
    userQuery: `Calculate "${artistName}"`,
  });
  const resultDistributionMap = getResultDistributionMap(gptQueryData);
  console.log(JSON.stringify(resultDistributionMap, null, 2));
  // assertEquals(gptQueryResultJson, expectedResult);
}

interface FetchGptQueryDataApi {
  numberOfResults: number;
  systemPrompt: string;
  userQuery: string;
}

async function fetchGptQueryData(
  api: FetchGptQueryDataApi
): Promise<Array<any>> {
  const { numberOfResults, systemPrompt, userQuery } = api;
  const postChatCompletionResponse = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        max_tokens: 1024,
        temperature: 0,
        n: numberOfResults,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userQuery,
          },
        ],
      }),
    }
  );
  const postChatCompletionJson = await postChatCompletionResponse.json();
  return postChatCompletionJson.choices
    ? postChatCompletionJson.choices.reduce(
        (queryGptDataResult: Array<any>, someCompletionChoice: any) => {
          queryGptDataResult.push(
            JSON.parse(someCompletionChoice.message.content)
          );
          return queryGptDataResult;
        },
        []
      )
    : throwError(postChatCompletionJson.error);
}
