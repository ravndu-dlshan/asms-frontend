"use client";

import React from 'react'

export default function page() {
  return (
    <div>
      <h1>{localStorage.getItem("userInfo")}</h1>
      <h1>Hi this is Customer Here!</h1>
    </div>
  )
}
