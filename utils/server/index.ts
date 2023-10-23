import { Message } from '@/types/chat';
import { OpenAIModel } from '@/types/openai';
import { BedrockModel } from '@/types/bedrock';

import { AZURE_DEPLOYMENT_ID, OPENAI_API_HOST, OPENAI_API_TYPE, OPENAI_API_VERSION, OPENAI_ORGANIZATION } from '../app/const';

import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from 'eventsource-parser';
import {AwsClient, AwsV4Signer} from "aws4fetch";

export class OpenAIError extends Error {
  type: string;
  param: string;
  code: string;

  constructor(message: string, type: string, param: string, code: string) {
    super(message);
    this.name = 'OpenAIError';
    this.type = type;
    this.param = param;
    this.code = code;
  }
}

export const OpenAIStream = async (
  model: OpenAIModel,
  systemPrompt: string,
  temperature : number,
  key: string,
  messages: Message[],
) => {
  let url = `${OPENAI_API_HOST}/v1/chat/completions`;
  if (OPENAI_API_TYPE === 'azure') {
    url = `${OPENAI_API_HOST}/openai/deployments/${AZURE_DEPLOYMENT_ID}/chat/completions?api-version=${OPENAI_API_VERSION}`;
  }
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(OPENAI_API_TYPE === 'openai' && {
        Authorization: `Bearer ${key ? key : process.env.OPENAI_API_KEY}`
      }),
      ...(OPENAI_API_TYPE === 'azure' && {
        'api-key': `${key ? key : process.env.OPENAI_API_KEY}`
      }),
      ...((OPENAI_API_TYPE === 'openai' && OPENAI_ORGANIZATION) && {
        'OpenAI-Organization': OPENAI_ORGANIZATION,
      }),
    },
    method: 'POST',
    body: JSON.stringify({
      ...(OPENAI_API_TYPE === 'openai' && {model: model.id}),
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages,
      ],
      max_tokens: 1000,
      temperature: temperature,
      stream: true,
    }),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const result = await res.json();
    if (result.error) {
      throw new OpenAIError(
        result.error.message,
        result.error.type,
        result.error.param,
        result.error.code,
      );
    } else {
      throw new Error(
        `OpenAI API returned an error: ${
          decoder.decode(result?.value) || result.statusText
        }`,
      );
    }
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;

          try {
            const json = JSON.parse(data);
            if (json.choices[0].finish_reason != null) {
              controller.close();
              return;
            }
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};


export class BedrockError extends Error {
  type: string;
  param: string;
  code: string;

  constructor(message: string, type: string, param: string, code: string) {
    super(message);
    this.name = 'BedrockError';
    this.type = type;
    this.param = param;
    this.code = code;
  }
}

export const BedrockStream = async (
    model: BedrockModel,
    systemPrompt: string,
    temperature: number,
    key: string,
    messages: Message[],
) => {
  const AWS_ACCESS_KEY_ID = `${process.env.AWS_ACCESS_KEY_ID}`
  const AWS_SECRET_ACCESS_KEY = `${process.env.AWS_SECRET_ACCESS_KEY}`

  const previousMessages = messages
    .map(message => {
      return `${message.role}:${message.content}`
    })
    .join("\n")
  const payloadMessage = `${previousMessages}\nAssistant:`
  // console.log(`payloadMessage : ${payloadMessage}`)

  let payload = {
    prompt: payloadMessage,
    max_tokens_to_sample: 10000,
    temperature: 0.9,
    top_p: 0.8,
    stop_sequences: ["\n\nHuman:"]
  }

  let url = `https://bedrock-runtime.us-east-1.amazonaws.com/model/${model.id}/invoke`;
  const request = sign({
    url: url,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1',
    service: 'bedrock',
    body: JSON.stringify(payload),
    headers: {
      'content-type': 'application/json',
      'accept': '*/*',
    }
  })

  const requestObj = await request
  const response = await fetch(requestObj.url, {
    headers: requestObj.headers,
    method: requestObj.method,
    body: requestObj.body,
  });

  const responseJson = await response.json()
  // console.log(`responseJson.completion: ${responseJson.completion}`)

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      let index = 0;
      const chunkSize = 30;

      const onParse = () => {
        if (index < responseJson.completion.length) {
          const chunk = responseJson.completion.substring(index, index + chunkSize);
          const encoded = encoder.encode(chunk)
          controller.enqueue(encoded);
          index += chunkSize;
          setTimeout(onParse, 50);
        } else {
          controller.close();
        }
      };

      onParse();
    }
  });
};


async function sign(opts: any): Promise<any> {
  const signer = new AwsV4Signer(opts)
  const { method, url, headers, body } = await signer.sign()
  return {
    method: method,
    url: url,
    headers: headers,
    body: body
  }
}
