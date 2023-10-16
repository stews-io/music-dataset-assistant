import { join as getJoinedPath } from "https://deno.land/std@0.204.0/path/mod.ts";

generatePrompts({
  assetsDirectoryPath: "./assets",
});

interface GeneratePromptsApi {
  assetsDirectoryPath: string;
}

async function generatePrompts(api: GeneratePromptsApi) {
  const { assetsDirectoryPath } = api;
  const sourceAssetsDirectoryPath = getJoinedPath(
    assetsDirectoryPath,
    "./source"
  );
  const generatedAssetsDirectoryPath = getJoinedPath(
    assetsDirectoryPath,
    "./generated"
  );
  const baseSystemPromptFilePath = getJoinedPath(
    sourceAssetsDirectoryPath,
    "./base-system-prompt.md"
  );
  const baseSystemPromptText = await Deno.readTextFile(
    baseSystemPromptFilePath
  );
  await Promise.all([
    generateDomainSystemPrompt({
      generatedAssetsDirectoryPath,
      baseSystemPromptText,
      domainKey: "artist",
      domainTypesPath: getJoinedPath(
        sourceAssetsDirectoryPath,
        "./MusicArtist.ts"
      ),
    }),
    generateDomainSystemPrompt({
      generatedAssetsDirectoryPath,
      baseSystemPromptText,
      domainKey: "discography",
      domainTypesPath: getJoinedPath(
        sourceAssetsDirectoryPath,
        "./MusicArtistDiscography.ts"
      ),
    }),
  ]);
}

interface GenerateDomainSystemPromptApi {
  generatedAssetsDirectoryPath: string;
  baseSystemPromptText: string;
  domainKey: string;
  domainTypesPath: string;
}

async function generateDomainSystemPrompt(api: GenerateDomainSystemPromptApi) {
  const {
    generatedAssetsDirectoryPath,
    domainKey,
    domainTypesPath,
    baseSystemPromptText,
  } = api;
  const domainPromptFilePath = getJoinedPath(
    generatedAssetsDirectoryPath,
    `./${domainKey}-system-prompt.md`
  );
  const domainTypesText = await Deno.readTextFile(domainTypesPath);
  await Deno.writeTextFile(
    domainPromptFilePath,
    `${baseSystemPromptText}\n\`\`\`typescript\n${domainTypesText}\`\`\``
  );
}
