import React from 'react'

import { getMeUser } from '../../_utilities/getMeUser'
import ProfilePage from './account/ProfilePage'

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
