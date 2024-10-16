"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  const signInWithProvider = async (provider: string) => {
    await signIn(provider);
    router.push("/carpool");
  };

  return (
    <div className="h-svh flex justify-center">
      <Card>
        <h1>Connectez-vous</h1>
        <Button
          onClick={() => {
            signInWithProvider("google");
          }}
        >
          Se connecter avec Google
        </Button>
      </Card>
    </div>
  );
}
