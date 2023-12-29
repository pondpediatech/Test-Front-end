import React, { Fragment } from "react";
import Link from "next/link";

// import { Gutter } from "../_components/Gutter";
import { getMeUser } from "../_utilities/getMeUser";
// import ChangeAccountPassword from "./ChangeAccountPassword";

import classes from "./index.module.scss";

export default async function Account() {
  const { user } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      "You must be logged in to access your account.",
    )}&redirect=${encodeURIComponent("/account")}`,
  });

  return (
    <Fragment>
      <h1>Change Password</h1>
      <p>
        {`This is your account dashboard. Here you can update your account information, view your water quality, and more.`}
      </p>
      {/* <ChangeAccountPassword /> */}
    </Fragment>
  );
}
