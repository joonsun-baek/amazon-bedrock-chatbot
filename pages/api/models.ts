import { OPENAI_API_HOST, OPENAI_API_TYPE, OPENAI_API_VERSION, OPENAI_ORGANIZATION } from '@/utils/app/const';

import { BedrockModel, BedrockModelID, BedrockModels } from '@/types/bedrock';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const models: BedrockModel[] = [
      BedrockModels["anthropic.claude-instant-v1"],
      BedrockModels["anthropic.claude-v1"],
      BedrockModels["anthropic.claude-v2"],
    ]

    return new Response(JSON.stringify(models), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default handler;
