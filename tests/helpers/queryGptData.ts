import { assertEquals } from "https://deno.land/std@0.204.0/assert/mod.ts";
import { CreateTestStepApi, createTestStep, throwError } from "./general.ts";
import * as Zod from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { assert } from "https://deno.land/std@0.204.0/assert/assert.ts";
import { fail } from "https://deno.land/std@0.204.0/assert/fail.ts";
import { AssertionError } from "https://deno.land/std@0.204.0/assert/assertion_error.ts";

export interface CreateGptQueryTestStepApi<
  GptMessageData,
  ResultExpectedDistribution extends ExpectedDistribution<any>
> extends Pick<CreateTestStepApi<any>, "testContext" | "stepName">,
    Pick<
      TestGptQueryApi<GptMessageData, ResultExpectedDistribution>,
      | "userQuery"
      | "systemPrompt"
      | "dataItemSchema"
      | "numberOfResults"
      | "getDistributionMap"
      | "expectedDistribution"
    > {}

export function createGptQueryTestStep<
  GptMessageData,
  ResultExpectedDistribution extends ExpectedDistribution<any>
>(api: CreateGptQueryTestStepApi<GptMessageData, ResultExpectedDistribution>) {
  const {
    stepName,
    testContext,
    userQuery,
    systemPrompt,
    dataItemSchema,
    numberOfResults,
    getDistributionMap,
    expectedDistribution,
  } = api;
  return createTestStep({
    stepWorker: testGptQuery<GptMessageData, ResultExpectedDistribution>,
    stepName,
    testContext,
    workerApi: {
      userQuery,
      systemPrompt,
      dataItemSchema,
      numberOfResults,
      getDistributionMap,
      expectedDistribution,
    },
  });
}

interface TestGptQueryApi<
  GptMessageData,
  ResultExpectedDistribution extends ExpectedDistribution<any>
> extends Pick<
    QueryGptDataApi<GptMessageData>,
    "userQuery" | "systemPrompt" | "dataItemSchema" | "numberOfResults"
  > {
  expectedDistribution: ResultExpectedDistribution;
  getDistributionMap: (
    queriedGptData: Array<GptMessageData>
  ) => DistributionMap;
}

async function testGptQuery<
  GptMessageData,
  QueryExpectedDistribution extends ExpectedDistribution<any>
>(api: TestGptQueryApi<GptMessageData, QueryExpectedDistribution>) {
  const {
    userQuery,
    systemPrompt,
    dataItemSchema,
    numberOfResults,
    getDistributionMap,
    expectedDistribution,
  } = api;
  const queriedGptData = await queryGptData({
    userQuery,
    systemPrompt,
    dataItemSchema,
    numberOfResults,
  });
  const expectedDistributionMap =
    expectedDistribution.reduce<ExpectedDistributionMap>(
      (expectedDistributionMapResult, someExpectedItem, expectedItemIndex) => {
        expectedDistributionMapResult[`${someExpectedItem.preferredValue}`] =
          expectedItemIndex;
        someExpectedItem.otherValues.forEach((someExpectedOtherValue) => {
          expectedDistributionMapResult[`${someExpectedOtherValue}`] =
            expectedItemIndex;
        });
        return expectedDistributionMapResult;
      },
      {}
    );
  const distributionMap = getDistributionMap(queriedGptData);
  const expectedDistributionTotals = Object.entries(
    distributionMap
  ).reduce<ExpectedDistributionTotals>(
    (
      expectedDistributionTotalsResult,
      [distributionItemKey, distributionItemTotal]
    ) => {
      expectedDistributionTotalsResult[
        expectedDistributionMap[distributionItemKey]
      ] += distributionItemTotal;
      return expectedDistributionTotalsResult;
    },
    new Array(expectedDistribution.length).fill(0)
  );
  const distributionErrors: Array<string> = [];
  expectedDistribution.forEach((someExpectedItem, expectedItemIndex) => {
    const actualFrequency =
      expectedDistributionTotals[expectedItemIndex] / numberOfResults;
    const frequencyDelta = actualFrequency - someExpectedItem.minimumFrequency;
    if (actualFrequency >= someExpectedItem.minimumFrequency) {
      console.log(
        `%c${someExpectedItem.preferredValue}: %c${actualFrequency} >= ${someExpectedItem.minimumFrequency} %c(+${frequencyDelta})`,
        "color: green; font-weight: bold",
        "font-style: normal",
        "color: green; font-style: italic"
      );
    } else {
      console.log(
        `%c${someExpectedItem.preferredValue}: %c${actualFrequency} < ${someExpectedItem.minimumFrequency} %c(${frequencyDelta})`,
        "color: red; font-weight: bold",
        "font-style: normal",
        "color: red; font-style: italic"
      );
      distributionErrors.push(someExpectedItem.preferredValue);
    }
  });
  if (distributionErrors.length > 0) {
    throw distributionErrors;
  }
}

