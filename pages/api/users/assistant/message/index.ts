import { openai } from "@/payload/utilities/openai";
import { getPayloadClient } from "@/payload/payloadClient";

export default async function handler(req: any, res: any) {
  const { assistantId, userId, username } = req.body;

  console.log(req.body)

  const payload = await getPayloadClient();
  
  try {
    const emptyThread = await openai.beta.threads.create();

    const thread = await payload.create({
      collection: "thread",
      data: {
        user: userId,
        assistantId: assistantId,
        threadId: emptyThread.id,
        name: `Asisten ${username}`,
      },
    });

    res.status(200).json({
      threadId: thread.threadId,
      userId,
      assistantId,
    });
  } catch (error) {
    payload.logger.error("MESSAGE", error);
    console.log(error);
  }
}
