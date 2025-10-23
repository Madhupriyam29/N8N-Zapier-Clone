import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { createOpenAI } from '@ai-sdk/openai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import * as Sentry from "@sentry/nextjs";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const openrouter = createOpenRouter();

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    await step.sleep("pretend", "5s")
    
    Sentry.logger.info('User triggered test log', { log_source: 'sentry_test' })

    const { steps :geminiSteps } = await step.ai.wrap("gemini-generate-text",
      generateText, {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant.",
        prompt: "What is 2 + 2?",
         experimental_telemetry: {
            isEnabled: true,
            recordInputs: true,
            recordOutputs: true,
  },
      });

      const { steps :openaiSteps } = await step.ai.wrap("openai-generate-text",
      generateText, {
        model: openai("gpt-4o-mini"),
        system: "You are a helpful assistant.",
        prompt: "What is 2 + 2?",
         experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
  },
      });

      const { steps :anthropicSteps } = await step.ai.wrap("anthropic-generate-text",
      generateText, {
        model: openrouter.chat('anthropic/claude-3.5-sonnet'),
        system: "You are a helpful assistant.",
        prompt: "What is 2 + 2?",
         experimental_telemetry: {
            isEnabled: true,
            recordInputs: true,
            recordOutputs: true,
  },
      });

    return  {geminiSteps, openaiSteps, anthropicSteps} ;
    
  },
);