import { getPayloadClient } from "@/payload/payloadClient";

export default async function handler(req: any, res: any) {
  const { query } = req;
  const assistantId = query.assistantId;
  const payload = await getPayloadClient();

  try {
    const threads = await payload.find({
      collection: "thread",
      where: {
        assistantId: {
          equals: assistantId,
        },
      },
    });
    res.status(200).json({
      success: true,
      threads,
    });
  } catch (error) {
    payload.logger.error(error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
