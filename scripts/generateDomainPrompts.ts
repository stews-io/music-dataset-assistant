import { join as getJoinedPath } from "https://deno.land/std@0.204.0/path/mod.ts";

generateDomainPrompts({
  assetsDirectoryPath: "./assets",
});

interface GenerateDomainPromptsApi {
  assetsDirectoryPath: string;
}

async function generateDomainPrompts(api: GenerateDomainPromptsApi) {
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
    generateSystemPrompt({
      generatedAssetsDirectoryPath,
      baseSystemPromptText,
      domainKey: "artistType",
      domainTypesPath: getJoinedPath(
        sourceAssetsDirectoryPath,
        "./GptMusicArtistType.ts"
      ),
    }),
    generateSystemPrompt({
      generatedAssetsDirectoryPath,
      baseSystemPromptText,
      domainKey: "groupMembers",
      domainTypesPath: getJoinedPath(
        sourceAssetsDirectoryPath,
        "./GptMusicGroupMembers.ts"
      ),
    }),
    generateSystemPrompt({
      generatedAssetsDirectoryPath,
      baseSystemPromptText,
      domainKey: "musicDiscography",
      domainTypesPath: getJoinedPath(
        sourceAssetsDirectoryPath,
        "./GptMusicDiscography.ts"
      ),
    }),
  ]);
}

interface GenerateSystemPromptApi {
  generatedAssetsDirectoryPath: string;
  baseSystemPromptText: string;
  domainKey: string;
  domainTypesPath: string;
}

async function generateSystemPrompt(api: GenerateSystemPromptApi) {
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
