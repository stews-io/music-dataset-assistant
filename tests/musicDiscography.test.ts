import { loadSync as loadEnvironmentVariables } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import * as Zod from "https://deno.land/x/zod@v3.22.4/mod.ts";
import {
  ExpectedDistribution,
  TestGptQueryApi,
  expectedItem,
  testGptQuery,
} from "./helpers/queryGptData.ts";

loadEnvironmentVariables({
  envPath: "./.secrets",
  export: true,
});

Deno.test({ name: "Query Discography: Kanye West" }, async (testContext) => {
  const musicDiscographySystemPrompt = await Deno.readTextFile(
    "./assets/generated/musicDiscography-system-prompt.md"
  );
  await testContext.step("Albums", async () => {
    await Promise.all([
      testMusicDiscographyQuery<{ discographyAlbums: Array<string> }>({
        systemPrompt: musicDiscographySystemPrompt,
        discographyKeySuffix: "Albums",
        discographyQuerySuffix: "Studio, Collaborative, and Compilation Albums",
        artistName: "Kanye West",
        expectedDistribution: [
          expectedItem("The College Dropout"),
          expectedItem("Late Registration"),
          expectedItem("Graduation"),
          expectedItem("808s & Heartbreak"),
          expectedItem("My Beautiful Dark Twisted Fantasy"),
          expectedItem("Yeezus"),
          expectedItem("The Life of Pablo"),
          expectedItem("Ye"),
          expectedItem("Jesus Is King"),
          expectedItem("Donda"),
          expectedItem("Watch the Throne"),
          expectedItem("Jesus Is Born"),
          expectedItem("Kids See Ghosts"),
          expectedItem("Cruel Summer"),
        ],
      }),
      testMusicDiscographyQuery<{ discographyAlbums: Array<string> }>({
        systemPrompt: musicDiscographySystemPrompt,
        discographyKeySuffix: "Albums",
        discographyQuerySuffix: "Live Albums",
        artistName: "Kanye West",
        expectedDistribution: [
          {
            preferredValue: "Late Orchestration",
            otherValues: [],
            minimumFrequency: 1,
          },
          {
            preferredValue: "VH1 Storytellers",
            otherValues: [],
            minimumFrequency: 1,
          },
        ],
      }),
    ]);
  });
  await testContext.step("Mixtapes", async () => {
    await testMusicDiscographyQuery<{ discographyAlbums: Array<string> }>({
      systemPrompt: musicDiscographySystemPrompt,
      discographyKeySuffix: "Mixtapes",
      discographyQuerySuffix: "Mixtapes",
      artistName: "Kanye West",
      expectedDistribution: [
        expectedItem("Get Well Soon..."),
        expectedItem("I'm Good"),
        expectedItem("Kon The Louis Vuitton Don"),
        expectedItem("Can't Tell Me Nothing"),
      ],
    });
  });
  await testContext.step("Eps", async () => {
    await testMusicDiscographyQuery<{ discographyAlbums: Array<string> }>({
      systemPrompt: musicDiscographySystemPrompt,
      discographyKeySuffix: "Eps",
      discographyQuerySuffix: "Eps",
      artistName: "Kanye West",
      expectedDistribution: [],
    });
  });
  await testContext.step("Singles", async () => {
    await testMusicDiscographyQuery<{ discographyAlbums: Array<string> }>({
      systemPrompt: musicDiscographySystemPrompt,
      discographyKeySuffix: "Singles",
      discographyQuerySuffix: "Singles",
      artistName: "Kanye West",
      expectedDistribution: [
        expectedItem("Through the Wire"),
        expectedItem("Slow Jamz"),
        expectedItem("All Falls Down"),
        expectedItem("Jesus Walks"),
        expectedItem("The New Workout Plan"),
        expectedItem("Diamonds from Sierra Leone"),
        expectedItem("Gold Digger"),
        expectedItem("Heard 'Em Say"),
        expectedItem("Touch the Sky"),
        expectedItem("Drive Slow"),
        expectedItem("Stronger"),
        expectedItem("Good Life"),
        expectedItem("Homecoming"),
        expectedItem("Flashing Lights"),
        expectedItem("Love Lockdown"),
        expectedItem("Heartless"),
        expectedItem("Amazing"),
        expectedItem("Paranoid"),
        expectedItem("Power"),
        expectedItem("Runaway"),
        expectedItem("Monster"),
        expectedItem("All of the Lights"),
        expectedItem("H•A•M"),
        expectedItem("Otis"),
        expectedItem("Lift Off"),
        expectedItem("Niggas in Paris"),
        expectedItem("Why I Love You"),
        expectedItem("Mercy"),
        expectedItem("Cold"),
        expectedItem("New God Flow"),
        expectedItem("Clique"),
        expectedItem("Black Skinhead"),
        expectedItem("Bound 2"),
        expectedItem("Only One"),
        expectedItem("FourFiveSeconds"),
        expectedItem("All Day"),
        expectedItem("Famous"),
        expectedItem("New God Flow"),
        expectedItem("Clique"),
        expectedItem("Black Skinhead"),
        expectedItem("Bound 2"),
        expectedItem("Only One"),
        expectedItem("Father Stretch My Hands Pt. 1"),
        expectedItem("Fade"),
        expectedItem("Saint Pablo"),
        expectedItem("Ye vs. the People"),
        expectedItem("Yikes"),
        expectedItem("All Mine"),
        expectedItem("I Love It"),
        expectedItem("Follow God"),
        expectedItem("Closed on Sunday"),
        expectedItem("Wash Us in the Blood"),
        expectedItem("Nah Nah Nah"),
        expectedItem("Hurricane"),
        expectedItem("Wolves"),
        expectedItem("XTCY"),
        expectedItem("Ghost Town"),
        expectedItem("Lift Yourself"),
        expectedItem("Eazy"),
      ],
    });
  });
});

