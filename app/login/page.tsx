"use client";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {

  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col justify-center items-center gap-4 p-4">
      <Card className="w-full max-w-md p-8 bg-white/10 backdrop-blur-sm border-white/20 flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-center text-white">Orgatagova</h1>
        <Button 
          onClick={() => signIn("google")}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white"
        >
          <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
          Se connecter avec Google
        </Button>
        <Button disabled className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white">
          <Image src="/microsoft-icon.svg" alt="Apple" width={20} height={20} />
          Se connecter avec Microsoft
        </Button>
        <Button disabled className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white">
          <Image src="/facebook-icon.svg" alt="Apple" width={20} height={20} />
          Se connecter avec Facebook
        </Button>

        <Button onClick={() => {router.push("/")}}>Retourner à l'accueil</Button>
      </Card>
    </main>
  );
}