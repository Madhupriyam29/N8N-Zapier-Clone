import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
   
    // Fetching the video
    await step.sleep("fetching-a-moment", "5s");
    
    // Transcribing
    await step.sleep("transcribing-a-moment", "5s");
    
    // Sending transcription to AI
    await step.sleep("sending-to-ai", "5s");
    
    await step.run("create-workflow", () => {
      return prisma.workflow.create({
        data: {
          name: "workflow-from-inngest",
        },
      });
    });
    
  },
);