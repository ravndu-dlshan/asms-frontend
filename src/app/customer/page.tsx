"use client";

import React, { useEffect, useState } from 'react';

export default function Customer() {
  const [userInfo, setUserInfo] = useState('');

  useEffect(() => {
    setUserInfo(localStorage.getItem("userInfo") || '');
  }, []);

  return (
    <div>
      <h2>{userInfo}</h2>
      <h1>Hi this is Customer Here!</h1>
    </div>
  );
}
