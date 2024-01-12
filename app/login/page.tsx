import React from 'react'

import { getMeUser } from '../_utilities/getMeUser'
import SigninPage from './LogInForm'
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Login | PondPedia",
  description: "Halaman Login PondPedia",
};

export default async function Login() {
  await getMeUser({
    validUserRedirect: `/users/management?message=${encodeURIComponent('You are already logged in.')}`,
  })

  return (
    <>
      <SigninPage />
    </>
  )
}
