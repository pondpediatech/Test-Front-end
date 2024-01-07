import React from 'react'
import LogoutPage from './LogoutPage'

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Logout | PondPedia",
  description: "Halaman Logout PondPedia",
};

export default async function Logout() {
  return (
    <LogoutPage />
  )
}
