import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import { getMeUser } from "../_utilities/getMeUser";

export const metadata: Metadata = {
  title: "PondPedia | Account",
  description: "Halaman akun user pondpedia",
  // other metadata
};

export default async function Home() {
  await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      "You must be logged in to access your account.",
    )}&redirect=${encodeURIComponent("/account")}`,
  });

  return (
    <>
      <ECommerce/>
    </>
  );
}
