import React from 'react'

import { getMeUser } from '../_utilities/getMeUser'
import SigninPage from './SignInForm'

import classes from './index.module.scss'

export default async function Login() {
  await getMeUser({
    validUserRedirect: `/account?message=${encodeURIComponent('You are already logged in.')}`,
  })

  return (
    <SigninPage />
  )
}
