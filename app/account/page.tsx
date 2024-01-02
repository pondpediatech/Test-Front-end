import Water from "@/components/Dashboard/Water";
import { Metadata } from "next";
import { getMeUser } from "../_utilities/getMeUser";
import Modal from '@/components/Modal'

export const metadata: Metadata = {
  title: "PondPedia | Account",
  description: "Halaman akun user pondpedia",
  // other metadata
};

export default async function Home() {
  const bruh = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      "You must be logged in to access your account.",
    )}&redirect=${encodeURIComponent("/account")}`,
  });

  return (
    <>
      <Water/>
      {bruh.showModal && <Modal />}
    </>
  );
}
