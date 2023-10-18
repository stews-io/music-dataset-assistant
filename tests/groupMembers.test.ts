import { loadSync as loadEnvironmentVariables } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import * as Zod from "https://deno.land/x/zod@v3.22.4/mod.ts";
import {
  ExpectedDistribution,
  TestGptQueryApi,
  testGptQuery,
} from "./helpers/queryGptData.ts";

loadEnvironmentVariables({
  envPath: "./.secrets",
  export: true,
});

Deno.test({ name: "Query Digital Underground Members" }, async () => {
  const musicGroupMembersSystemPrompt = await Deno.readTextFile(
    "./assets/generated/groupMembers-system-prompt.md"
  );
  await testGroupMembersQuery({
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
});

Deno.test({ name: "Query Odd Future Members" }, async () => {
  const musicGroupMembersSystemPrompt = await Deno.readTextFile(
    "./assets/generated/groupMembers-system-prompt.md"
  );
  await testGroupMembersQuery({
    systemPrompt: musicGroupMembersSystemPrompt,
    artistName: "Odd Future",
    expectedDistribution: [
      {
        preferredValue: "Tyler, The Creator",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "Hodgy",
        otherValues: ["Hodgy Beats"],
        minimumFrequency: 1,
      },
      {
        preferredValue: "Earl Sweatshirt",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "Domo Genesis",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "Mike G",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "Frank Ocean",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "Left Brain",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "Syd",
        otherValues: ["Syd Tha Kyd", "Syd tha Kyd"],
        minimumFrequency: 1,
      },
      {
        preferredValue: "Matt Martians",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "Jasper Dolphin",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "L-Boy",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "Taco",
        otherValues: ["Taco Bennett"],
        minimumFrequency: 1,
      },
      {
        preferredValue: "The Internet",
        otherValues: [],
        minimumFrequency: 0.5,
      },
      {
        preferredValue: "Casey Veggies",
        otherValues: [],
        minimumFrequency: 0.25,
      },
      {
        preferredValue: "Brandun DeShay",
        otherValues: ["Brandun Deshay"],
        minimumFrequency: 0.25,
      },
      {
        preferredValue: "The Super 3",
        otherValues: ["The Jet Age of Tomorrow"],
        minimumFrequency: 0,
      },
      {
        preferredValue: "Hal Williams",
        otherValues: [],
        minimumFrequency: 0,
      },
      {
        preferredValue: "Na-kel Smith",
        otherValues: ["Na'kel Smith", "Na-Kel", "Na-Kel Smith"],
        minimumFrequency: 0,
      },
    ],
  });
});

interface TestGroupMembersQueryApi
  extends Pick<
    TestGptQueryApi<
      { officialGroupMembers: Array<string> },
      ExpectedDistribution<string>
    >,
    "systemPrompt" | "expectedDistribution"
  > {
  artistName: string;
}

function testGroupMembersQuery(api: TestGroupMembersQueryApi) {
  const { systemPrompt, expectedDistribution, artistName } = api;
  return testGptQuery({
    numberOfResults: 4,
    maxTokens: 1024,
    temperature: 1,
    topProbability: 0.01,
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
    systemPrompt,
    expectedDistribution,
    userQuery: `Calculate "${artistName}"`,
  });
}
