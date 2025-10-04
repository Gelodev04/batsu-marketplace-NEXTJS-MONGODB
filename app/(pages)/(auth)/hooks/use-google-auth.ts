"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export function useGoogleSignIn(
  defaultCallback = "/profile" 
) {
  const [googleLoading, setGoogleLoading] = useState(false);

  const signInWithGoogle = async (callbackUrl = defaultCallback) => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } finally {
      setGoogleLoading(false);
    }
  };

  return { googleLoading, signInWithGoogle };
}
