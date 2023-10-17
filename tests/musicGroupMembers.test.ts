import { loadSync as loadEnvironmentVariables } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import {
  CreateGptQueryTestStepApi,
  createGptQueryTestStep,
} from "./helpers/queryGptData.ts";

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
    domainSystemPrompt: musicGroupMembersSystemPrompt,
    artistName: "Digital Underground",
    acceptableDistributionMap: {
      "Shock G": 3,
      "Chopmaster J": 3,
      "Kenny-K": 3,
      "Money-B": 3,
      "DJ Fuze": 3,
      "Doctor Fink": 3,
      "2Pac": 3,
      Saafir: 3,
      Numskull: 3,
      Mystic: 3,
      Esinchill: 3,
      Clee: 3,
      "Bigg Money Odis": 3,
      BINC: 3,
    },
  });
  await createGroupMembersTestStep({
    testContext,
    domainSystemPrompt: musicGroupMembersSystemPrompt,
    artistName: "Odd Future",
    acceptableDistributionMap: {
      "Tyler, The Creator": 3,
      Hodgy: 3,
      "Earl Sweatshirt": 3,
      "Domo Genesis": 3,
      "Mike G": 3,
      "Frank Ocean": 3,
      "Left Brain": 3,
      "The Internet": 3,
      Syd: 3,
      "Matt Martians": 3,
      "Jasper Dolphin": 3,
      Taco: 3,
      "L-Boy": 3,
      "Casey Veggies": 1,
      "Brandun DeShay": 1,
    },
  });
  await createGroupMembersTestStep({
    testContext,
    domainSystemPrompt: musicGroupMembersSystemPrompt,
    artistName: "Brockhampton",
    acceptableDistributionMap: {
      "Kevin Abstract": 3,
      "Matt Champion": 3,
      "Merlyn Wood": 3,
      "Dom McLennon": 3,
      Joba: 3,
      Bearface: 3,
      "Romil Hemnani": 3,
      "Jabari Manwa": 3,
      "Kiko Merley": 3,
      "Henock Sileshi": 1,
      "Robert Ontenient": 3,
      "Jon Nunes": 1,
      "Ashlan Grey": 3,
      "Ameer Vann": 2,
      "Henock 'HK' Sileshi": 2,
    },
  });
});

interface CreateGroupMembersTestStepApi
  extends Pick<
    CreateGptQueryTestStepApi<Record<string, number>>,
    | "testContext"
    | "artistName"
    | "domainSystemPrompt"
    | "acceptableDistributionMap"
  > {}

function createGroupMembersTestStep(api: CreateGroupMembersTestStepApi) {
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
    numberOfResults: 5,
    getResultDistributionMap: (someGptQueryData) =>
      someGptQueryData.reduce((result, someQueryData) => {
        someQueryData.groupMembers.forEach((someGroupMember: any) => {
          const previousTargetCount = result[someGroupMember] ?? 0;
          result[someGroupMember] = previousTargetCount + 1;
        });
        return result;
      }, {}),
  });
}
