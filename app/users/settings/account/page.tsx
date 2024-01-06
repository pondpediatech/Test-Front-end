import React from 'react'

import { getMeUser } from '../../../_utilities/getMeUser'
import ProfilePage from './ProfilePage'

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Pengaturan | PondPedia",
  description: "Halaman pengaturan profile",
  // other metadata
};

export default async function Login() {
  await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to access your account.',
    )}&redirect=${encodeURIComponent('/users')}`,
  })

  return (
    <ProfilePage />
  )
}
