import type { NextApiRequest, NextApiResponse } from "next";
import { getPayloadClient } from "@/payload/payloadClient";
import { openai, config } from "@/payload/utilities/openai";

import {
  auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
} from "../../../payload/utilities/firebase-config";

type ResponseData = {
  message: string;
  user: Object;
};

const handler = async (req: NextApiRequest, res:NextApiResponse<ResponseData>) => {
  let firebaseAuth;
  const { name, email, occupation, username, phone_number, password } =
    req.body;
  const payload = await getPayloadClient();

  // Check if user exists in parallel
  const existingUserCheck = payload.find({
    collection: "users",
    where: {
      email: { equals: email },
      username: { equals: username },
    },
  });

  try {
    const existingUser = await existingUserCheck;

    if (existingUser.docs.length > 0) {
      return res.status(409).json({
        message: "Email atau username sudah digunakan",
        user: {},
      });
    }

    const createAssistant = await openai.beta.assistants.create({
      name: `Asisten ${username}`,
      instructions: config.instruction,
      model: config.model,
    });

    // Create user in parallel
    const createUserTask = createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    
    firebaseAuth = await createUserTask;

    const createPayloadUserTask = payload.create({
      collection: "users",
      data: {
        id: firebaseAuth.user.uid,
        assistantId: createAssistant.id,
        name,
        email,
        occupation,
        username,
        password,
        phone_number,
        uses_social_login: false,
      },
    });

    firebaseAuth = await createUserTask;
    const user = await createPayloadUserTask;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        sendEmailVerification(user);
      }
    });

    return res.status(201).json({
      message:
        "Berhasil membuat akun. Silahkan cek email anda untuk verifikasi akun",
      user,
    });
  } catch (error) {
    let message = "";
    switch (error.code) {
      case "auth/email-already-in-use":
        message = "Email sudah digunakan";
        break;
      case "auth/invalid-email":
        message = "Email tidak valid";
        break;
      case "auth/weak-password":
        message = "Password terlalu lemah";
        break;
      default:
        message = error instanceof Error ? error.message : "Unknown error";
    }

    payload.logger.error(message);
    res.json({ message, user: {} });
  }
};

export default handler;
