import React from 'react'

import { getMeUser } from '../_utilities/getMeUser'
import SigninPage from './SignInForm'
import Modal from '@/components/Modal'


export default async function Login() {
  const bruh = await getMeUser({
    validUserRedirect: `/account?message=${encodeURIComponent('You are already logged in.')}`,
  })

  return (
    <>
      <SigninPage />
      {/* <Modal /> */}
    </>
  )
}
