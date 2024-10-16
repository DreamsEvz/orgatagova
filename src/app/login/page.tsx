"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signIn } from "next-auth/react";

const Login = () => {
  const signInWithProvider = async (provider: string) => {
    await signIn(provider);
  };

  return (
    <div className="h-svh flex justify-center items-center">
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
};

export default Login;
