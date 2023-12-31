import React from 'react'

import { getMeUser } from '../../_utilities/getMeUser'
import SettingPage from './SettingPage'

export default async function Login() {
  await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to access your account.',
    )}&redirect=${encodeURIComponent('/account')}`,
  })

  return (
    <SettingPage />
  )
}
