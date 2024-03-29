import { openai } from "@/payload/utilities/openai";
import { getPayloadClient } from "@/payload/payloadClient";

const waitForMessageProcessing = async (threadId: string, runId: string) => {
  const maxAttempts = 20;
  const timeout = 1000;

  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    await new Promise((resolve) => setTimeout(resolve, timeout));

    const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

    if (["failed", "expired"].includes(runStatus.status)) {
      throw new Error("Message processing failed");
    }

    if (runStatus.status === "completed") {
      // console.log("Completed!");
      return runStatus;
    }

    // if (runStatus.status === "requires_action") {
    //     console.log('Requires Action!');
    //     await handleRequiredAction(runStatus, threadId, runId);
    // }
  }

  throw new Error("Message processing timed out");
};

const getLastMessage = async (threadId: string, runId: string) => {
  const messages: any = await openai.beta.threads.messages.list(threadId);

  const lastUserMessage = messages.body.data.filter(
    (message) => message.role === "user",
  )[0];

  const lastAssistantMessage = messages.body.data
    .filter(
      (message) => message.run_id === runId && message.role === "assistant",
    )
    .pop();

  return {
    lastUserMessage,
    lastAssistantMessage,
  };
};

const automaticNameForThread = async (
  threadId: string,
  userQuestion: string,
) => {
  const payload = await getPayloadClient();

  const threadName = await payload.find({
    collection: "thread",
    where: {
      threadId: {
        equals: threadId,
      },
    },
  });

  if (!threadName.docs[0].name) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [
          {
            role: "system",
            content: `Berikan sebuah deskripsi singkat tidak lebih dari 6 kata dari pertanyaan "${userQuestion}" Jangan gunakan tanda tanya atau karakter lain yang tidak diperlukan `,
          },
        ],
      });

      const result = await payload.update({
        collection: "thread", // required
        where: {
          threadId: {
            equals: threadId,
          },
        },
        data: {
          name: completion.choices[0].message.content ?? undefined,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
};

export default async function handler(req: any, res: any) {
  let runId: string;
  const payload = await getPayloadClient();
  const { userQuestion, assistantId } = req.body;
  const { threadId } = req.query;

  console.log(req.method);

  switch (req.method) {
    case "POST": // SEND A MESSAGE
      try {
        await openai.beta.threads.messages.create(threadId, {
          role: "user",
          content: userQuestion,
        });

        const run = await openai.beta.threads.runs.create(threadId, {
          assistant_id: assistantId,
        });

        runId = run.id;

        await waitForMessageProcessing(threadId, runId);

        const lastMessages = await getLastMessage(threadId, runId);
        automaticNameForThread(threadId, userQuestion);

        return res.status(200).json({
          success: true,
          data: {
            lastUserMessage: lastMessages.lastUserMessage.content[0].text.value,
            lastAssistantMessage:
              lastMessages.lastAssistantMessage.content[0].text.value,
          },
          message: "Message created successfully.",
        });
      } catch (error) {
        payload.logger.error(error);
      }
    case "GET": // GET ALL MESSAGES FROM A GIVEN THREAD
      try {
        await payload.find({
          collection: "thread",
          where: {
            threadId: {
              equals: threadId,
            },
          },
        });

        const threadMessages = await openai.beta.threads.messages.list(
          threadId,
          {
            limit: 100,
            order: "asc",
          },
        );

        return res.status(200).json({
          success: true,
          conversation: threadMessages.data.map((message) => {
            return {
              role: message.role,
              content:
                message.content[0].type === "text"
                  ? message.content[0].text.value
                  : "",
            };
          }),
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          data: { error: error.message },
          message: "Error retrieving thread.",
        });
      }
    case "DELETE": // DELETE A THREAD FROM A GIVEN THREAD ID
      try {
        await payload.delete({
          collection: "thread",
          where: {
            threadId: {
              equals: threadId,
            },
          },
        });

        const deletedThread = await openai.beta.threads.del(threadId);

        return res.status(200).json({
          success: true,
          data: {
            deletedThread,
          },
          message: "A thread deleted successfully.",
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          data: { error: error.message },
          message: "Error deleting a thread.",
        });
      }
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
