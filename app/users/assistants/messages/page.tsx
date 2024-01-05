import React from 'react'

import { getMeUser } from '../../../_utilities/getMeUser'
import { MessagesPage } from './MessagePages'

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assistant | PondPedia",
  description: "Halaman Asisten Virtual PondPedia",
  // other metadata
};

export default async function Login() {
  await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to access your account.',
    )}&redirect=${encodeURIComponent('/users')}`,
  })

  return (
    <MessagesPage />
  )
}
