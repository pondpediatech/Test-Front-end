"use client";

import React from "react";
import Link from "next/link";
import ThemeToggler from "../ThemeToggler";

import { useAuth } from "../../../app/_providers/Auth";

import classes from "./index.module.scss";

export const HeaderNav: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav
      className={[
        classes.nav,
        // fade the nav in on user load to avoid flash of content and layout shift
        // Vercel also does this in their own website header, see https://vercel.com
        user === undefined && classes.hide,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {user && (
        <React.Fragment>
          <div className="flex items-center justify-end pr-16 lg:pr-0">
            <Link
              href="/account"
              className="hidden px-7 py-3 text-base font-medium text-dark hover:opacity-70 dark:text-white md:block"
            >
              Account
            </Link>
            <Link
              href="/signup"
              className="ease-in-up hidden rounded-sm bg-primary px-8 py-3 text-base font-medium text-white shadow-btn transition duration-300 hover:bg-opacity-90 hover:shadow-btn-hover md:block md:px-9 lg:px-6 xl:px-9"
            >
              Sign Out
            </Link>
          </div>
        </React.Fragment>
      )}
      {!user && (
        <React.Fragment>
          {/* <Link href="/login">Login</Link>
          <Link href="/create-account">Create Account</Link> */}
          <div className="flex items-center justify-end pr-16 lg:pr-0">
            <Link
              href="/login"
              className="hidden px-7 py-3 text-base font-medium text-dark hover:opacity-70 dark:text-white md:block"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="ease-in-up hidden rounded-sm bg-primary px-8 py-3 text-base font-medium text-white shadow-btn transition duration-300 hover:bg-opacity-90 hover:shadow-btn-hover md:block md:px-9 lg:px-6 xl:px-9"
            >
              Sign Up
            </Link>
            <div>
              <ThemeToggler />
            </div>
          </div>
        </React.Fragment>
      )}
    </nav>
  );
};
