# Amazon Bedrock Chatbot

## About

Amazon Bedrock Chatbot is an intuitive chat UI tailored for Amazon's AI models. This project was initiated from [Chatbot UI's open-source](https://github.com/mckaywrigley/chatbot-ui) codebase.

It is built on top of Chatbot UI and retains the same configuration and usage, Key things of this project are:

- Service name changed to Amazon Bedrock Chatbot
- Supports Amazon Bedrock Models (Claude v1, Claude v2, and Claude instant).
- Licensed under MIT, same as Chatbot UI


## Updates

- Forked and initial version deployed from Chatbot UI
- Modified to use AWS Access Key and Secret Key based structure
- Supports Claude v1, v2, and instant models from Bedrock


## Deploy

**Docker**

Build locally:

```shell
docker build -t amazon-bedrock-chatgpt .
docker run -e AWS_ACCESS_KEY_ID=xxxxxxxx -e AWS_SECRET_ACCESS_KEY=xxxxxxxx -p 3000:3000 amazon-bedrock-chatgpt
```

## Running Locally

**1. Clone Repo**

```bash
git clone https://github.com/joonsun-baek/amazon-bedrock-chatbot.git
```

**2. Install Dependencies**

```bash
npm i
```

**3. Provide AWSAccessKeyId, AWSSecretAccessKey**

Create a .env.local file in the root of the repo with your AWS Keys:

```bash
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
```

**4. Run App**

```bash
npm run dev
```

**5. Use It**

You should be able to start chatting.

## Configuration

When deploying the application, the following environment variables can be set:

| Environment Variable              | Default value                  | Description                                           |
| --------------------------------- |--------------------------------|-------------------------------------------------------|
| AWS_ACCESS_KEY_ID                 |                                | AWS Access Key ID used for Amazon Bedrock API         |
| AWS_SECRET_ACCESS_KEY             |                                | AWS Secret Access Key used for Amazon Bedrock API     |
| DEFAULT_MODEL                     | `anthropic.claude-instant-v1`  | The default model to use on new conversations.        |


## Contact

Any feedback, even small comments, are welcome. If you have any questions, please feel free to reach out to me anytime.

Amazon Bedrock Chatbot is licensed under the MIT license, same as Chatbot UI. See LICENSE file for details.