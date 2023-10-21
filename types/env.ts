export interface ProcessEnv {
  OPENAI_API_KEY?: string;
  OPENAI_API_HOST?: string;
  OPENAI_API_TYPE?: 'openai' | 'azure';
  OPENAI_API_VERSION?: string;
  OPENAI_ORGANIZATION?: string;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
}
