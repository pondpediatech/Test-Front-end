import React from "react";
import { getMeUser } from '../../_utilities/getMeUser'

// import { Metadata } from "next";
// export const metadata: Metadata = {
//   title: "Dashboard | PondPedia",
//   description: "Halaman Dashboard PondPedia",
// };

export default async function Dashboard() {
  await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to access your account.',
    )}&redirect=${encodeURIComponent('/users')}`,
  })

  await getMeUser({
    validUserRedirect: "/users/management/water",
  });
};
