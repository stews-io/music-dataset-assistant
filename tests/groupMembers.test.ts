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

Deno.test("Query Music Group Members", async (testContext) => {
  const musicGroupMembersSystemPrompt = await Deno.readTextFile(
    "./assets/generated/groupMembers-system-prompt.md"
  );
  await createGroupMembersTestStep({
    testContext,
    systemPrompt: musicGroupMembersSystemPrompt,
    artistName: "Digital Underground",
    expectedDistribution: [
      {
        preferredValue: "Shock G",
        otherValues: [],
        minimumFrequency: 1.0,
      },
      {
        preferredValue: "Chopmaster J",
        otherValues: [],
        minimumFrequency: 1.0,
      },
      {
        preferredValue: "Kenny-K",
        otherValues: ["Kenny K"],
        minimumFrequency: 1.0,
      },
      {
        preferredValue: "Money-B",
        otherValues: [],
        minimumFrequency: 1.0,
      },
      {
        preferredValue: "DJ Fuze",
        otherValues: [],
        minimumFrequency: 1.0,
      },
      {
        preferredValue: "2Pac",
        otherValues: [],
        minimumFrequency: 1.0,
      },
      {
        preferredValue: "Saafir",
        otherValues: [],
        minimumFrequency: 1.0,
      },
      {
        preferredValue: "Numskull",
        otherValues: [],
        minimumFrequency: 1.0,
      },
      {
        preferredValue: "Mystic",
        otherValues: [],
        minimumFrequency: 1.0,
      },
      {
        preferredValue: "BINC",
        otherValues: [],
        minimumFrequency: 1.0,
      },
      {
        preferredValue: "Clee",
        otherValues: ["Cleetis Mack"],
        minimumFrequency: 1.0,
      },
      {
        preferredValue: "Doctor Fink",
        otherValues: [],
        minimumFrequency: 0.5,
      },
      {
        preferredValue: "Schmoovy-Schmoov",
        otherValues: [],
        minimumFrequency: 0.5,
      },
      {
        preferredValue: "Bigg Money Odis",
        otherValues: [],
        minimumFrequency: 0.1,
      },
      {
        preferredValue: "Metaphysical",
        otherValues: [],
        minimumFrequency: 0.1,
      },
      {
        preferredValue: "Esinchill",
        otherValues: [],
        minimumFrequency: 0.1,
      },
      {
        preferredValue: "DJ Nu-Stylez",
        otherValues: [],
        minimumFrequency: 0,
      },
    ],
  });
  // {
  //   "Tyler, The Creator": 5,
  //   "Hodgy": 5,
  //   "Earl Sweatshirt": 5,
  //   "Domo Genesis": 5,
  //   "Mike G": 5,
  //   "Frank Ocean": 5,
  //   "Left Brain": 5,
  //   "The Internet": 5,
  //   "Syd": 5,
  //   "Matt Martians": 5,
  //   "Jasper Dolphin": 5,
  //   "Taco": 5,
  //   "L-Boy": 5,
  //   "Casey Veggies": 4,
  //   "Brandun DeShay": 4,
  //   "Na-kel Smith": 2,
  //   "Na'kel Smith": 1
  // }
  // await createGroupMembersTestStep({
  //   testContext,
  //   systemPrompt: musicGroupMembersSystemPrompt,
  //   artistName: "Odd Future",
  //   acceptableDistributionMap: {},
  // });
  // await createGroupMembersTestStep({
  //   testContext,
  //   systemPrompt: musicGroupMembersSystemPrompt,
  //   artistName: "Brockhampton",
  //   acceptableDistributionMap: {},
  // });
});

interface CreateGroupMembersTestStepApi
  extends Pick<
    CreateGptQueryTestStepApi<
      { groupMembers: Array<string> },
      ExpectedDistribution<string>
    >,
    "testContext" | "systemPrompt" | "expectedDistribution"
  > {
  artistName: string;
}

function createGroupMembersTestStep(api: CreateGroupMembersTestStepApi) {
  const { testContext, systemPrompt, expectedDistribution, artistName } = api;
  return createGptQueryTestStep({
    numberOfResults: 3,
    dataItemSchema: Zod.object({
      groupMembers: Zod.array(Zod.string()),
    }),
    getDistributionMap: (someGptQueryData) =>
      someGptQueryData.reduce<Record<string, number>>(
        (result, someQueryData) => {
          someQueryData.groupMembers.forEach((someGroupMember) => {
            const previousTargetCount = result[someGroupMember] ?? 0;
            result[someGroupMember] = previousTargetCount + 1;
          });
          return result;
        },
        {}
      ),
    testContext,
    systemPrompt,
    expectedDistribution,
    stepName: artistName,
    userQuery: `Calculate "${artistName}"`,
  });
}
