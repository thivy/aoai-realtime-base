import { createAzure } from "@ai-sdk/azure";

export const AzureProvider = () => {
  const resourceName = process.env.AZURE_OPENAI_RESOURCE_NAME!;
  const apiKey = process.env.AZURE_OPENAI_API_KEY!;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT!;
  const version = process.env.AZURE_OPENAI_API_VERSION!;
  const azure = createAzure({
    resourceName,
    apiKey,
    // example fetch wrapper that logs the input to the API call:
    fetch: async (_, options) => {
      const url = `https://${resourceName}.openai.azure.com/openai/deployments/${deployment}/chat/completions?api-version=${version}`;
      return await fetch(url, options);
    },
  });

  return azure("");
};
