import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "../payload-types";
import Modal from '@/components/Modal'


export const getMeUser = async (args?: {
  nullUserRedirect?: string;
  validUserRedirect?: string;
}): Promise<{
  user: User;
  token: string | undefined;
  showModal?: boolean
}> => {
  const { nullUserRedirect, validUserRedirect } = args || {};
  const cookieStore = cookies();
  const token = cookieStore.get("payload-token")?.value;
  let showModal = false;

  const meUserReq = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/me`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
  );

  const {
    user,
  }: {
    user: User;
  } = await meUserReq.json();

  if (validUserRedirect && meUserReq.ok && user) {
    showModal = true
    redirect(validUserRedirect);
  }
  
  if (nullUserRedirect && (!meUserReq.ok || !user)) {
    showModal = true
    console.log(nullUserRedirect)
  }

  return {
    user,
    token,
    showModal
  };
};
