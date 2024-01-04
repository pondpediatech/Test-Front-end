import React from 'react'

import { getMeUser } from '../_utilities/getMeUser'
import SigninPage from './SignInForm'


export default async function Login() {
  const bruh = await getMeUser({
    validUserRedirect: `/users?message=${encodeURIComponent('You are already logged in.')}`,
  })

  return (
    <>
      <SigninPage />
    </>
  )
}
