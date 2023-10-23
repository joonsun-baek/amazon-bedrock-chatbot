import { BedrockModel } from './bedrock';

export interface Message {
  role: Role;
  content: string;
}

export type Role = 'Assistant' | 'Human';

export interface ChatBody {
  model: BedrockModel;
  messages: Message[];
  key: string;
  prompt: string;
  temperature: number;
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  model: BedrockModel;
  prompt: string;
  temperature: number;
  folderId: string | null;
}