interface QueryGptDataApi<GptMessageData> {
  numberOfResults: number;
  systemPrompt: string;
  userQuery: string;
  dataItemSchema: Zod.ZodType<GptMessageData>;
}

async function queryGptData<GptMessageData>(
  api: QueryGptDataApi<GptMessageData>
): Promise<Array<GptMessageData>> {
  const { numberOfResults, systemPrompt, userQuery, dataItemSchema } = api;
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
  const unvalidatedChatCompletionJson: unknown =
    await postChatCompletionResponse.json();
  try {
    const successChatCompletionJson = SuccessChatCompletionJsonSchema().parse(
      unvalidatedChatCompletionJson
    );
    return successChatCompletionJson.choices.reduce<Array<GptMessageData>>(
      (gptDataResult, someCompletionChoice) => {
        const unvalidatedGptMessageData: unknown = JSON.parse(
          someCompletionChoice.message.content
        );
        const gptMessageData = dataItemSchema.parse(unvalidatedGptMessageData);
        gptDataResult.push(gptMessageData);
        return gptDataResult;
      },
      []
    );
  } catch {
    const errorChatCompletionJson = ErrorChatCompletionJsonSchema().parse(
      unvalidatedChatCompletionJson
    );
    throwError(errorChatCompletionJson.error);
  }
}

interface SuccessChatCompletionJson {
  choices: Array<{
    finish_reason: "stop" | "length" | "content_filter";
    message: {
      role: "assistant";
      content: string;
    };
  }>;
}

function SuccessChatCompletionJsonSchema(): Zod.ZodType<SuccessChatCompletionJson> {
  return Zod.object({
    choices: Zod.array(
      Zod.object({
        finish_reason: Zod.union([
          Zod.literal("stop"),
          Zod.literal("length"),
          Zod.literal("content_filter"),
        ]),
        message: Zod.object({
          role: Zod.literal("assistant"),
          content: Zod.string(),
        }),
      })
    ),
  });
}

interface ErrorChatCompletionJson {
  error: Record<string, unknown>;
}

function ErrorChatCompletionJsonSchema(): Zod.ZodType<ErrorChatCompletionJson> {
  return Zod.object({
    error: Zod.record(Zod.unknown()),
  });
}

export type DistributionMap = Record<ItemValueAsString, ItemTotal>;

export type ExpectedDistribution<ItemValue> = Array<ExpectedItem<ItemValue>>;

interface ExpectedItem<ItemValue> {
  minimumFrequency: number;
  preferredValue: ItemValue;
  otherValues: Array<ItemValue>;
}

type ExpectedDistributionMap = Record<ItemValueAsString, ExpectedItemIndex>;

type ExpectedItemIndex = number;

type ExpectedDistributionTotals = Array<ItemTotal>;

type ItemValueAsString = string;

type ItemTotal = number;
