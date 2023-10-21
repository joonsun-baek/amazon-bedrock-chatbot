import { BedrockModel } from './bedrock';

export interface Prompt {
  id: string;
  name: string;
  description: string;
  content: string;
  model: BedrockModel;
  folderId: string | null;
}
