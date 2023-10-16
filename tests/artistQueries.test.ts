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
    artistStartDate: 1988,
    artistPerson: {
      personFullName: "Daniel Dumile",
      personBirthDate: 1971,
      personBirthPlace: ["United Kingdom", "London", "Hammersmith"],
      personAliases: [
        "MF Doom",
        "Zev Love X",
        "King Geedorah",
        "Metal Fingers",
        "Viktor Vaughn",
        "DOOM",
      ],
      personMusicActs: [
        "KMD",
        "Madvillain",
        "Danger Doom",
        "JJ Doom",
        "NehruvianDoom",
      ],
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
    artistStartDate: 1996,
    artistPerson: {
      personFullName: "Kanye Omari West",
      personBirthDate: 1977,
      personBirthPlace: ["United States", "Georgia", "Atlanta"],
      personAliases: ["Yeezy", "Ye", "Yeezus"],
      personMusicActs: ["Kanye West"],
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
  assertEquals(shabazzPalacesJson, {
    artistType: "group",
    artistName: "Shabazz Palaces",
    artistStartDate: 2009,
    artistMembers: [
      {
        personFullName: "Ishmael Butler",
        personBirthDate: 1969,
        personBirthPlace: ["United States", "Washington", "Seattle"],
        personAliases: ["Butterfly", "Palaceer Lazaro"],
        personMusicActs: ["Digable Planets", "Shabazz Palaces"],
      },
      {
        personFullName: "Tendai Maraire",
        personBirthDate: 1977,
        personBirthPlace: ["Zimbabwe", "Harare", "Harare"],
        personAliases: [],
        personMusicActs: ["Shabazz Palaces"],
      },
    ],
  });
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
