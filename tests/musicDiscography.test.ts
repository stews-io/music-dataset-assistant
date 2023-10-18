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

Deno.test({ name: "Query Kanye West Discography" }, async () => {
  const musicDiscographySystemPrompt = await Deno.readTextFile(
    "./assets/generated/musicDiscography-system-prompt.md"
  );
  await testMusicDiscographyQuery<{ discographyAlbums: Array<string> }>({
    systemPrompt: musicDiscographySystemPrompt,
    discographyKeySuffix: "Albums",
    discographyQuerySuffix:
      "Studio, Collaborative, Compiliation, and Live Albums",
    artistName: "Kanye West",
    expectedDistribution: [
      {
        preferredValue: "The College Dropout",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "Late Registration",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "Graduation",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "808s & Heartbreak",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "My Beautiful Dark Twisted Fantasy",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "Watch the Throne",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "Yeezus",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "The Life of Pablo",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "Ye",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "Jesus Is King",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "Jesus Is Born",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "Donda",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "Kids See Ghosts",
        otherValues: [],
        minimumFrequency: 1,
      },
      {
        preferredValue: "Cruel Summer",
        otherValues: [],
        minimumFrequency: 1,
      },
    ],
  });
  // await testMusicDiscographyQuery<{ discographyAlbums: Array<string> }>({
  //   systemPrompt: musicDiscographySystemPrompt,
  //   discographyKeySuffix: "Mixtapes",
  //   discographyQuerySuffix: "Mixtapes",
  //   artistName: "Kanye West",
  //   expectedDistribution: [],
  // });
  // await testMusicDiscographyQuery<{ discographyAlbums: Array<string> }>({
  //   systemPrompt: musicDiscographySystemPrompt,
  //   discographyKeySuffix: "Eps",
  //   discographyQuerySuffix: "Eps",
  //   artistName: "Kanye West",
  //   expectedDistribution: [],
  // });
  // await testMusicDiscographyQuery<{ discographyAlbums: Array<string> }>({
  //   systemPrompt: musicDiscographySystemPrompt,
  //   discographyKeySuffix: "Singles",
  //   discographyQuerySuffix: "Singles",
  //   artistName: "Kanye West",
  //   expectedDistribution: [],
  // });
  // await testMusicDiscographyQuery<{ discographyAlbums: Array<string> }>({
  //   systemPrompt: musicDiscographySystemPrompt,
  //   discographyKeySuffix: "NotableWorks",
  //   discographyQuerySuffix: "Notable Works",
  //   artistName: "Kanye West",
  //   expectedDistribution: [],
  // });
});

interface TestMusicDiscographyQueryApi<GptMessageData>
  extends Pick<
    TestGptQueryApi<GptMessageData, ExpectedDistribution<string>>,
    "systemPrompt" | "expectedDistribution"
  > {
  discographyKeySuffix: string;
  discographyQuerySuffix: string;
  artistName: string;
}

function testMusicDiscographyQuery<GptMessageData>(
  api: TestMusicDiscographyQueryApi<GptMessageData>
) {
  const {
    discographyKeySuffix,
    systemPrompt,
    expectedDistribution,
    artistName,
    discographyQuerySuffix,
  } = api;
  const discographyKey = `discography${discographyKeySuffix}`;
  return testGptQuery({
    numberOfResults: 4,
    maxTokens: 1024,
    temperature: 2,
    topProbability: 0.1,
    dataItemSchema: Zod.object({
      [discographyKey]: Zod.array(Zod.string()),
    }),
    getDistributionMap: (someGptQueryData) =>
      someGptQueryData.reduce<Record<string, number>>(
        (result, someQueryData) => {
          someQueryData[discographyKey]!.forEach((someGroupMember) => {
            const previousTargetCount = result[someGroupMember] ?? 0;
            result[someGroupMember] = previousTargetCount + 1;
          });
          return result;
        },
        {}
      ),
    systemPrompt,
    expectedDistribution,
    userQuery: `Calculate "${artistName} ${discographyQuerySuffix}"`,
  });
}
