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
        minimumFrequency: 0.5,
      },
      {
        preferredValue: "Metaphysical",
        otherValues: [],
        minimumFrequency: 0,
      },
      {
        preferredValue: "Esinchill",
        otherValues: [],
        minimumFrequency: 0,
      },
      {
        preferredValue: "DJ Nu-Stylez",
        otherValues: [],
        minimumFrequency: 0,
      },
    ],
  });
  // await createGroupMembersTestStep({
  //   testContext,
  //   systemPrompt: musicGroupMembersSystemPrompt,
  //   artistName: "Odd Future",
  //   expectedDistribution: [
  //     {
  //       preferredValue: "Tyler, The Creator",
  //       otherValues: [],
  //       minimumFrequency: 1,
  //     },
  //     {
  //       preferredValue: "Hodgy",
  //       otherValues: ["Hodgy Beats"],
  //       minimumFrequency: 1,
  //     },
  //     {
  //       preferredValue: "Earl Sweatshirt",
  //       otherValues: [],
  //       minimumFrequency: 1,
  //     },
  //     {
  //       preferredValue: "Domo Genesis",
  //       otherValues: [],
  //       minimumFrequency: 1,
  //     },
  //     {
  //       preferredValue: "Mike G",
  //       otherValues: [],
  //       minimumFrequency: 1,
  //     },
  //     {
  //       preferredValue: "Frank Ocean",
  //       otherValues: [],
  //       minimumFrequency: 1,
  //     },
  //     {
  //       preferredValue: "Left Brain",
  //       otherValues: [],
  //       minimumFrequency: 1,
  //     },
  //     {
  //       preferredValue: "Syd",
  //       otherValues: ["Syd Tha Kyd", "Syd tha Kyd"],
  //       minimumFrequency: 1,
  //     },
  //     {
  //       preferredValue: "Matt Martians",
  //       otherValues: [],
  //       minimumFrequency: 1,
  //     },
  //     {
  //       preferredValue: "Jasper Dolphin",
  //       otherValues: [],
  //       minimumFrequency: 1,
  //     },
  //     {
  //       preferredValue: "L-Boy",
  //       otherValues: [],
  //       minimumFrequency: 1,
  //     },
  //     {
  //       preferredValue: "Taco",
  //       otherValues: ["Taco Bennett"],
  //       minimumFrequency: 1,
  //     },
  //     {
  //       preferredValue: "The Internet",
  //       otherValues: [],
  //       minimumFrequency: 0.5,
  //     },
  //     {
  //       preferredValue: "Casey Veggies",
  //       otherValues: [],
  //       minimumFrequency: 0.25,
  //     },
  //     {
  //       preferredValue: "Brandun DeShay",
  //       otherValues: [],
  //       minimumFrequency: 0.25,
  //     },
  //     {
  //       preferredValue: "The Super 3",
  //       otherValues: ["The Jet Age of Tomorrow"],
  //       minimumFrequency: 0,
  //     },
  //     {
  //       preferredValue: "Hal Williams",
  //       otherValues: [],
  //       minimumFrequency: 0,
  //     },
  //     {
  //       preferredValue: "Na-kel Smith",
  //       otherValues: ["Na'kel Smith", "Na-Kel", "Na-Kel Smith"],
  //       minimumFrequency: 0,
  //     },
  //   ],
  // });
  // await createGroupMembersTestStep({
  //   testContext,
  //   systemPrompt: musicGroupMembersSystemPrompt,
  //   artistName: "Brockhampton",
  //   expectedDistribution: [],
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
    numberOfResults: 4,
    maxTokens: 1024,
    temperature: 1,
    topProbability: 0.05,
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
