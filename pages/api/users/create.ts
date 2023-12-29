import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { getPayloadClient } from "@/payload/payloadClient";
import { openai, config } from "@/payload/utilities/openai";
import { Assistant } from "../../../app/payload-types";

type ResponseData = {
  message: string;
  assistant: Assistant | null;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const { name, email, occupation, username, phone_number, roles, password } =
    req.body;

  const payload = await getPayloadClient();

  try {
    const existingUser = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (existingUser.docs.length > 0) {
      return res.status(409).json({
        message: "A user with the given email already exists.",
        assistant: null,
      });
    }

    const user = await payload.create({
      collection: "users",
      data: {
        id: uuidv4(),
        name,
        email,
        occupation,
        username,
        password,
        phone_number,
        roles,
      },
    });

    const createAssistant = await openai.beta.assistants.create({
      name: `Asisten ${name}`,
      instructions: config.instruction,
      model: config.model,
    });

    // Store The Created Assistant
    const assistantData = await createAssistant;

    const assistant = await payload.create({
      collection: "assistant",
      data: {
        user: user.id,
        name: assistantData.name as string,
        assistantId: assistantData.id,
      },
    });

    res.status(201).json({
      message: "Assistant created successfully",
      assistant: assistant,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    payload.logger.error(message)
    res.json({ message, assistant: null });
  }
};

export default handler;
