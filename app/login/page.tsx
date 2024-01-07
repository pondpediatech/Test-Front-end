import React from 'react'

import { getMeUser } from '../_utilities/getMeUser'
import SigninPage from './LogInForm'


export default async function Login() {
  await getMeUser({
    validUserRedirect: `/users?message=${encodeURIComponent('You are already logged in.')}`,
  })

  return (
    <>
      <SigninPage />
    </>
  )
}
