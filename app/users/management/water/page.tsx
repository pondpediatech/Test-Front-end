import React from "react";
import GetWater from "./WaterPage";
import { getMeUser } from '../../../_utilities/getMeUser'

export default async function Water() {
  await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to access your account.',
    )}&redirect=${encodeURIComponent('/users')}`,
  })
  return (
    <>
      <GetWater />
    </>
  );
};
