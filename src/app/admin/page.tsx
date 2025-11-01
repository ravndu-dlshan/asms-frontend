"use client";

import React, { useEffect, useState } from 'react';

export default function Admin() {
  const [userInfo, setUserInfo] = useState('');

  useEffect(() => {
    setUserInfo(localStorage.getItem("userInfo") || '');
  }, []);

  return (
    <div>
      {/* <h2>{localStorage.getItem("userInfo")}</h2> */}
      <h1>Hi this is Admin Here!</h1>
    </div>
  );
}