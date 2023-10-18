import { loadSync as loadEnvironmentVariables } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import {
  CreateGptQueryTestStepApi,
  ExpectedDistribution,
  createGptQueryTestStep,
} from "./helpers/queryGptData.ts";
import * as Zod from "https://deno.land/x/zod@v3.22.4/mod.ts";

loadEnvironmentVariables({
  envPath: "./.secrets",
  export: true,
});

Deno.test("Query Music Artist Type", async (testContext) => {
  const artistTypeSystemPrompt = await Deno.readTextFile(
    "./assets/generated/artistType-system-prompt.md"
  );
  await createArtistTypeTestStep({
    testContext,
    systemPrompt: artistTypeSystemPrompt,
    artistName: "MF Doom",
    expectedDistribution: [
      {
        preferredValue: "solo",
        otherValues: [],
        minimumFrequency: 1.0,
      },
    ],
  });
  await createArtistTypeTestStep({
    testContext,
    systemPrompt: artistTypeSystemPrompt,
    artistName: "Kanye West",
    expectedDistribution: [
      {
        preferredValue: "solo",
        otherValues: [],
        minimumFrequency: 1.0,
      },
    ],
  });
  await createArtistTypeTestStep({
    testContext,
    systemPrompt: artistTypeSystemPrompt,
    artistName: "2Pac",
    expectedDistribution: [
      {
        preferredValue: "solo",
        otherValues: [],
        minimumFrequency: 1.0,
      },
    ],
  });
  await createArtistTypeTestStep({
    testContext,
    systemPrompt: artistTypeSystemPrompt,
    artistName: "Shabazz Palaces",
    expectedDistribution: [
      {
        preferredValue: "group",
        otherValues: [],
        minimumFrequency: 1.0,
      },
    ],
  });
  await createArtistTypeTestStep({
    testContext,
    systemPrompt: artistTypeSystemPrompt,
    artistName: "Digital Underground",
    expectedDistribution: [
      {
        preferredValue: "group",
        otherValues: [],
        minimumFrequency: 1.0,
      },
    ],
  });
  await createArtistTypeTestStep({
    testContext,
    systemPrompt: artistTypeSystemPrompt,
    artistName: "Odd Future",
    expectedDistribution: [
      {
        preferredValue: "group",
        otherValues: [],
        minimumFrequency: 1.0,
      },
    ],
  });
});

interface CreateArtistTypeTestStepApi
  extends Pick<
    CreateGptQueryTestStepApi<
      { artistType: "solo" | "group" },
      ExpectedDistribution<"solo" | "group">
    >,
    "testContext" | "systemPrompt" | "expectedDistribution"
  > {
  artistName: string;
}

function createArtistTypeTestStep(api: CreateArtistTypeTestStepApi) {
  const { testContext, systemPrompt, expectedDistribution, artistName } = api;
  return createGptQueryTestStep({
    numberOfResults: 1,
    maxTokens: 256,
    temperature: 0,
    topProbability: 1,
    dataItemSchema: Zod.object({
      artistType: Zod.union([Zod.literal("solo"), Zod.literal("group")]),
    }),
    getDistributionMap: (someGptMusicArtistType) => ({
      [someGptMusicArtistType[0]!.artistType]: 1,
    }),
    testContext,
    systemPrompt,
    expectedDistribution,
    stepName: artistName,
    userQuery: `Calculate "${artistName}"`,
  });
}
