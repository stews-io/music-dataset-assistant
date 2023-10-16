import { loadSync as loadEnvironmentVariables } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import { assertEquals } from "https://deno.land/std@0.204.0/assert/mod.ts";

loadEnvironmentVariables({
  envPath: "./.secrets",
  export: true,
});

Deno.test("Query MF Doom", async () => {
  const mfDoomJson = await queryGptData({
    systemPrompt: Deno.readTextFileSync(
      "./assets/generated/artist-system-prompt.md"
    ),
    userQuery: 'Calculate "MF Doom"',
  });
  console.log(mfDoomJson);
  assertEquals(mfDoomJson, {
    artistType: "individual",
    artistName: "MF Doom",
    artistStartDate: [1988, 7],
    artistRegions: [
      ["United States", "New York", "Long Island"],
      ["United Kingdom", "London", "Westminster"],
    ],
    artistTags: ["underground", "alternative", "abstract", "experimental"],
    artistPerson: {
      personFullName: "Daniel Dumile",
      personBirthDate: [1971, 1, 9],
      personBirthPlace: ["United Kingdom", "London", "Westminster"],
      personAliases: [
        "Zev Love X",
        "King Geedorah",
        "Viktor Vaughn",
        "Metal Fingers",
      ],
      personMusicGroups: ["KMD"],
    },
  });
});

Deno.test("Query Kanye West", async () => {
  const kanyeWestJson = await queryGptData({
    systemPrompt: Deno.readTextFileSync(
      "./assets/generated/artist-system-prompt.md"
    ),
    userQuery: 'Calculate "Kanye West"',
  });
  console.log(kanyeWestJson);
  assertEquals(kanyeWestJson, {
    artistType: "individual",
    artistName: "Kanye West",
    artistStartDate: [2001, 2],
    artistRegions: [["United States", "Illinois", "Chicago"]],
    artistTags: ["alternative", "experimental", "gospel"],
    artistPerson: {
      personFullName: "Kanye Omari West",
      personBirthDate: [1977, 6, 8],
      personBirthPlace: ["United States", "Georgia", "Atlanta"],
      personAliases: ["Yeezy", "Ye"],
      personMusicGroups: [],
    },
  });
});

Deno.test("Query Shabazz Palaces", async () => {
  const shabazzPalacesJson = await queryGptData({
    systemPrompt: Deno.readTextFileSync(
      "./assets/generated/artist-system-prompt.md"
    ),
    userQuery: 'Calculate "Shabazz Palaces"',
  });
  console.log(shabazzPalacesJson);
  // assertEquals(kanyeWestJson, {
  //   artistType: "individual",
  //   artistName: "Kanye West",
  //   artistStartDate: [2001, 2],
  //   artistRegions: [["United States", "Illinois", "Chicago"]],
  //   artistTags: ["alternative", "experimental", "gospel"],
  //   artistPerson: {
  //     personFullName: "Kanye Omari West",
  //     personBirthDate: [1977, 6, 8],
  //     personBirthPlace: ["United States", "Georgia", "Atlanta"],
  //     personAliases: ["Yeezy", "Ye"],
  //     personMusicGroups: [],
  //   },
  // });
});

interface QueryGptDataApi {
  systemPrompt: string;
  userQuery: string;
}

async function queryGptData(api: QueryGptDataApi) {
  const { systemPrompt, userQuery } = api;
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
        max_tokens: 1024,
        n: 1,
        temperature: 0,
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
  const postChatCompletionJson = await postChatCompletionResponse.json();
  return JSON.parse(postChatCompletionJson.choices[0].message.content);
}
