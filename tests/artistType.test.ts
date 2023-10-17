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
    resultExpectedDistribution: [
      {
        preferredValue: "individual",
        otherValues: [],
        minimumFrequency: 1.0,
      },
    ],
  });
  await createArtistTypeTestStep({
    testContext,
    systemPrompt: artistTypeSystemPrompt,
    artistName: "Kanye West",
    resultExpectedDistribution: [
      {
        preferredValue: "individual",
        otherValues: [],
        minimumFrequency: 1.0,
      },
    ],
  });
  await createArtistTypeTestStep({
    testContext,
    systemPrompt: artistTypeSystemPrompt,
    artistName: "2Pac",
    resultExpectedDistribution: [
      {
        preferredValue: "individual",
        otherValues: [],
        minimumFrequency: 1.0,
      },
    ],
  });
  await createArtistTypeTestStep({
    testContext,
    systemPrompt: artistTypeSystemPrompt,
    artistName: "Shabazz Palaces",
    resultExpectedDistribution: [
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
    resultExpectedDistribution: [
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
    resultExpectedDistribution: [
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
      { artistType: "individual" | "group" },
      ExpectedDistribution<"individual" | "group">
    >,
    "testContext" | "systemPrompt" | "resultExpectedDistribution"
  > {
  artistName: string;
}

function createArtistTypeTestStep(api: CreateArtistTypeTestStepApi) {
  const { testContext, systemPrompt, resultExpectedDistribution, artistName } =
    api;
  return createGptQueryTestStep({
    numberOfResults: 1,
    dataItemSchema: Zod.object({
      artistType: Zod.union([Zod.literal("individual"), Zod.literal("group")]),
    }),
    getResultDistributionMap: (someGptMusicArtistType) => ({
      [someGptMusicArtistType[0].artistType]: 1,
    }),
    testContext,
    systemPrompt,
    resultExpectedDistribution,
    stepName: artistName,
    userQuery: `Calculate "${artistName}"`,
  });
}
