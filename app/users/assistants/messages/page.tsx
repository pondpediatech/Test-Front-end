import React from 'react'
import MessagesPage from './MessagePages'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assistant | PondPedia",
  description: "Halaman Asisten Virtual PondPedia",
  // other metadata
};

export default async function Login() {
  return (
    <MessagesPage />
  )
}
