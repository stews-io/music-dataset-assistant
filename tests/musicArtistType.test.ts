import { loadSync as loadEnvironmentVariables } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import {
  CreateGptQueryTestStepApi,
  createGptQueryTestStep,
} from "./helpers/queryGptData.ts";

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
    domainSystemPrompt: artistTypeSystemPrompt,
    artistName: "MF Doom",
    acceptableDistributionMap: {
      individual: 1,
    },
  });
  await createArtistTypeTestStep({
    testContext,
    domainSystemPrompt: artistTypeSystemPrompt,
    artistName: "Kanye West",
    acceptableDistributionMap: {
      individual: 1,
    },
  });
  await createArtistTypeTestStep({
    testContext,
    domainSystemPrompt: artistTypeSystemPrompt,
    artistName: "2Pac",
    acceptableDistributionMap: {
      individual: 1,
    },
  });
  await createArtistTypeTestStep({
    testContext,
    domainSystemPrompt: artistTypeSystemPrompt,
    artistName: "Shabazz Palaces",
    acceptableDistributionMap: {
      group: 1,
    },
  });
  await createArtistTypeTestStep({
    testContext,
    domainSystemPrompt: artistTypeSystemPrompt,
    artistName: "Digital Underground",
    acceptableDistributionMap: {
      group: 1,
    },
  });
  await createArtistTypeTestStep({
    testContext,
    domainSystemPrompt: artistTypeSystemPrompt,
    artistName: "Odd Future",
    acceptableDistributionMap: {
      group: 1,
    },
  });
});

interface CreateArtistTypeTestStepApi
  extends Pick<
    CreateGptQueryTestStepApi<Record<string, number>>,
    | "testContext"
    | "artistName"
    | "domainSystemPrompt"
    | "acceptableDistributionMap"
  > {}

function createArtistTypeTestStep(api: CreateArtistTypeTestStepApi) {
  const {
    testContext,
    artistName,
    domainSystemPrompt,
    acceptableDistributionMap,
  } = api;
  return createGptQueryTestStep({
    testContext,
    artistName,
    domainSystemPrompt,
    acceptableDistributionMap,
    numberOfResults: 1,
    getResultDistributionMap: (someGptQueryData) =>
      someGptQueryData.reduce((result, someQueryData) => {
        const previousTargetCount = result[someQueryData.artistType] ?? 0;
        result[someQueryData.artistType] = previousTargetCount + 1;
        return result;
      }, {}),
  });
}
