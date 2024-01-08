import { getPayloadClient } from "@/payload/payloadClient";

export default async function handler(req: any, res: any) {
const { query } = req;
  const assistantId = query.assistantId;
  const payload = await getPayloadClient();

  try {
    const thread = await payload.find({
        collection: "thread",
        where: {
          assistantId: {
            equals: assistantId,
          },
        },
      });
      res.status(200).json({
        threads: thread,
      });
  } catch (error) {
    payload.logger.error("ASSISTANT", error);
  }
}