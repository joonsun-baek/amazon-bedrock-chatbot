export interface BedrockModel {
  id: string;
  name: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
}

export enum BedrockModelID {
  CLAUDE_V1 = 'anthropic.claude-v1',
  CLAUDE_V2 = 'anthropic.claude-v2',
  CLAUDE_INSTANT_V1 = 'anthropic.claude-instant-v1',
}

// in case the `DEFAULT_MODEL` environment variable is not set or set to an unsupported model
export const BedrockFallbackModelID = BedrockModelID.CLAUDE_INSTANT_V1;

export const BedrockModels: Record<BedrockModelID, BedrockModel> = {
  [BedrockModelID.CLAUDE_V1]: {
    id: BedrockModelID.CLAUDE_V1,
    name: 'CLAUDE-V1',
    maxLength: 12000,
    tokenLimit: 10000,
  },
  [BedrockModelID.CLAUDE_V2]: {
    id: BedrockModelID.CLAUDE_V2,
    name: 'CLAUDE-V2',
    maxLength: 12000,
    tokenLimit: 10000,
  },
  [BedrockModelID.CLAUDE_INSTANT_V1]: {
    id: BedrockModelID.CLAUDE_INSTANT_V1,
    name: 'CLAUDE-INSTANT-V1',
    maxLength: 24000,
    tokenLimit: 10000,
  },
};
