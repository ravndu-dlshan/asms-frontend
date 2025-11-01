"use client";
import React, { useEffect, useState } from 'react';

export default function Page() {
  const [userInfo, setUserInfo] = useState('');

  useEffect(() => {
    setUserInfo(localStorage.getItem("userInfo") || '');
  }, []);

  return (
    <div>
      <h2>{userInfo}</h2>
      <h1>Hi this is Employee Here!</h1>
    </div>
  );
}