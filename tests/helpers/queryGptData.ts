import * as Zod from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { CreateTestStepApi, createTestStep, throwError } from "./general.ts";

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
      | "maxTokens"
      | "temperature"
      | "topProbability"
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
    maxTokens,
    temperature,
    topProbability,
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
      maxTokens,
      temperature,
      topProbability,
      getDistributionMap,
      expectedDistribution,
    },
  });
}

interface TestGptQueryApi<
  GptMessageData,
  SomeExpectedDistribution extends ExpectedDistribution<any>
> extends Pick<
    QueryGptDataApi<GptMessageData>,
    | "userQuery"
    | "systemPrompt"
    | "dataItemSchema"
    | "numberOfResults"
    | "maxTokens"
    | "temperature"
    | "topProbability"
  > {
  expectedDistribution: SomeExpectedDistribution;
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
    maxTokens,
    temperature,
    topProbability,
    getDistributionMap,
    expectedDistribution,
  } = api;
  const queriedGptData = await queryGptData({
    userQuery,
    systemPrompt,
    dataItemSchema,
    numberOfResults,
    maxTokens,
    temperature,
    topProbability,
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
  console.log(distributionMap);
  const distributionAnalysis = Object.entries(distributionMap).reduce<
    DistributionAnalysis<
      (typeof expectedDistribution)[number]["preferredValue"]
    >
  >((distributionAnalysisResult, someDistributionEntry) => {
    const expectedItemIndex =
      expectedDistributionMap[someDistributionEntry[0]] ?? -1;
    const matchedExpectedItem = expectedDistribution[expectedItemIndex];
    const targetItemKey = matchedExpectedItem
      ? `${matchedExpectedItem.preferredValue}`
      : someDistributionEntry[0];
    const targetDistributionItem = distributionAnalysisResult[
      targetItemKey
    ] ?? {
      itemTotal: 0,
      itemType: "unexpected",
      itemKey: targetItemKey,
    };
    targetDistributionItem.itemTotal += someDistributionEntry[1];
    const currentDistributionFrequency =
      targetDistributionItem.itemTotal / numberOfResults;
    if (!matchedExpectedItem) {
      distributionAnalysisResult[targetDistributionItem.itemKey] =
        targetDistributionItem;
    } else if (
      currentDistributionFrequency >= matchedExpectedItem.minimumFrequency
    ) {
      distributionAnalysisResult[targetDistributionItem.itemKey] = {
        ...targetDistributionItem,
        ...matchedExpectedItem,
        itemType: "valid",
      };
    } else if (
      currentDistributionFrequency < matchedExpectedItem.minimumFrequency
    ) {
      distributionAnalysisResult[targetDistributionItem.itemKey] = {
        ...targetDistributionItem,
        ...matchedExpectedItem,
        itemType: "belowMinimumFrequency",
      };
    } else {
      throw new Error("invalid path: distributionAnalysis");
    }
    return distributionAnalysisResult;
  }, {});
  expectedDistribution.forEach((someExpectedItem) => {
    const itemKey = `${someExpectedItem.preferredValue}`;
    if (distributionAnalysis[itemKey] === undefined) {
      distributionAnalysis[itemKey] = {
        ...someExpectedItem,
        itemKey,
        itemTotal: 0,
        itemType:
          0 >= someExpectedItem.minimumFrequency
            ? "valid"
            : "belowMinimumFrequency",
      };
    }
  });
  Object.values(distributionAnalysis).forEach((someDistributionItem) => {
    const actualFrequency = someDistributionItem.itemTotal / numberOfResults;
    if (someDistributionItem.itemType === "valid") {
      const frequencyDelta =
        actualFrequency - someDistributionItem.minimumFrequency;
      console.log(
        `%c${someDistributionItem.preferredValue}: %c${actualFrequency} >= ${someDistributionItem.minimumFrequency} %c(+${frequencyDelta})`,
        "color: green; font-weight: bold",
        "font-style: normal",
        "color: green; font-style: italic"
      );
    } else if (someDistributionItem.itemType === "belowMinimumFrequency") {
      const frequencyDelta =
        actualFrequency - someDistributionItem.minimumFrequency;
      console.log(
        `%c${someDistributionItem.preferredValue}: %c${actualFrequency} >= ${someDistributionItem.minimumFrequency} %c(${frequencyDelta})`,
        "color: red; font-weight: bold",
        "font-style: normal",
        "color: red; font-style: italic"
      );
    } else if (someDistributionItem.itemType === "unexpected") {
      console.log(
        `%c${"unexpected"}: %c${
          someDistributionItem.itemKey
        } %c(${actualFrequency})`,
        "color: red; font-weight: bold",
        "font-style: normal",
        "color: red; font-style: italic"
      );
    }
  });
}

interface QueryGptDataApi<GptMessageData> {
  numberOfResults: number;
  maxTokens: number;
  topProbability: number;
  temperature: number;
  systemPrompt: string;
  userQuery: string;
  dataItemSchema: Zod.ZodType<GptMessageData>;
}

async function queryGptData<GptMessageData>(
  api: QueryGptDataApi<GptMessageData>
): Promise<Array<GptMessageData>> {
  const {
    maxTokens,
    temperature,
    topProbability,
    numberOfResults,
    systemPrompt,
    userQuery,
    dataItemSchema,
  } = api;
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
        max_tokens: maxTokens,
        temperature: temperature,
        top_p: topProbability,
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

export type DistributionMap = Record<ItemValueAsString, DistributionItemTotal>;

type DistributionItemTotal = number;

export type ExpectedDistribution<ItemValue> = Array<ExpectedItem<ItemValue>>;

interface ExpectedItem<ItemValue> {
  minimumFrequency: number;
  preferredValue: ItemValue;
  otherValues: Array<ItemValue>;
}

type ExpectedDistributionMap = Record<ItemValueAsString, ExpectedItemIndex>;

type ExpectedItemIndex = number;

type DistributionAnalysis<ItemValue> = Record<
  ItemValueAsString,
  DistributionItem<ItemValue>
>;

type DistributionItem<ItemValue> =
  | ValidDistributionItem<ItemValue>
  | BelowMinimumFrequencyDistributionItem<ItemValue>
  | UnexpectedDistributionItem;

interface ValidDistributionItem<ItemValue>
  extends DistributionItemBase<"valid">,
    ExpectedItem<ItemValue> {}

interface BelowMinimumFrequencyDistributionItem<ItemValue>
  extends DistributionItemBase<"belowMinimumFrequency">,
    ExpectedItem<ItemValue> {}

interface UnexpectedDistributionItem
  extends DistributionItemBase<"unexpected"> {}

interface DistributionItemBase<ItemType extends string> {
  itemKey: ItemValueAsString;
  itemType: ItemType;
  itemTotal: number;
}

type ItemValueAsString = string;
