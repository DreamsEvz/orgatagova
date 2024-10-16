"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();

  return (
    <div>
      <Button
        onClick={async () => {
          await signOut({ redirect: false }); // Empêche la redirection automatique
          router.push("/"); // Redirige manuellement après déconnexion
        }}
      >
        Se déconnecter
      </Button>
    </div>
  );
};

export default Profile;
