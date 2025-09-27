"use client";
import React from 'react'

export default function page() {
  return (
    <div>
      <h2>{localStorage.getItem("userInfo")}</h2>
      <h1>Hi this is Employee Here!</h1>
    </div>
  )
}
