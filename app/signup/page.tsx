import React from 'react'

import { getMeUser } from '../_utilities/getMeUser'
import SignupPage from './SignUpForm'

export default async function CreateAccount() {
  await getMeUser({
    validUserRedirect: `/account?message=${encodeURIComponent(
      'Cannot create a new account while logged in, please log out and try again.',
    )}`,
  })

  return (
    <SignupPage />
  )
}