Deno.test(
  { name: "Query Discography: Mac Miller", only: true },
  async (testContext) => {
    const musicDiscographySystemPrompt = await Deno.readTextFile(
      "./assets/generated/musicDiscography-system-prompt.md"
    );
    await testContext.step("Albums", async () => {
      await Promise.all([
        testMusicDiscographyQuery<{ discographyAlbums: Array<string> }>({
          systemPrompt: musicDiscographySystemPrompt,
          discographyKeySuffix: "Albums",
          discographyQuerySuffix:
            "Studio, Collaborative, and Compilation Albums Excluding Mixtapes and Live Albums",
          artistName: "Mac Miller",
          expectedDistribution: [
            expectedItem("Blue Slide Park"),
            expectedItem("Watching Movies with the Sound Off"),
            expectedItem("GO:OD AM"),
            expectedItem("The Divine Feminine"),
            expectedItem("Swimming"),
            expectedItem("Circles"),
          ],
        }),
        testMusicDiscographyQuery<{ discographyAlbums: Array<string> }>({
          systemPrompt: musicDiscographySystemPrompt,
          discographyKeySuffix: "Albums",
          discographyQuerySuffix: "Live Albums",
          artistName: "Mac Miller",
          expectedDistribution: [expectedItem("Live from Space")],
        }),
      ]);
    });
    await testContext.step("Mixtapes", async () => {
      await testMusicDiscographyQuery<{ discographyAlbums: Array<string> }>({
        systemPrompt: musicDiscographySystemPrompt,
        discographyKeySuffix: "Mixtapes",
        discographyQuerySuffix: "Mixtapes",
        artistName: "Mac Miller",
        expectedDistribution: [
          expectedItem("But My Mackin' Ain't Easy"),
          expectedItem("The Jukebox: Prelude to Class Clown"),
          expectedItem("The High Life"),
          expectedItem("K.I.D.S."),
          expectedItem("Best Day Ever"),
          expectedItem("I Love Life, Thank You"),
          expectedItem("Macadelic"),
          expectedItem("Run-On Sentences, Vol. 1"),
          expectedItem("Stolen Youth"),
          expectedItem("Faces"),
          expectedItem("Run-On Sentences, Vol. 2"),
        ],
      });
    });
    await testContext.step("Eps", async () => {
      await testMusicDiscographyQuery<{ discographyAlbums: Array<string> }>({
        systemPrompt: musicDiscographySystemPrompt,
        discographyKeySuffix: "Eps",
        discographyQuerySuffix: "Eps Excluding Mixtapes and Live Albums",
        artistName: "Mac Miller",
        expectedDistribution: [
          expectedItem("On and On and Beyond"),
          expectedItem("You"),
        ],
      });
    });
    await testContext.step("Singles", async () => {
      await testMusicDiscographyQuery<{ discographyAlbums: Array<string> }>({
        systemPrompt: musicDiscographySystemPrompt,
        discographyKeySuffix: "Singles",
        discographyQuerySuffix: "Singles",
        artistName: "Mac Miller",
        expectedDistribution: [
          expectedItem("Knock Knock"),
          expectedItem("Frick Park Market"),
          expectedItem("Party on Fifth Ave."),
          expectedItem("Missed Calls"),
          expectedItem("Loud"),
          expectedItem("S.D.S."),
          expectedItem("Watching Movies"),
          expectedItem("Goosebumpz"),
          expectedItem("Objects in the Mirror"),
          expectedItem("The Star Room"),
          expectedItem("Youforia"),
          expectedItem("Diablo"),
          expectedItem("Weekend"),
          expectedItem("100 Grandkids"),
          expectedItem("Clubhouse"),
          expectedItem("Brand Name"),
          expectedItem("Two Matches"),
          expectedItem("Rush Hour"),
          expectedItem("Dang!"),
          expectedItem("Stay"),
          expectedItem("My Favorite Part"),
          expectedItem("Cinderella"),
          expectedItem("What's the Use?"),
          expectedItem("Self Care"),
          expectedItem("Small Worlds"),
          expectedItem("Dunno"),
          expectedItem("Good News"),
          expectedItem("Blue World"),
          expectedItem("Circles"),
          expectedItem("Right"),
          expectedItem("I Am Who Am (Killin' Time)"),
          expectedItem("We"),
          expectedItem("Hurt Feelings"),
          expectedItem("Wings"),
          expectedItem("Ladders"),
          expectedItem("Buttons"),
          expectedItem("Programs"),
          expectedItem("Everybody"),
          expectedItem("That's on Me"),
          expectedItem("Hands"),
          expectedItem("Surf"),
          expectedItem("Once a Day"),
          expectedItem("Floating"),
          expectedItem("Woods"),
          expectedItem("Hand Me Downs"),
        ],
      });
    });
  }
);

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
    numberOfResults: 2,
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
    userQuery: `Calculate: ${artistName} ${discographyQuerySuffix}`,
  });
}
